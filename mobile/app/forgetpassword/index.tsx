import Header from "../components/header";
import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState(''); // تعيين قيمة افتراضية
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async () => {
    // التحقق من إدخال البريد الإلكتروني
    if (!email || email.trim() === '') {
      Alert.alert('تنبيه', 'الرجاء إدخال البريد الإلكتروني');
      return;
    }

    // التحقق من صيغة البريد الإلكتروني (اختياري)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('تنبيه', 'الرجاء إدخال بريد إلكتروني صحيح');
      return;
    }

    setLoading(true);

    try {
      console.log('Sending OTP to:', email);

      const response = await axios.post(`${API_BASE_URL}/api/send-otp`, {
        email: email // إرسال بشكل صحيح
      });

      console.log('Response:', response.data);

      // الانتقال إلى صفحة التحقق مع تمرير email
      router.push({
        pathname: '/forgetpassword/verifyOtp',
        params: { email: email } // ✅ تمرير email ككائن
      });

    } catch (error) {
      console.error('Error:', error);

      if (axios.isAxiosError(error)) {
        // عرض رسالة الخطأ من السيرفر إذا وجدت
        const errorMessage = error.response?.data?.message ||
          error.response?.data?.errors?.email?.[0] ||
          'البريد الإلكتروني غير موجود';
        Alert.alert('خطأ', errorMessage);
      } else {
        Alert.alert('خطأ', 'حدث خطأ في الاتصال بالخادم');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={['#2B2D42', '#EF233C']}
      start={{ x: 0.4, y: 0 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <BlurView intensity={80} tint="light" style={styles.authCard}>
              <Text style={styles.authTitle}>تغيير كلمة المرور</Text>

              <View style={styles.form}>
                <InputField
                  label="البريد الإلكتروني"
                  icon="mail-outline"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={[styles.authBtn, loading && styles.disabledBtn]}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  <Text style={styles.authBtnText}>
                    {loading ? 'جاري الإرسال...' : 'إرسال الرمز'}
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// InputField component
const InputField = ({ label, icon, error, ...props }: {
  label: any;
  icon: any;
  error?: any;
  [x: string]: any;
}) => (
  <View style={styles.formGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputIcon, error && styles.inputError]}>
      <Ionicons name={icon} size={20} color="#8D99AE" style={{ marginRight: 8 }} />
      <TextInput
        style={styles.input}
        placeholderTextColor="#8D99AE"
        {...props}
      />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  authCard: {
    padding: 30,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2B2D42',
    textAlign: 'center',
    marginBottom: 25,
    letterSpacing: 0.5,
  },
  form: { width: '100%', gap: 15 },
  formGroup: { marginBottom: 12 },
  label: {
    fontSize: 14,
    color: '#2B2D42',
    fontWeight: '600',
    marginBottom: 6,
  },
  inputIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#8D99AE',
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: 'red',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#2B2D42',
    fontSize: 16,
  },
  authBtn: {
    backgroundColor: '#EF233C',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 10,
    shadowColor: '#EF233C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledBtn: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  authBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 }
});