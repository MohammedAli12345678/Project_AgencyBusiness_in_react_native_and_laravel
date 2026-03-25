


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Linking,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Colors } from '../constants/theme';
import Header from './components/header';
import Footer from './components/footer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@/config/api';

// MapView و Marker فقط على الموبايل
let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch (e) {
    console.warn('Maps library is not installed');
  }
}

export default function ContactScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');

  // إرسال الرسالة
  const handleSubmit = async() => {
    if (!email || !subject || !message) {
      setSuccess('⚠️ Please fill all fields');
      return;
    }
    try{
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,      // هذا هو المتغير الذي سيصبح $customerEmail في لارافيل
          subject: subject,
          message: message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('✅ تم إرسال رسالة بنجاح');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setSuccess('❌ خطأ: ' + data.message);
      }

    }catch(error){
    setSuccess('❌ تأكد من اتصالك بالسيرفر');
    }
  };

  // روابط خارجية
  const handleEmailPress = () => Linking.openURL('mailto:moha772876@gmail.com');
  const handleWhatsAppPress = () => Linking.openURL('https://wa.me/967772867128');

  const openMap = () => {
    const lat = 40.7128;
    const lng = -74.0060;
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
      web: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Header />
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient colors={['#2B2D42', '#EF233C']} style={styles.heroSection}>
          <Text style={styles.headerTitle}>Contact Us</Text>
          <Text style={styles.headerText}>We'd love to hear from you!</Text>
        </LinearGradient>

        {/* Contact Info */}
        <View style={styles.infoBox}>
          <Text style={[styles.sectionSubtitle, { color: '#EF233C' }]}>GET IN TOUCH</Text>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Information</Text>

          {/* Email */}
          <TouchableOpacity onPress={handleEmailPress} style={styles.contactItem}>
            <View style={[styles.iconBox, { backgroundColor: theme.tint + '20' }]}>
              <Ionicons name="mail-outline" size={22} color={theme.tint} />
            </View>
            <View>
              <Text style={[styles.itemTitle, { color: theme.text }]}>Email</Text>
              <Text style={[styles.itemText, { color: theme.icon }]}>moha772876@gmail.com</Text>
            </View>
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity onPress={handleWhatsAppPress} style={styles.contactItem}>
            <View style={[styles.iconBox, { backgroundColor: theme.tint + '20' }]}>
              <Ionicons name="call-outline" size={22} color={theme.tint} />
            </View>
            <View>
              <Text style={[styles.itemTitle, { color: theme.text }]}>Phone</Text>
              <Text style={[styles.itemText, { color: theme.icon }]}>+967772867128</Text>
            </View>
          </TouchableOpacity>

          {/* Address */}
          <View style={styles.contactItem}>
            <View style={[styles.iconBox, { backgroundColor: theme.tint + '20' }]}>
              <Ionicons name="location-outline" size={22} color={theme.tint} />
            </View>
            <View>
              <Text style={[styles.itemTitle, { color: theme.text }]}>Address</Text>
              <Text style={[styles.itemText, { color: theme.icon }]}>New York, USA</Text>
            </View>
          </View>
        </View>

        {/* Contact Form */}
        <View style={[styles.form, { backgroundColor: theme.background }]}>
          {success !== '' && (
            <Text style={[styles.alertText, { color: success.includes('✅') ? '#2ecc71' : '#e74c3c' }]}>
              {success}
            </Text>
          )}

          <Text style={[styles.inputLabel, { color: theme.text }]}>Your Email</Text>
          <TextInput
            placeholder="name@example.com"
            placeholderTextColor={theme.icon}
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { color: theme.text, borderColor: theme.icon, backgroundColor: theme.background }]}
          />

          <Text style={[styles.inputLabel, { color: theme.text }]}>Subject</Text>
          <TextInput
            placeholder="How can we help?"
            placeholderTextColor={theme.icon}
            value={subject}
            onChangeText={setSubject}
            style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
          />

          <Text style={[styles.inputLabel, { color: theme.text }]}>Your Message</Text>
          <TextInput
            placeholder="Leave a comment..."
            placeholderTextColor={theme.icon}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            style={[styles.textArea, { color: theme.text, borderColor: theme.icon }]}
          />

          <TouchableOpacity onPress={handleSubmit} style={[styles.button, { backgroundColor: '#0a7ea4' }]}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          {Platform.OS !== 'web' && MapView ? (
            <>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 40.7128,
                  longitude: -74.0060,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={{ latitude: 40.7128, longitude: -74.0060 }}
                  title="Our Location"
                  description="We are here"
                />
              </MapView>
              <TouchableOpacity onPress={openMap} style={styles.mapButton}>
                <Ionicons name="navigate" size={18} color="#fff" />
                <Text style={styles.mapButtonText}>Open in Maps</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={openMap}
              style={[styles.map, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}
            >
              <Ionicons name="map-outline" size={40} color={theme.icon} />
              <Text style={{ color: theme.text, marginTop: 10 }}>View Location on Google Maps</Text>
            </TouchableOpacity>
          )}
        </View>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 20 },
  heroSection: { paddingTop: 60, paddingBottom: 40, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  headerText: { color: '#fff', marginTop: 10, opacity: 0.9 },
  infoBox: { padding: 25 },
  sectionSubtitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 5 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  contactItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemText: { fontSize: 14, marginTop: 2 },
  form: { padding: 25, marginTop: -10 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 15 },
  textArea: { borderWidth: 1, borderRadius: 12, padding: 14, height: 120, marginBottom: 20, textAlignVertical: 'top' },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  alertText: { marginBottom: 15, fontWeight: '600', textAlign: 'center' },
  mapContainer: { height: 300, margin: 20, borderRadius: 20, overflow: 'hidden', backgroundColor: '#fff', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  map: { flex: 1 },
  mapButton: { position: 'absolute', bottom: 15, right: 15, backgroundColor: '#0a7ea4', flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  mapButtonText: { color: '#fff', marginLeft: 5, fontWeight: '600' },
});