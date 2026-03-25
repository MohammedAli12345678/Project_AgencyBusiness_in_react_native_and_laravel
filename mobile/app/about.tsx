import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  useColorScheme, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useState,useEffect } from 'react';
// استيراد الألوان من ملفك الخاص
import { Colors } from '../constants/theme'; 
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from './components/header';
import Footer from './components/footer';
import { API_BASE_URL } from '../config/api';
import { 
  // ... بقية الاستيرادات
  Linking 
} from 'react-native';

const { width } = Dimensions.get('window');

// بيانات الفريق
// const developers = [
//   { id: 1, name: 'Mohammed Ali', role: 'Full Stack Developer', photo: 'https://via.placeholder.com/150' },
//   { id: 2, name: 'Ahmed Salem', role: 'UI/UX Designer', photo: 'https://via.placeholder.com/150' },
// ];

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  // استخدام الألوان من ملفك (إذا لم تتوفر يختار light كافتراضي)
  const theme = Colors[colorScheme] ?? Colors.light;

  const [developers, setDevelopers] = useState([]); // مصفوفة فارغة في البداية
  const [loading, setLoading] = useState(true);
  

  // جلب البيانات من لارافيل
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/developers`) // استبدل برابط الـ API الخاص بك
      .then((response) => response.json())
      .then((json) => {
        setDevelopers(json);
        setLoading(false);
        console.log("First Developer Photo:", developers[0]?.photo_url);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
    <Header/>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Hero Section - يستخدم ألوان الهوية الخاصة بك */}
          {/* <LinearGradient colors={['#2B2D42', '#EF233C']} style={styles.heroSection}> */}
           {/* </LinearGradient> */}
                     <LinearGradient
                       colors={['#2B2D42', '#EF233C']}
                       start={{ x: 0.5, y: 0 }}
                       end={{ x: 0.5, y: 1 }}
                       // Mimicking 120deg 60% split
                       style={styles.heroSection}
                     >
          <Text style={styles.heroTitle}>About Zetrix</Text>
          <Text style={styles.heroText}>
            Empowering innovation, building trust, and delivering digital excellence for a brighter tomorrow.
          </Text>
                       {/* <Text style={styles.heroTitle}>Welcome to Zetrix</Text> */}
                       {/* <Text style={styles.heroSubtitle}>We're a creative company that focuses on delivering innovative digital solutions.</Text> */}
                       {/* <View style={styles.heroBtns}> */}
                         {/* <TouchableOpacity style={styles.btnPrimary} onPress={() => scrollToSection(700)}><Text style={{ color: '#6366f1', fontWeight: '700' }}>Explore Projects</Text></TouchableOpacity> */}
                         {/* <TouchableOpacity style={styles.btnOutline} onPress={() => scrollToSection(1500)}><Text style={{ color: '#fff', fontWeight: '700' }}>Contact Us</Text></TouchableOpacity> */}
                    
                       {/* <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.heroImg} /> */}
                       {/* <Image source={'http://localhost/assets/uploads/main.jpg'} style={styles.heroImg} /> */}
           
                     </LinearGradient>
      

        {/* Our Story Section */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <Text style={[styles.sectionSubtitle, { color: '#6366f1' }]}>OUR MISSION</Text>
          <Text style={[styles.sectionTitle, { color: theme.text, textAlign: 'left' }]}>Our Story</Text>
          <View style={styles.storyContent}>
            <Text style={[styles.paragraph, { color: theme.icon }]}>
              Zetrix was founded with a vision to revolutionize the digital landscape. Our mission is to empower businesses and individuals with innovative technology solutions that drive growth, efficiency, and creativity.
            </Text>
            <Image 
              source={{ uri: `${API_BASE_URL}/storage/images/blog-1.jpg` }} 
              style={styles.storyImg} 
            />
          </View>
        </View>

        {/* Team Section */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Meet Our Team</Text>
          <View style={[styles.titleUnderline, { backgroundColor: theme.tint }]} />
          
          <View style={styles.teamGrid}>
          {developers.map((dev) => (
  <View key={dev.id} style={[styles.teamCard, { backgroundColor: theme.background, borderColor: theme.icon + '20', borderWidth: 1 }]}>
    <View style={[styles.imgWrapper, { borderColor: theme.tint }]}>
      <Image 
        /* تعديل هنا: إذا كان dev.photo يحتوي على اسم الملف فقط، ندمجه مع رابط السيرفر */
        source={{ uri:  dev.photo_url}} 
        style={styles.teamImg} 
      />
    </View>
    <Text style={[styles.teamName, { color: theme.text }]}>{dev.name}</Text>
    <Text style={[styles.teamRole, { color: theme.icon }]}>{dev.role}</Text>
    
    <View style={styles.socialIcons}>
      <SocialIcon name="logo-linkedin" theme={theme}
      onPress={() => Linking.openURL(dev.linkedin)}/>
      <SocialIcon name="logo-twitter" theme={theme}
      onPress={() => Linking.openURL(dev.twitter)} />
      <SocialIcon name="mail-outline" theme={theme}
      onPress={() => Linking.openURL(`mailto:${dev.email}`)} />
      <SocialIcon name="logo-github" theme={theme}
      onPress={() => Linking.openURL(dev.github)} />
    </View>
  </View>
))}
          </View>
        </View>

        {/* Values Section */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Our Values</Text>
          <View style={[styles.titleUnderline, { backgroundColor: theme.tint }]} />
          
          <View style={styles.valuesGrid}>
            <ValueCard icon="bulb-outline" title="Innovation" desc="Cutting-edge solutions." theme={theme} />
            <ValueCard icon="people-outline" title="Collaboration" desc="Power of teamwork." theme={theme} />
            <ValueCard icon="shield-checkmark-outline" title="Integrity" desc="Honesty & trust." theme={theme} />
            <ValueCard icon="star-outline" title="Excellence" desc="Highest standards." theme={theme} />
          </View>
        </View>
        <Footer/>

      </ScrollView>
    </SafeAreaView>
    </>
  );
}

// مكونات فرعية
const SocialIcon = ({ name, theme,onPress, }) => (
  <TouchableOpacity style={[styles.iconCircle, { backgroundColor: theme.tint + '15' }]}
  onPress={onPress}>
    <Ionicons name={name} size={18} color={theme.tint} />
  </TouchableOpacity>
);

const ValueCard = ({ icon, title, desc, theme }) => (
  <View style={[styles.valueCard, { backgroundColor: theme.background, borderColor: theme.icon + '20', borderWidth: 1 }]}>
    <Ionicons name={icon} size={30} color={theme.tint} />
    <Text style={[styles.valueTitle, { color: theme.text }]}>{title}</Text>
    <Text style={[styles.valueDesc, { color: theme.icon }]}>{desc}</Text>
  </View>
);

const styles = StyleSheet.create({
  hero: {
    paddingVertical: 80,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
  },
  heroText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  section: {
    padding: 25,
    paddingBottom: 40,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  titleUnderline: {
    width: 60,
    height: 4,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 35,
    borderRadius: 2,
  },
  storyContent: {
    marginTop: 15,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 20,
  },
  storyImg: {
    width: '100%',
    height: 220,
    borderRadius: 25,
  },
  teamGrid: {
    gap: 25,
  },
  teamCard: {
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 5,
  },
  imgWrapper: {
    borderWidth: 3,
    borderRadius: 75,
    padding: 5,
    marginBottom: 20,
  },
  teamImg: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  teamName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  teamRole: {
    fontSize: 15,
    marginBottom: 20,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  valueCard: {
    width: (width - 65) / 2,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  valueDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  heroSection: { paddingTop: 60, paddingBottom: 30, alignItems: 'center', paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
});