// Footer.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Footer = () => {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const quickLinks = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Portfolio', url: '/portfolio' },
    { label: 'Blog', url: '/blog' },
    { label: 'Contact', url: '/contact' },
  ];

  const services = [
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'Digital Marketing',
    'Cloud Solutions',
  ];

  const socialLinks = [
    { name: 'logo-facebook', url: '#' },
    { name: 'logo-twitter', url: '' },
    { name: 'logo-instagram', url: '#' },
    { name: 'logo-linkedin', url: '#' },
    { name: 'logo-whatsapp', url: 'https://wa.me/+967772867128'/*'+967772867'*/ },
  ];

  return (
    // <LinearGradient
    //   colors={['#1a237e', '#ff6b6b']}
    //   start={{ x: 0, y: 0 }}
    //   end={{ x: 1, y: 1 }}
    //   locations={[0.6, 1]}
    //   style={styles.footer}
    // >
        <LinearGradient 
          colors={['#2B2D42', '#EF233C']} 
          start={{ x: 0.5, y: 0}}
          end={{ x: 0.5, y: 1 }}
           // Mimicking 120deg 60% split
          style={styles.footer}
        >
        
      <View style={styles.container}>
        {/* Brand Section */}
        <View style={styles.brandSection}>
          <Text style={styles.logo}>Zetrix</Text>
          <Text style={styles.description}>
            Creative company focused on building long-term relationships and delivering innovative digital solutions.
          </Text>
        </View>

        {/* Social Links */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialLinks}>
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialButton}
                onPress={() => openLink(social.url)}
                activeOpacity={0.7}
              >
                <LinearGradient
                    colors={['#2B2D42', '#EF233C']} 
                    start={{ x: 0.4, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.socialGradient}
                >
                  <Ionicons name={social.name} size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Links & Services Row */}
        <View style={styles.linksRow}>
          {/* Quick Links */}
          <View style={styles.linkColumn}>
            <Text style={styles.columnTitle}>Quick Links</Text>
            {quickLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => openLink(link.url)}
                style={styles.linkButton}
              >
                <Text style={styles.linkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Services */}
          <View style={styles.linkColumn}>
            <Text style={styles.columnTitle}>Services</Text>
            {services.map((service, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => openLink('#')}
                style={styles.linkButton}
              >
                <Text style={styles.linkText}>{service}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openLink('mailto:info@zetrix.com')}
          >
            <Ionicons name="mail-outline" size={18} color="#fff" />
            <Text style={styles.contactText}>info@zetrix.com</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openLink('tel:+967772867128')}
          >
            <Ionicons name="call-outline" size={18} color="#fff" />
            <Text style={styles.contactText}>+967772867128</Text>
          </TouchableOpacity>

          <View style={styles.contactItem}>
            <Ionicons name="location-outline" size={18} color="#fff" />
            <Text style={styles.contactText}>123 Business St, NY 10001</Text>
          </View>
        </View>

        {/* Footer Bottom */}
        <View style={styles.bottomSection}>
          <View style={styles.bottomLinks}>
            <TouchableOpacity onPress={() => openLink('/privacy')}>
              <Text style={styles.bottomLink}>Privacy</Text>
            </TouchableOpacity>
            <Text style={styles.dot}>•</Text>
            <TouchableOpacity onPress={() => openLink('/terms')}>
              <Text style={styles.bottomLink}>Terms</Text>
            </TouchableOpacity>
            <Text style={styles.dot}>•</Text>
            <TouchableOpacity onPress={() => openLink('/cookies')}>
              <Text style={styles.bottomLink}>Cookies</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.copyright}>
            © 2024 Zetrix. All rights reserved.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    paddingTop: 30,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  container: {
    paddingHorizontal: 0,
  },
  brandSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f50303',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 18,
    // paddingHorizontal: 20,
  },
  socialSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    opacity: 0.9,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  socialButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  socialGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    // paddingHorizontal: 10,
  },
  linkColumn: {
    flex: 1,
    alignItems: 'center',
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    opacity: 0.9,
  },
  linkButton: {
    paddingVertical: 6,
  },
  linkText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  contactSection: {
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 0, 

  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  contactText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 20,
  },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  bottomLink: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  dot: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
  },
  copyright: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
});

export default Footer;