// app/invest/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { WebView } from 'react-native-webview'; // 👈 أضف هذا
import Header from '../components/header';
import Footer from '../components/footer';
import { Colors } from '@/constants/theme';
import { API_BASE_URL } from '@/config/api';


const InvestScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [project, setProject] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  // 👇 أضف هذه الـ states
  const [processing, setProcessing] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [payPalUrl, setPayPalUrl] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 أضف هذه الدالة

  const handleInvestWithPayPal = async () => {
    console.log('1️⃣ Starting investment process...');
    console.log('2️⃣ Amount:', amount);
    console.log('3️⃣ Project ID:', id);
  
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
  
    if (project && parseFloat(amount) < project.price) {
      Alert.alert('Error', `Minimum investment is $${project.price}`);
      return;
    }
  
    setProcessing(true);
    console.log('4️⃣ Set processing to true');
    
    try {
      const url = `${API_BASE_URL}/api/paypal/create-order`;
      console.log('5️⃣ Fetching URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: id,
          amount: parseFloat(amount)
        })
      });
      
      console.log('6️⃣ Response status:', response.status);
      
      const data = await response.json();
      console.log('7️⃣ Response data:', data);
      
      if (data.success) {
        console.log('8️⃣ Success! Opening PayPal URL:', data.approve_url);
        setPayPalUrl(data.approve_url);
        setShowPayPal(true);
      } else {
        console.log('8️⃣ Error from server:', data.error);
        Alert.alert('Error', data.error || 'Something went wrong');
      }
    } catch (error) {
      console.log('9️⃣ Catch error:', error);
      Alert.alert('Error', 'Failed to process payment');
    } finally {
      setProcessing(false);
      console.log('🔟 Set processing to false');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      
      {!showPayPal ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Invest in {project?.product_name}</Text>
            
            <View style={[styles.infoBox ,{backgroundColor:theme.background/*'rgba(54, 65, 68, 0.9)'}*/}]}>
              <Text style={[styles.label, { color: theme.text + '80' }]}>Minimum Investment</Text>
              <Text style={[styles.amount, { color: theme.tint }]}>${project?.price}</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Amount to Invest ($)</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.background,
                  borderColor: theme.text + '20',
                  color: theme.text 
                }]}
                placeholder="Enter amount"
                placeholderTextColor={theme.text + '60'}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor:'rgba(103, 197, 231, 0.9)' /*theme.tint*/ }, processing && styles.disabled]}
              onPress={handleInvestWithPayPal}
              disabled={processing}
            >
              {processing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[styles.buttonText,{color:theme.text}]}>Pay with PayPal</Text>
              )}
            </TouchableOpacity>
          </View>
          <Footer />
        </ScrollView>
      ) : (
        <View style={styles.webViewContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowPayPal(false)}
          >
            <ArrowLeft size={24} color={theme.text} />
            <Text style={{ color: theme.text, marginLeft: 8 }}>Back</Text>
          </TouchableOpacity>
          <WebView
            source={{ uri: payPalUrl }}
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
            incognito={true}
            cacheEnabled={false}
            style={styles.webView}
            onNavigationStateChange={(navState) => {
                console.log('🌐 PayPal URL:', navState.url); 
                const myServerSuccess = "http://10.52.198.8:8000/api/paypal/success";
    const myServerCancel = "http://10.52.198.8:8000/api/paypal/cancel";
              if (navState.url.includes(myServerSuccess/*'payment/success'*/)) {
                setShowPayPal(false);
                Alert.alert(
                  'Success', 
                  'Payment completed successfully!',
                  [{ text: 'OK', onPress: () => router.push('/invest') }]
                );
              } else if (navState.url.includes(/*'payment/cancel'*/myServerCancel)) {
                setShowPayPal(false);
                Alert.alert('Cancelled', 'Payment was cancelled');
              }
            }}
          />
      
        </View>
      )}
      
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { flexGrow: 1, padding: 16 },
  backButton: { marginBottom: 16 },
  card: { borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.04, elevation: 2 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  infoBox: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 20 },
  label: { fontSize: 12, marginBottom: 4 },
  amount: { fontSize: 24, fontWeight: '700' },
  formGroup: { marginBottom: 20 },
  input: { width: '100%', padding: 12, borderRadius: 8, borderWidth: 1, fontSize: 16 },
  button: { padding: 14, borderRadius: 8, alignItems: 'center' },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  webViewContainer: { flex: 1 },
  closeButton: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  webView: { flex: 1 },
});

export default InvestScreen;