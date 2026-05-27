import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, CircleAlert as AlertCircle, Lock, User, Mail } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const router = useRouter();
  const { login, register, isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');

  const validateUsername = (value: string) => {
    if (value.length === 0) {
      setUsernameError('');
      return;
    }
    const pattern = /^u\d{0,6}$/;
    if (!pattern.test(value)) {
      setUsernameError('Format must be: u followed by digits (e.g. u123456)');
    } else {
      setUsernameError('');
    }
  };

  const handleUsernameChange = (text: string) => {
    const lower = text.toLowerCase();
    setUsername(lower);
    validateUsername(lower);
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError('Please enter your institutional username.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (isRegistering && !email.trim()) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = isRegistering 
      ? await register(username.trim(), password, email.trim()) 
      : await login(username.trim(), password);
      
    setLoading(false);

    if (result.success) {
      if (result.needsOnboarding) {
        router.replace('/onboarding' as any);
      } else {
        router.replace('/(tabs)');
      }
    } else {
      setError(result.error || 'Authentication failed.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>UPF</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>Universitat Pompeu Fabra</Text>
          <Text style={styles.headerSubtitle}>Campus Mobile</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isRegistering ? 'Create Account' : 'Sign in'}</Text>
            <Text style={styles.cardSubtitle}>
              Use your institutional UPF account to access student services.
            </Text>

            {error ? (
              <View style={styles.errorBanner}>
                <AlertCircle size={16} color={colors.primaryRed} />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Username</Text>
              <View
                style={[
                  styles.inputWrapper,
                  usernameError ? styles.inputWrapperError : null,
                ]}
              >
                <User size={18} color={colors.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. u123456"
                  placeholderTextColor={colors.textTertiary}
                  value={username}
                  onChangeText={handleUsernameChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                />
              </View>
              {usernameError ? (
                <Text style={styles.fieldError}>{usernameError}</Text>
              ) : (
                <Text style={styles.fieldHint}>Format: u + 6 digits (e.g. u123456)</Text>
              )}
            </View>

            {isRegistering && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={18} color={Colors.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Your email address"
                    placeholderTextColor={Colors.textTertiary}
                    value={email}
                    onChangeText={(t) => { setEmail(t); if (error) setError(''); }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                  />
                </View>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color={colors.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your UPF password"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (error) setError('');
                  }}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={colors.textTertiary} />
                  ) : (
                    <Eye size={18} color={colors.textTertiary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.rememberRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>{isRegistering ? 'Register' : 'Sign in'}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.helpButton} activeOpacity={0.7} onPress={() => { setIsRegistering(!isRegistering); setError(''); }}>
              <Text style={styles.helpButtonText}>{isRegistering ? 'Already have an account? Sign in' : 'No account? Create one'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Having trouble? Contact{' '}
              <Text style={styles.footerLink}>suport.tic@upf.edu</Text>
            </Text>
            <Text style={styles.footerVersion}>UPF Campus Mobile · v4.2.1</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors: typeof Colors) => StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.primaryRed },
  scrollContent: { flexGrow: 1 },

  header: {
    backgroundColor: colors.primaryRed,
    paddingTop: 72,
    paddingBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: { marginBottom: 16 },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primaryRed,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },

  body: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primaryRedLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.primaryRed,
    lineHeight: 18,
  },

  fieldGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    height: 50,
  },
  inputWrapperError: { borderColor: colors.primaryRed },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    height: '100%',
  },
  eyeButton: { padding: 4 },
  fieldHint: { fontSize: 12, color: colors.textTertiary, marginTop: 5 },
  fieldError: { fontSize: 12, color: colors.primaryRed, marginTop: 5 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 4,
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  checkboxChecked: {
    backgroundColor: colors.primaryRed,
    borderColor: colors.primaryRed,
  },
  checkmark: { fontSize: 12, color: '#fff', fontWeight: '700' },
  rememberText: { fontSize: 14, color: colors.textSecondary },
  forgotText: { fontSize: 14, color: colors.primaryRed, fontWeight: '600' },

  loginButton: {
    backgroundColor: colors.primaryRed,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.cardBorder },
  dividerText: { fontSize: 13, color: colors.textTertiary },

  helpButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  helpButtonText: { fontSize: 14, color: colors.textSecondary },

  footer: { marginTop: 24, alignItems: 'center', gap: 6 },
  footerText: { fontSize: 12, color: colors.textTertiary, textAlign: 'center' },
  footerLink: { color: colors.primaryRed },
  footerVersion: { fontSize: 11, color: colors.textTertiary },
});
