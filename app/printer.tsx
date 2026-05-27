import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Send, Info } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';

const recipientEmail = 'impressio.estudiants@upf.edu';
const STORAGE_KEY_ORIGIN_EMAIL = '@printer_origin_email';

export default function PrinterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem(STORAGE_KEY_ORIGIN_EMAIL);
        if (storedEmail) {
          setEmail(storedEmail);
        }
      } catch {
        // ignore load errors
      }
    };

    loadEmail();
  }, []);

  const saveOriginEmail = async (value: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ORIGIN_EMAIL, value);
    } catch {
      // ignore save errors
    }
  };

  const handleEmailBlur = () => {
    if (email.trim()) {
      saveOriginEmail(email.trim());
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      setError('Por favor escribe tu mensaje antes de enviar.');
      return;
    }
    setError('');
    setSending(true);

    if (email.trim()) {
      await saveOriginEmail(email.trim());
    }

    const subject = encodeURIComponent('Mensaje desde la app');
    const body = encodeURIComponent(
      `Nombre: ${name || 'No especificado'}\nCorreo origen: ${email || 'No especificado'}\n\nMensaje:\n${message}`
    );
    const mailto = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    try {
      await Linking.openURL(mailto);
      setStatus('Se ha abierto tu cliente de correo. Revisa tu bandeja para enviar el email.');
    } catch {
      setError('No se pudo abrir el cliente de correo. Por favor inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />
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
            <Mail size={20} color={Colors.primaryRed} />
          </View>
          <Text style={styles.heroTitle}>Escribe tu mensaje</Text>
          <Text style={styles.heroSubtitle}>
            Envía un correo directamente a {recipientEmail} desde esta app.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
            placeholderTextColor={Colors.textTertiary}
          />

          <Text style={styles.label}>Correo origen</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            onBlur={handleEmailBlur}
            placeholder="tu@email.com"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mensaje</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={message}
            onChangeText={setMessage}
            placeholder="Escribe lo que necesitas..."
            placeholderTextColor={Colors.textTertiary}
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
            <Text style={styles.sendButtonText}>{sending ? 'Abriendo correo...' : 'Enviar correo'}</Text>
          </TouchableOpacity>

          <View style={styles.noteBox}>
            <Info size={16} color={Colors.primaryRed} />
            <Text style={styles.noteText}>
              Se abrirá tu cliente de correo para completar el envío. Este método funciona tanto en web como en móvil.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: Colors.primaryRed,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  body: { padding: 20 },
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  heroIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.primaryRedLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  label: { fontSize: 12, fontWeight: '700', color: Colors.textTertiary, textTransform: 'uppercase', marginBottom: 8 },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'web' ? 14 : 12,
    color: Colors.textPrimary,
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  textArea: { minHeight: 140, paddingTop: 14 },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primaryRed,
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 4,
  },
  sendButtonDisabled: { opacity: 0.6 },
  sendButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  errorText: { color: Colors.primaryRed, marginBottom: 12, fontSize: 13 },
  successText: { color: Colors.primaryGreen, marginBottom: 12, fontSize: 13 },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.primaryRedLight,
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
  },
  noteText: { color: Colors.primaryRed, flex: 1, fontSize: 13, lineHeight: 18 },
});
