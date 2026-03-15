import Header from "../components/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from "expo-router";
import { API_BASE_URL } from '../../config/api';

export default function LoginScreen() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { returnTo } = useLocalSearchParams();
  const returnToPath = Array.isArray(returnTo) ? returnTo[0] : returnTo;



  const handleLogin = async () => {
    setErrors({});
    setSuccess('');

    // if (form.password !== form.confirmPassword) {
    //   setErrors({ password: "Passwords do not match" });
    //   return;
    // }

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          // user_name: form.name,
          email: form.email,
          password: form.password,
          // password_confirmation: form.confirmPassword
        })
      });

      const data = await response.json();
      alert(JSON.stringify(data));

      if (!response.ok) {
        setErrors(data.errors || {});
      } else {
        setSuccess(data.message);
        await AsyncStorage.setItem('user_token', data.access_token)

            // 👇 خزن بيانات المستخدم (لو السيرفر بيرجعها)
    if (data.user) {
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    } else {
      // لو السيرفر ما بيرجعش user، استخدم البيانات اللي معاك
      const userData = {
        name: data.user?.name || form.email.split('@')[0], // جزء من الإيميل
        email: form.email
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    }
      //   router.replace('/');
      // setForm({ email: '', password: '' });
        if(returnTo)
        {
          router.replace(returnToPath as any);
        }else
        {
        router.replace('/');
        }
        setForm({ email: '', password: '' });
      }

    } catch (error) {
      console.log("Error:", error);
    }
  };



  return (


    <LinearGradient
      colors={['#2B2D42', '#EF233C']}
      start={{ x: 0.4, y: 0 }} // Mimicking 120deg 60% split
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>

            {/* Glass Card */}
            <BlurView intensity={80} tint="light" style={styles.authCard}>
              <Text style={styles.authTitle}>Enter Your Zetrix Account</Text>

              {success ? (
                <View style={styles.successAlert}>
                  <Text style={styles.successText}>✅ Successful! {success}</Text>
                </View>
              ) : null}

              {/* Form Groups */}
              <View style={styles.form}>

                {/* <InputField 
                  label="Full Name" 
                  icon="person-outline" 
                  placeholder="Enter your full name" 
                  onChangeText={(val:string) => setForm({...form, name: val})}
                /> */}

                <InputField
                  label="Email Address"
                  icon="mail-outline"
                  placeholder="Enter your email"
                  error={errors.email}
                  onChangeText={(val: string) => setForm({ ...form, email: val })}
                />

                <InputField
                  label="Password"
                  icon="lock-closed-outline"
                  placeholder="Enter a password"
                  secureTextEntry
                  onChangeText={(val: string) => setForm({ ...form, password: val })}
                />
                {/* 
                <InputField 
                  label="Confirm Password" 
                  icon="lock-closed-outline" 
                  placeholder="Confirm your password" 
                  secureTextEntry
                  error={errors.password}
                  onChangeText={(val:string) => setForm({...form, confirmPassword: val})}
                /> */}

                <TouchableOpacity style={styles.authBtn} onPress={handleLogin}>
                  <Text style={styles.authBtnText}>Log in</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => { router.push('/signup')/* Navigate to Sign Up */ }}>
                <Text style={styles.authSwitch}>
                  Already have an account? <Text style={styles.link}>Sign Up</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { router.push('/forgetpassword') }}>
                <Text style={styles.authSwitch}>
                  <Text style={styles.link}>Forget Passwoed ?</Text>
                </Text>
              </TouchableOpacity>
            </BlurView>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Sub-component for clean inputs
const InputField = ({ label, icon, error, ...props }: {
  label: any;
  icon: any;
  error?: any;
  [x: string]: any;
}) => (
  <View style={styles.formGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputIcon, error && { borderColor: 'red' }]}>
      <Ionicons name={icon} size={20} color="#8D99AE" style={{ marginRight: 8 }} />
      <TextInput style={styles.input} placeholderTextColor="#8D99AE" {...props} />
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
    overflow: 'hidden', // Required for BlurView
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
  authBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  authSwitch: {
    marginTop: 20,
    color: '#8D99AE',
    fontSize: 15,
  },
  link: { color: '#2B2D42', fontWeight: '700' },
  successAlert: {
    backgroundColor: '#e6f9ec',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 15,
    borderLeftWidth: 6,
    borderLeftColor: '#2ecc71',
  },
  successText: { color: '#256029', fontWeight: '600' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 }
});