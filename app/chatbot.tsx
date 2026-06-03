import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Send, Paperclip, X } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface AttachedFile {
  uri: string;
  name: string;
  type: string;
  content?: string;
}

export default function ChatbotScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m the UPF Campus Chatbot. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const genAI = useRef<GoogleGenerativeAI | null>(null);

  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not found in environment variables');
      return;
    }
    genAI.current = new GoogleGenerativeAI(apiKey);
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      console.log('Sending message, attachedFiles count:', attachedFiles.length);
      if (!genAI.current) {
        throw new Error('Gemini API not initialized. API key may be missing.');
      }

      const model = genAI.current.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(input);
      const response = result.response.text();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setAttachedFiles([]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Chatbot Error:', errorMsg, error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${errorMsg}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: false,
      });

      // DocumentPicker result shape differs between platforms/versions.
      const file: any = (result as any).assets?.[0] ?? (result as any);
      if (file && file.uri) {
        let content = '';
        const name = file.name || 'file';
        const mime = file.mimeType || file.type || '';

        try {
          if (mime === 'text/plain' || name.endsWith('.txt')) {
            content = await FileSystem.readAsStringAsync(file.uri);
          } else if (mime.includes('pdf') || name.toLowerCase().endsWith('.pdf')) {
            // Try to extract text from PDF on web using pdfjs-dist.
            try {
              if (Platform.OS === 'web') {
                const res = await fetch(file.uri);
                const arrayBuffer = await res.arrayBuffer();
                // eslint-disable-next-line import/no-unresolved
                const pdfjs = await import('pdfjs-dist');
                // Ensure the worker is set up for web
                if (!pdfjs.GlobalWorkerOptions.workerSrc) {
                  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
                }
                const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
                let text = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const contentItems = await page.getTextContent();
                  const pageText = contentItems.items.map((it: any) => (it.str ? it.str : '')).join(' ');
                  text += pageText + '\n\n';
                }
                content = text || `[File: ${name}]`;
              } else {
                // On native, reading and parsing PDFs in-app is non-trivial.
                // Fallback: attach placeholder and let server-side/text-provided context be used.
                content = `[PDF attached: ${name}]. (Text extraction not available on device.)`;
              }
            } catch (pdfErr) {
              console.warn('PDF parse failed:', pdfErr);
              content = `[File: ${name}]`;
            }
          } else {
            // Other binary/doc types: we don't extract in-app currently
            content = `[File: ${name}]`;
          }
        } catch {
          content = `[Unable to read file: ${name}]`;
        }

        const newFile: AttachedFile = {
          uri: file.uri,
          name,
          type: mime || 'unknown',
          content,
        };

        setAttachedFiles((prev) => [...prev, newFile]);
        console.log('Picked file:', newFile);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UPF Chatbot</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.mainContent}>
        {/* Sidebar de archivos */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Archivos</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.filesListContainer}>
            {attachedFiles.length === 0 ? (
              <Text style={styles.sidebarEmpty}>Sin archivos</Text>
            ) : (
              attachedFiles.map((file, index) => (
                <View key={index} style={styles.sidebarFileItem}>
                  <Text style={styles.sidebarFileName} numberOfLines={2}>
                    {file.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveFile(index)}
                    style={styles.sidebarRemoveButton}
                  >
                    <X size={16} color={colors.primaryRed} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        {/* Chat messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.sender === 'user' ? styles.userRow : styles.botRow,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.sender === 'user' ? styles.userText : styles.botText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={[styles.messageRow, styles.botRow]}>
            <View style={[styles.messageBubble, styles.botBubble]}>
              <ActivityIndicator size="small" color={colors.primaryRed} />
            </View>
          </View>
        )}
      </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            onPress={handlePickDocument}
            disabled={loading}
            style={[styles.attachButton, loading && styles.attachButtonDisabled]}
          >
            <Paperclip size={20} color="#fff" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Ask something..."
            placeholderTextColor={colors.textTertiary}
            value={input}
            onChangeText={setInput}
            editable={!loading}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={loading || input.trim() === ''}
            style={[styles.sendButton, (loading || input.trim() === '') && styles.sendButtonDisabled]}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: typeof Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    mainContent: {
      flex: 1,
      flexDirection: 'row',
    },
    sidebar: {
      width: 200,
      backgroundColor: colors.card,
      borderRightWidth: 1,
      borderRightColor: colors.cardBorder,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    sidebarTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    filesListContainer: {
      flex: 1,
    },
    sidebarEmpty: {
      fontSize: 12,
      color: colors.textTertiary,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: 8,
    },
    sidebarFileItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.background,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 8,
      marginBottom: 8,
      gap: 6,
    },
    sidebarFileName: {
      flex: 1,
      fontSize: 11,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    sidebarRemoveButton: {
      padding: 4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primaryRed,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#fff',
    },
    placeholder: {
      width: 40,
    },
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      gap: 8,
    },
    messageRow: {
      flexDirection: 'row',
      marginVertical: 4,
    },
    userRow: {
      justifyContent: 'flex-end',
    },
    botRow: {
      justifyContent: 'flex-start',
    },
    messageBubble: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 16,
      maxWidth: '80%',
    },
    userBubble: {
      backgroundColor: colors.primaryRed,
    },
    botBubble: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    messageText: {
      fontSize: 14,
      lineHeight: 20,
    },
    userText: {
      color: '#fff',
    },
    botText: {
      color: colors.textPrimary,
    },
    inputContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.separator,
      backgroundColor: colors.background,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
    },
    attachButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryRed,
      alignItems: 'center',
      justifyContent: 'center',
    },
    attachButtonDisabled: {
      opacity: 0.5,
    },
    input: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      maxHeight: 100,
      fontSize: 14,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryRed,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });
