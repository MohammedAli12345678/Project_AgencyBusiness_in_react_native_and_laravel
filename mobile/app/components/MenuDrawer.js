// components/MenuDrawer.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function MenuDrawer() {
  const navigation = useNavigation();
  const router = useRouter();

  // قائمة الصفحات الخاصة بك
  const menuItems = [
    { icon: 'home-outline', label: 'Home', screen: '/' },
    { icon: 'folder-outline', label: 'Projects', screen: 'Projects' },
    { icon: 'call-outline', label: 'Contact', screen: 'Contact' },
    // { icon: 'document-text-outline', label: 'Blog', screen: 'Blog' },
    { icon: 'information-circle-outline', label: 'About', screen: 'About' },
  ];

  const handleNavigation = (screen) => {
    // router.push(`/(tabs)/${screen.toLowerCase()}`)
    router.push(screen.toLowerCase())
    // navigation.navigate(screen);
    // navigation.closeDrawer(); // إغلاق القائمة بعد الضغط
  };

  return (
    <View style={styles.container}>
      {/* Header of Drawer - مطابق للصورة */}
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Zetrix</Text>
        <Text style={styles.drawerSubtitle}>Website Templates</Text>
      </View>

      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <Text style={styles.breadcrumbText}>
          Home » Website Templates » 2025
        </Text>
      </View>

      {/* Menu Items - صفحاتك هنا */}
      <ScrollView style={styles.menuList}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleNavigation(item.screen)}
          >
            <Ionicons name={item.icon} size={24} color="#EF233C" />
            <Text style={styles.menuItemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer links مثل الصورة */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.footerLink} onPress={() => handleNavigation('Support')}>
          <Text style={styles.footerLinkText}>Support Forum</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerLink} onPress={() => handleNavigation('Hiring')}>
          <Text style={styles.footerLinkText}>We Are Hiring!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EF233C',
  },
  drawerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  breadcrumb: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  breadcrumbText: {
    color: '#666',
    fontSize: 12,
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#2B2D42',
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerLink: {
    paddingVertical: 10,
  },
  footerLinkText: {
    fontSize: 14,
    color: '#666',
  },
});