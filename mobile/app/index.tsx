/*
import { Image } from 'expo-image';
import { Platform, StyleSheet,View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import Header from './components/header';
import Footer from './components/footer';
// import { View } from 'react-native/types_generated/index';

export default function HomeScreen() {
  return (
    <>
    <Header/>
    
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <Link href="/signup">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>




        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
      <Footer/>
    </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
*/
/*
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  useColorScheme,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme'; // استيراد ملف الثيم حقك
import Header from './components/header'; // تأكد أن المسار لملف الفوتر صحيح
import Footer from './components/footer';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // اكتشاف وضع النظام (فاتح أو غامق) واستخدام ألوانك
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <>
    <Header/>
    <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        
        
        <LinearGradient
          colors={['#6366f1', '#f472b6']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <Text style={styles.heroTitle}>Welcome to Zetrix</Text>
          <Text style={styles.heroSubtitle}>
            We're a creative company focused on building long-term relationships and delivering innovative digital solutions.
          </Text>
          <View style={styles.heroBtns}>
            <TouchableOpacity style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>Explore Projects</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline}>
              <Text style={styles.btnOutlineText}>Contact Us</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={require('@/assets/images/partial-react-logo.png')} 
            style={styles.heroImg} 
          />
        </LinearGradient>

        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>What We Offer</Text>
          <View style={styles.featuresGrid}>
            <View style={[styles.featureCard, { backgroundColor: theme.background, borderColor: theme.text + '20' }]}>
              <Ionicons name="call-outline" size={32} color="#6366f1" />
              <Text style={[styles.featureTitle, { color: theme.text }]}>24/7 Support</Text>
              <Text style={[styles.featureDesc, { color: theme.text }]}>Our dedicated support team is available round the clock.</Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: theme.background, borderColor: theme.text + '20' }]}>
              <Ionicons name="shield-checkmark-outline" size={32} color="#6366f1" />
              <Text style={[styles.featureTitle, { color: theme.text }]}>Secure Payments</Text>
              <Text style={[styles.featureDesc, { color: theme.text }]}>We ensure all your transactions are protected.</Text>
            </View>
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Get in Touch</Text>
          <TouchableOpacity style={styles.contactCta}>
            <Ionicons name="mail-outline" size={20} color="#fff" />
            <Text style={styles.contactCtaText}>Contact Us</Text>
          </TouchableOpacity>
        </View>

    

          <Footer />
      </ScrollView>
         
          
    </View>
    </>
  
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1 
  },
  heroSection: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,},
    heroTitle: { 
      fontSize: 32, 
      fontWeight: 'bold', 
      color: '#fff', 
      textAlign: 'center' 
    },
    heroSubtitle: { 
      fontSize: 16, 
      color: 'rgba(255,255,255,0.9)', 
      textAlign: 'center', 
      marginVertical: 20,
      lineHeight: 24
    },
    heroBtns: { 
      flexDirection: 'row', 
      gap: 12,
      marginBottom: 10
    },
    btnPrimary: { 
      backgroundColor: '#fff', 
      paddingVertical: 12, 
      paddingHorizontal: 20, 
      borderRadius: 25 
    },
    btnPrimaryText: { 
      color: '#6366f1', 
      fontWeight: 'bold' 
    },
    btnOutline: { 
      borderWidth: 2, 
      borderColor: '#fff', 
      paddingVertical: 10, 
      paddingHorizontal: 20, 
      borderRadius: 25 
    },
    btnOutlineText: { 
      color: '#fff', 
      fontWeight: 'bold' 
    },
    heroImg: { 
      width: width - 40, 
      height: 200, 
      borderRadius: 20, 
      marginTop: 30,
      resizeMode: 'cover'
    },
    section: { 
      padding: 20, 
      marginTop: 20 
    },
    sectionTitle: { 
      fontSize: 24, 
      fontWeight: 'bold', 
      textAlign: 'center', 
      marginBottom: 25 
    },
    featuresGrid: { 
      gap: 15 
    },
    featureCard: { 
      padding: 25, 
      borderRadius: 20, 
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      elevation: 2
    },
    featureTitle: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      marginTop: 15, 
      marginBottom: 8 
    },
    featureDesc: { 
      fontSize: 14, 
      lineHeight: 20, 
      opacity: 0.7 
    },
    contactSection: { 
      padding: 40, 
      alignItems: 'center' 
    },
    contactCta: { 
      flexDirection: 'row', 
      backgroundColor: '#6366f1', 
      paddingVertical: 15, 
      paddingHorizontal: 30, 
      borderRadius: 15, 
      gap: 10, 
      alignItems: 'center' 
    },
    contactCtaText: { 
      color: '#fff', 
      fontWeight: 'bold', 
      fontSize: 16 
    }
  });
  */
