import React, { useState, useMemo,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/header';
import Footer from '../components/footer';
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get('window');
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'
import { API_BASE_URL } from '@/config/api';


export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // نفس الثيم الخاص بصفحة الـ Dashboard لضمان الاستمرارية
  const theme = {
    bg: isDark ? '#0f172a' : '#f8f9fa',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#2b2d42',
    muted: isDark ? '#94a3b8' : '#8d99ae',
    border: isDark ? '#334155' : '#e9ecef',
    primary: '#4361ee'
  };


 // دالة اختيار الصورة من المعرض
 const pickImage = async () => {
  // طلب الإذن للدخول للمعرض
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('عذراً', 'نحتاج إذن الوصول لمعرض الصور لكي نغير الصورة!');
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes:['images'],
    allowsEditing: true, // تفعيل قص الصورة
    aspect: [1, 1], // صورة مربعة
    quality: 0.7, // تقليل الجودة قليلاً لسرعة الرفع
  });

  if (!result.canceled) {
    // تحديث واجهة المستخدم بالصورة الجديدة مؤقتاً
    setUser({ ...user, photo: result.assets[0].uri });
    setHasChanges(true);
  }
};

// دالة الحفظ وإرسال البيانات للـ Laravel
const handleSave = async () => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('user_token');
    
    // إعداد البيانات كـ FormData لأننا نرسل ملفاً (صورة)
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('role', user.role);

    // إذا كانت الصورة محلية (تبدأ بـ file://) قم بإضافتها
    if (user.photo && user.photo.startsWith('file://')) {
      const filename = user.photo.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      
      formData.append('photo', {
        uri: user.photo,
        name: filename,
        type: type,
      } as any);
    }

    // أرسل الطلب إلى الـ API الخاص بك
    const response = await axios.post(`${API_BASE_URL}/api/update-profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      Alert.alert("نجاح", "تم تحديث البيانات بنجاح!");
      // حفظ البيانات الجديدة في AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      setHasChanges(false);
    }
    } catch (error) {
    // سيطبع لك الخطأ القادم من لارافل بالضبط (مثلاً حقل ناقص في قاعدة البيانات)
    console.log("Laravel Error:", error.response?.data); 
    Alert.alert("خطأ", error.response?.data?.message || "حدثت مشكلة أثناء الحفظ.");
} finally {
    setLoading(false);
  }
};



  // دالة التعامل مع التغيير في الحقول
  const handleInputChange = (field: string, value: string) => {
    setUser((prev: any) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        console.log('🔑 Header Token:', token);
        
        if (token) {
          // 👇 جيب بيانات المستخدم من التخزين
          const userData = await AsyncStorage.getItem('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
        // توحيد البيانات لكي يفهمها الـ Form
        setUser({
          name: parsedUser.name || parsedUser.user_name, // جرب الخيارين لضمان الوجود
          role: parsedUser.role || parsedUser.user_type,
          email: parsedUser.email,
          photo: parsedUser.photo
        });
          } else {
            // لو مفيش بيانات، استخدم الاسم الافتراضي
            setUser({ name: "User" });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Error getting user:', error);
      }
    };
    
    getUserFromToken();
  }, []);

  return (
    <>
      <Header />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* --- 1. Profile Sidebar (المحاكي لكود PHP) --- */}
          <View style={[styles.profileSidebar, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.photoSection}>
              <View style={styles.photoWrapper}>
                <Image source={{ uri: user?.photo }} style={styles.mainAvatar} />
                <TouchableOpacity style={styles.editPhotoBtn}>
                  <Ionicons name="camera-outline" size={20} color="#fff" 
                  onPress={pickImage}/>
                </TouchableOpacity>
              </View>
              <Text style={[styles.profileName, { color: theme.text }]}>{user?.name}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{user?.role}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.sidebarActions}>
              <TouchableOpacity style={styles.actionBtn}
               onPress={()=>{router.push('/forgetpassword')}}
              >
                <Ionicons name="key-outline" size={20} color={theme.text} />
                <Text style={[styles.actionBtnText, { color: theme.text }]}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text style={[styles.actionBtnText, { color: "#ef4444" }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* --- 2. Edit Profile Form --- */}
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.formHeader}>
              <TouchableOpacity style={styles.backLink}>
                <Ionicons name="arrow-back-outline" size={18} color={theme.muted} />
                <Text style={[styles.backText, { color: theme.muted }]}>Back</Text>
              </TouchableOpacity>
              <Text style={[styles.formTitle, { color: theme.text }]}>Edit Profile</Text>
            </View>

            {/* حقل اسم المستخدم */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Username</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                <Ionicons name="person-outline" size={18} color={theme.muted} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={user?.name}
                  onChangeText={(val) => handleInputChange('name', val)}
                />
              </View>
            </View>

            {/* حقل البريد الإلكتروني (Read Only) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.bg, borderColor: theme.border, opacity: 0.6 }]}>
                <Ionicons name="mail-outline" size={18} color={theme.muted} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={user?.email}
                  editable={false}
                />
              </View>
            </View>

            {/* حقل الدور (Role) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Role</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                <Ionicons name="ribbon-outline" size={18} color={theme.muted} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={user?.role}
                  onChangeText={(val) => handleInputChange('role', val)}
                />
              </View>
            </View>

            {/* زر الحفظ */}
            <TouchableOpacity 
              style={[styles.saveBtn, { backgroundColor: hasChanges ? theme.primary : theme.muted }]}
              disabled={!hasChanges || loading}
              onPress={handleSave}
            >
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          <Footer />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Sidebar Styling
  profileSidebar: {
    margin: 16,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
  },
  photoSection: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(67, 97, 238, 0.05)',
  },
  photoWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  mainAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#4361ee',
  },
  editPhotoBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4361ee',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleBadgeText: {
    color: '#4361ee',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  sidebarActions: {
    padding: 15,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  actionBtnText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  // Form Styling
  formCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 100,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  backText: {
    marginLeft: 4,
    fontSize: 14,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  saveBtn: {
    flexDirection: 'row',
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});