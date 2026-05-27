import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Send, Info, Paperclip, X, ChevronDown, ChevronUp, Printer } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

const recipientEmail = 'impressio.estudiants@upf.edu';
const STORAGE_KEY_ORIGIN_EMAIL = '@printer_origin_email';

const PRINT_FORMATS = [
  { label: 'A4 – 210 × 297 mm (Standard)', value: 'A4' },
  { label: 'A3 – 297 × 420 mm', value: 'A3' },
  { label: 'A5 – 148 × 210 mm', value: 'A5' },
  { label: 'A2 – 420 × 594 mm', value: 'A2' },
  { label: 'A1 – 594 × 841 mm', value: 'A1' },
];

type PdfFile = {
  name: string;
  uri: string;
  size?: number;
};

export default function PrinterScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [formatOpen, setFormatOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem(STORAGE_KEY_ORIGIN_EMAIL);
        if (storedEmail) setEmail(storedEmail);
      } catch { /* ignore */ }
    };
    loadEmail();
  }, []);

  const saveOriginEmail = async (value: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ORIGIN_EMAIL, value);
    } catch { /* ignore */ }
  };

  const handleEmailBlur = () => {
    if (email.trim()) saveOriginEmail(email.trim());
  };

  const handlePickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const newFiles: PdfFile[] = result.assets
        .filter((a: DocumentPicker.DocumentPickerAsset) => a.mimeType === 'application/pdf' || a.name.toLowerCase().endsWith('.pdf'))
        .map((a: DocumentPicker.DocumentPickerAsset) => ({ name: a.name, uri: a.uri, size: a.size ?? undefined }));

      if (newFiles.length === 0) {
        Alert.alert('Invalid format', 'Only PDF files are allowed.');
        return;
      }

      setPdfFiles((prev) => {
        const existing = new Set(prev.map((f) => f.name));
        return [...prev, ...newFiles.filter((f) => !existing.has(f.name))];
      });
    } catch {
      Alert.alert('Error', 'Could not open the file picker. Please try again.');
    }
  };

  const handleRemovePDF = (fileName: string) => {
    setPdfFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSend = async () => {
    if (!message.trim()) {
      setError('Please write your message before sending.');
      return;
    }
    setError('');
    setSending(true);

    if (email.trim()) await saveOriginEmail(email.trim());

    const formatLine = selectedFormat ? `\nPrint format: ${selectedFormat}` : '';
    const attachmentLine = pdfFiles.length > 0
      ? `\nAttached files: ${pdfFiles.map((f) => f.name).join(', ')}`
      : '';

    const subject = encodeURIComponent('Message from the app');
    const body = encodeURIComponent(
      `Name: ${name || 'Not specified'}\nFrom email: ${email || 'Not specified'}${formatLine}${attachmentLine}\n\nMessage:\n${message}`
    );
    const mailto = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    try {
      await Linking.openURL(mailto);
      setStatus('Your email client has been opened. Please attach the PDFs manually from your mail client if needed.');
    } catch {
      setError('Could not open the email client. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const selectedFormatLabel = PRINT_FORMATS.find((f) => f.value === selectedFormat)?.label;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Printer</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Mail size={20} color={colors.primaryRed} />
          </View>
          <Text style={styles.heroTitle}>Write your message</Text>
          <Text style={styles.heroSubtitle}>
            Send an email directly to {recipientEmail} from this app.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textTertiary}
          />

          <Text style={styles.label}>From email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            onBlur={handleEmailBlur}
            placeholder="you@email.com"
            placeholderTextColor={colors.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* ── Print format dropdown ── */}
          <Text style={styles.label}>Print format</Text>
          <TouchableOpacity
            style={[styles.input, styles.dropdownTrigger]}
            onPress={() => setFormatOpen((o) => !o)}
            activeOpacity={0.8}
          >
            <View style={styles.dropdownRow}>
              <Printer size={15} color={selectedFormat ? colors.primaryRed : colors.textTertiary} style={{ marginRight: 8 }} />
              <Text style={[styles.dropdownValue, !selectedFormat && styles.dropdownPlaceholder]}>
                {selectedFormatLabel ?? 'Select a format…'}
              </Text>
            </View>
            {formatOpen
              ? <ChevronUp size={16} color={colors.textTertiary} />
              : <ChevronDown size={16} color={colors.textTertiary} />}
          </TouchableOpacity>

          {formatOpen && (
            <View style={styles.dropdownList}>
              {PRINT_FORMATS.map((fmt) => (
                <TouchableOpacity
                  key={fmt.value}
                  style={[styles.dropdownItem, selectedFormat === fmt.value && styles.dropdownItemSelected]}
                  onPress={() => { setSelectedFormat(fmt.value); setFormatOpen(false); }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownItemText, selectedFormat === fmt.value && styles.dropdownItemTextSelected]}>
                    {fmt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── PDF attachments ── */}
          <Text style={[styles.label, { marginTop: 4 }]}>PDF attachments</Text>

          {pdfFiles.length > 0 && (
            <View style={styles.fileList}>
              {pdfFiles.map((file) => (
                <View key={file.name} style={styles.fileItem}>
                  <Paperclip size={14} color={colors.primaryRed} style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                    {file.size ? <Text style={styles.fileSize}>{formatBytes(file.size)}</Text> : null}
                  </View>
                  <TouchableOpacity onPress={() => handleRemovePDF(file.name)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <X size={16} color={colors.textTertiary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.attachButton} onPress={handlePickPDF} activeOpacity={0.8}>
            <Paperclip size={16} color={colors.primaryRed} />
            <Text style={styles.attachButtonText}>
              {pdfFiles.length === 0 ? 'Attach PDF' : 'Add another PDF'}
            </Text>
          </TouchableOpacity>

          <View style={styles.attachNote}>
            <Info size={13} color={colors.textTertiary} />
            <Text style={styles.attachNoteText}>Only PDF files are accepted.</Text>
          </View>

          {/* ── Message ── */}
          <Text style={[styles.label, { marginTop: 8 }]}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={message}
            onChangeText={setMessage}
            placeholder="Write what you need..."
            placeholderTextColor={colors.textTertiary}
            multiline
            textAlignVertical="top"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {status ? <Text style={styles.successText}>{status}</Text> : null}

          <TouchableOpacity
            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
            onPress={handleSend}
            activeOpacity={0.85}
            disabled={sending}
          >
            <Send size={18} color="#fff" />
            <Text style={styles.sendButtonText}>{sending ? 'Opening mail...' : 'Send email'}</Text>
          </TouchableOpacity>

          <View style={styles.noteBox}>
            <Info size={16} color={colors.primaryRed} />
            <Text style={styles.noteText}>
              Your email client will open to complete the sending. This method works on both web and mobile.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const makeStyles = (colors: typeof Colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: colors.primaryRed,
    paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  body: { padding: 20 },
  heroCard: {
    backgroundColor: colors.card, borderRadius: 18, padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 2,
  },
  heroIcon: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: colors.primaryRedLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  heroTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  formCard: {
    backgroundColor: colors.card, borderRadius: 18, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 2,
  },
  label: { fontSize: 12, fontWeight: '700', color: colors.textTertiary, textTransform: 'uppercase', marginBottom: 8 },
  input: {
    backgroundColor: colors.background, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: Platform.OS === 'web' ? 14 : 12,
    color: colors.textPrimary, fontSize: 15, marginBottom: 16,
    borderWidth: 1, borderColor: colors.separator,
  },
  textArea: { minHeight: 140, paddingTop: 14 },
  dropdownTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdownRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dropdownValue: { fontSize: 15, color: colors.textPrimary, flex: 1 },
  dropdownPlaceholder: { color: colors.textTertiary },
  dropdownList: {
    backgroundColor: colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: colors.separator,
    marginTop: -10, marginBottom: 16, overflow: 'hidden',
  },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.separator },
  dropdownItemSelected: { backgroundColor: colors.primaryRedLight },
  dropdownItemText: { fontSize: 14, color: colors.textPrimary },
  dropdownItemTextSelected: { color: colors.primaryRed, fontWeight: '700' },
  fileList: {
    backgroundColor: colors.background, borderRadius: 12,
    borderWidth: 1, borderColor: colors.separator, marginBottom: 12, overflow: 'hidden',
  },
  fileItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.separator,
  },
  fileName: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  fileSize: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },
  attachButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: colors.primaryRed, borderStyle: 'dashed',
    borderRadius: 14, paddingVertical: 13, marginBottom: 8,
    backgroundColor: colors.primaryRedLight,
  },
  attachButtonText: { fontSize: 14, fontWeight: '600', color: colors.primaryRed },
  attachNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  attachNoteText: { fontSize: 12, color: colors.textTertiary },
  sendButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: colors.primaryRed, borderRadius: 16, paddingVertical: 14, marginTop: 4,
  },
  sendButtonDisabled: { opacity: 0.6 },
  sendButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  errorText: { color: colors.primaryRed, marginBottom: 12, fontSize: 13 },
  successText: { color: colors.success, marginBottom: 12, fontSize: 13 },
  noteBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: colors.primaryRedLight, borderRadius: 14, padding: 14, marginTop: 18,
  },
  noteText: { color: colors.primaryRed, flex: 1, fontSize: 13, lineHeight: 18 },
});