import React from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions, useColorScheme, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme'; // استخدام ملف الثيم حقك
import Header from './components/header';
import Footer from './components/footer'; // تأكد من صحة المسار
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const scrllRef = useRef<ScrollView>(null);




  // مصفوفة المشاريع (محاكاة لـ foreach في PHP)
  // const projects = [
  //   { id: '1', name: 'AI Chatting', status: 'New', desc: 'Innovative digital solutions for business.', img: 'https://via.placeholder.com/300' },
  //   { id: '2', name: 'Zetrix App', status: 'Popular', desc: 'Establishing long-term relationships with customers.', img: 'https://via.placeholder.com/300' },
  // ];

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/top-products`)
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error(error))
  }, []);

  const scrollToSection = (yOffset: number) => {
    scrllRef.current?.scrollTo({
      y: yOffset,
      animated: true,
    })
  };

  return (
    <>
      <Header />
      <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} ref={scrllRef}>

          {/* --- 1. Hero Section --- */}
          <LinearGradient
            colors={['#2B2D42', '#EF233C']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            // Mimicking 120deg 60% split
            style={styles.heroSection}
          >
            <Text style={styles.heroTitle}>Welcome to Zetrix</Text>
            <Text style={styles.heroSubtitle}>We're a creative company that focuses on delivering innovative digital solutions.</Text>
            <View style={styles.heroBtns}>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => scrollToSection(700)}><Text style={{ color: '#6366f1', fontWeight: '700' }}>Explore Projects</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnOutline} onPress={() => scrollToSection(1500)}><Text style={{ color: '#fff', fontWeight: '700' }}>Contact Us</Text></TouchableOpacity>
            </View>
            {/* <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.heroImg} /> */}
            <Image source={'http://localhost/assets/uploads/main.jpg'} style={styles.heroImg} />

          </LinearGradient>

          {/* --- 2. Features Section (What We Offer) --- */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>What We Offer</Text>
            <View style={styles.featuresGrid}>
              <FeatureItem icon="call-outline" title="24/7 Support" theme={theme} />
              <FeatureItem icon="shield-checkmark-outline" title="Secure Payments" theme={theme} />
              <FeatureItem icon="cloud-download-outline" title="Daily Updates" theme={theme} />
            </View>
          </View>

          {/* --- 3. Projects Section (التحويل من PHP Foreach) --- */}
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Projects</Text>
            {projects.slice(0, 3).map((item: any) => (
                 <TouchableOpacity 
                  onPress={() => {
                    console.log('📱 Navigating to project:', item.product_id);
                    // router.push(`/project/${item.product_id}`);
                    router.push(`/project/${item.product_id}`);
                  }}
                  activeOpacity={0.7}
                  style={styles.projectCard}
                >
              <View key={item.product_id} style={[styles.projectCard, { backgroundColor: theme.background, borderColor: theme.text + '20' }]}>
                <View style={styles.projectBadge}><Text style={styles.badgeText}>{item.status}</Text></View>
                <Image source={{ uri: item.full_image_path }} style={styles.projectImg} />
                <View style={styles.projectContent}>
                  <Text style={[styles.projectTitle, { color: theme.text }]}>{item.product_name}</Text>
                  <Text style={{ color: theme.text, opacity: 0.7 }}>{item.short_description}</Text>
                  <TouchableOpacity style={styles.viewBtn} 
                         onPress={() => {
                          console.log('📱 Navigating to project:', item.product_id);
                          // router.push(`/project/${item.product_id}`);
                          router.push(`/project/${item.product_id}`);
                        }}
                  ><Text style={styles.viewBtnText}>View Project</Text></TouchableOpacity>
                </View>
              </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* --- 4. Contact Section --- */}
          <View style={styles.contactSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Get in Touch</Text>
            <TouchableOpacity style={styles.contactCta}
              onPress={() => router.push('/contact')}>
              <Ionicons name="mail-outline" size={20} color="#fff" />
              <Text style={styles.contactCtaText} >Contact Us</Text>
            </TouchableOpacity>
          </View>

          <Footer />
        </ScrollView>
      </View>
    </>
  );
}// مكون فرعي للخدمات
const FeatureItem = ({ icon, title, theme }: any) => (
  <View style={[styles.featureCard, { backgroundColor: theme.background, borderColor: theme.text + '15' }]}>
    <Ionicons name={icon} size={28} color="#6366f1" />
    <Text style={[styles.featureTitle, { color: theme.text }]}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  heroSection: { paddingTop: 60, paddingBottom: 30, alignItems: 'center', paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  heroTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  heroSubtitle: { fontSize: 15, color: '#fff', textAlign: 'center', marginVertical: 15, opacity: 0.9 },
  heroBtns: { flexDirection: 'row', gap: 10 },
  btnPrimary: { backgroundColor: '#fff', padding: 12, borderRadius: 20 },
  btnOutline: { borderWidth: 1, borderColor: '#fff', padding: 11, borderRadius: 20 },
  heroImg: { width: width - 60, height: 160, marginTop: 20, borderRadius: 15 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  featuresGrid: { gap: 10 },
  featureCard: { padding: 15, borderRadius: 15, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 15 },
  featureTitle: { fontSize: 16, fontWeight: '600' },
  projectCard: { borderRadius: 20, borderWidth: 1, marginBottom: 20, overflow: 'hidden' },
  projectBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#6366f1', padding: 5, borderRadius: 8, zIndex: 2 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  projectImg: { width: '100%', height: 180 },
  projectContent: { padding: 15 },
  projectTitle: { fontSize: 18, fontWeight: '700', marginBottom: 5 },
  viewBtn: { backgroundColor: '#6366f1', marginTop: 15, padding: 10, borderRadius: 10, alignItems: 'center' },
  viewBtnText: { color: '#fff', fontWeight: 'bold' },
  contactSection: { padding: 30, alignItems: 'center' },
  contactCta: { flexDirection: 'row', backgroundColor: '#6366f1', padding: 15, borderRadius: 12, gap: 10 },
  contactCtaText: { color: '#fff', fontWeight: 'bold' }
});