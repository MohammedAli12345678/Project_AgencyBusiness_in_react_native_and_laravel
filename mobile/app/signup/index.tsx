
/*
import { View, Text, TextInput, TouchableOpacity,Appearance, StyleSheet, useColorScheme } from "react-native";
import { useState } from "react";
import Header from "../components/header";
import { Colors } from "@/constants/theme";
import { LinearGradient } from 'expo-linear-gradient'

export default function SignupScreen() {
  const scheme = useColorScheme();
  const colorScheme = Appearance.getColorScheme();
  const isDark = scheme === "dark";
  const theme = colorScheme === 'dark' ? Colors.dark: Colors.light;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    console.log(form);
  };

  return (
    <>
    <Header/>
    <LinearGradient
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        // Your hex colors
        colors={['#2B2D42', '#EF233C']}
        // Your percentages (0% and 100% as decimals)  
        locations={[0, 1]}
        style={styles.background}
        >
          
    <View
    
      style={[
        styles.container,
        { 
            // backgroundColor: isDark ? "#121212" : "#ffffff" 
            // backgroundColor: theme.background
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            //  color: isDark ? "#ffffff" : "#000000" 
            color: theme.text
            },
        ]}
      >
        Create Account
      </Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor={theme.text}
        style={[styles.input, { color: theme.text}]}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor={isDark ? "#aaa" : "#666"}
        style={[styles.input, { color:theme.text}]}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={isDark ? "#aaa" : "#666"}
        style={[styles.input, { color: theme.text}]}
        onChangeText={(text) => handleChange("password", text)}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        placeholderTextColor={isDark ? "#aaa" : "#666"}
        // style={[styles.input, { color: isDark ? "#fff" : "#000" }]}
        style={[styles.input, { color: theme.text }]}
        onChangeText={(text) => handleChange("password_confirmation", text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
    </LinearGradient>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    width:'100%'
    
  },background:{
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  
  },
  button: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

*/
import Header from "../components/header";
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

export default function SignupScreen() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState('');
  const router = useRouter();


  const handleSignup = async () => {
    setErrors({});
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setErrors({ password: "Passwords do not match" });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          user_name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.confirmPassword
        })
      });

      const data = await response.json();
      // alert(JSON.stringify(data));

      if (!response.ok) {
        setErrors(data.errors || {});
      } else {
        setSuccess(data.message);
        router.push({ pathname: '/verfiy', params: { email: form.email } });
        setForm({ name: '', email: '', password: '', confirmPassword: '' });

      }
      // if(response.status===201)
      // {

      //   // navigation.navigate('VerifyCodeScreen',{email: form.email});

      // }else
      // {
      //   setErrors(data.errors || {});
      // }

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
              <Text style={styles.authTitle}>Create Your Zetrix Account</Text>

              {success ? (
                <View style={styles.successAlert}>
                  <Text style={styles.successText}>✅ Successful! {success}</Text>
                </View>
              ) : null}

              {/* Form Groups */}
              <View style={styles.form}>
                <InputField
                  label="Full Name"
                  icon="person-outline"
                  placeholder="Enter your full name"
                  onChangeText={(val: string) => setForm({ ...form, name: val })}
                />

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
                  placeholder="Create a password"
                  secureTextEntry
                  onChangeText={(val: string) => setForm({ ...form, password: val })}
                />

                <InputField
                  label="Confirm Password"
                  icon="lock-closed-outline"
                  placeholder="Confirm your password"
                  secureTextEntry
                  error={errors.password}
                  onChangeText={(val: string) => setForm({ ...form, confirmPassword: val })}
                />

                <TouchableOpacity style={styles.authBtn} onPress={handleSignup}>
                  <Text style={styles.authBtnText}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => { router.push('/Login')/* Navigate to Login */ }}>
                <Text style={styles.authSwitch}>
                  Already have an account? <Text style={styles.link}>Login</Text>
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