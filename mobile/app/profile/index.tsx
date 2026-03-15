import React, { useState, useMemo } from 'react';
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

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // نفس الثيم الخاص بصفحة الـ Dashboard لضمان الاستمرارية
  const theme = {
    bg: isDark ? '#0f172a' : '#f8f9fa',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#2b2d42',
    muted: isDark ? '#94a3b8' : '#8d99ae',
    border: isDark ? '#334155' : '#e9ecef',
    primary: '#4361ee'
  };

  // الحالة (State) لإدارة البيانات كما في كود PHP
  const [user, setUser] = useState({
    username: "Mohammed",
    email: "moha772876@gmail.com",
    role: "Premium Investor",
    photo: 'https://via.placeholder.com/150'
  });

  const [hasChanges, setHasChanges] = useState(false);

  // دالة التعامل مع التغيير في الحقول
  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
    setHasChanges(true); // تفعيل زر الحفظ عند حدوث أي تغيير
  };

  return (
    <>
      <Header />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* --- 1. Profile Sidebar (المحاكي لكود PHP) --- */}
          <View style={[styles.profileSidebar, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.photoSection}>
              <View style={styles.photoWrapper}>
                <Image source={{ uri: user.photo }} style={styles.mainAvatar} />
                <TouchableOpacity style={styles.editPhotoBtn}>
                  <Ionicons name="camera-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.profileName, { color: theme.text }]}>{user.username}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{user.role}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.sidebarActions}>
              <TouchableOpacity style={styles.actionBtn}>
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
                  value={user.username}
                  onChangeText={(val) => handleInputChange('username', val)}
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
                  value={user.email}
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
                  value={user.role}
                  onChangeText={(val) => handleInputChange('role', val)}
                />
              </View>
            </View>

            {/* زر الحفظ */}
            <TouchableOpacity 
              style={[styles.saveBtn, { backgroundColor: hasChanges ? theme.primary : theme.muted }]}
              disabled={!hasChanges}
              onPress={() => Alert.alert("Success", "Profile updated successfully!")}
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