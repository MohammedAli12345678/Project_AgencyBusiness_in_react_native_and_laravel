// app/project/[id].tsx
interface Project {
    product_id: number;
    product_name: string;
    full_image_path: string;
    status: string;
    short_description: string;
    large_description: string;
    price: number;
    progress: number;
    client_name: string;
    start_date: string;
    duration: number;
    comments_count: number;
    rates_count: number;
    rates_avg_rate: number;
    category?: {
      category_name: string;
    };
    language?: Array<{
      language_name: string;
    }>;
  }
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Star, MessageSquare, Clock, TrendingUp } from 'lucide-react-native';
import Header from '../components/header';
import Footer from '../components/footer';
import { Colors } from '@/constants/theme';
import { API_BASE_URL } from '@/config/api';

const ProjectDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Project not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>

        {/* Hero Image */}
        <Image source={{ uri: project.full_image_path }} style={styles.heroImage} />

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Status */}
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>{project.product_name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: project.status === 'Active' ? '#10b981' : '#f59e0b' }]}>
              <Text style={styles.statusText}>{project.status}</Text>
            </View>
          </View>

          {/* Category */}
          <Text style={[styles.category, { color: theme.tint }]}>
            {project.category?.category_name || 'Uncategorized'}
          </Text>

          {/* Description */}
          <Text style={[styles.description, { color: theme.text }]}>
            {project.large_description || project.short_description}
          </Text>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <MessageSquare size={20} color={theme.tint} />
              <Text style={[styles.statValue, { color: theme.text }]}>{project.comments_count || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>Comments</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Star size={20} color="#eab308" /> 
              <Text style={[styles.statValue, { color: theme.text }]}>{project.rates_count ?? (project as any).ratings?.length ??0}</Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>Rates</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <TrendingUp size={20} color="#10b981" />
              <Text style={[styles.statValue, { color: theme.text }]}>{project.rates_avg_rate || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>Avg Rate</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Clock size={20} color={theme.tint} />
              <Text style={[styles.statValue, { color: theme.text }]}>{project.duration || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.text + '80' }]}>Months</Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Project Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.text + '80' }]}>Client</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{project.client_name || 'N/A'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.text + '80' }]}>Start Date</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.text + '80' }]}>Progress</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${project.progress || 0}%`, backgroundColor: 'rgba(103, 197, 231, 0.9)'/*theme.tint /*'black' */}]} />
                <Text style={[styles.progressText, { color: theme.text, }]}>{project.progress || 0}%</Text>
              </View>
            </View>
          </View>

          {/* Technologies */}
          {project.language && project.language.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Technologies</Text>
              <View style={styles.languageContainer}>
                {project.language.map((lang, index) => (
                  <View key={index} style={[styles.languageBadge, { backgroundColor: theme.tint + '20' }]}>
                    <Text style={[styles.languageText, { color: theme.tint }]}>{lang.language_name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Investment Info */}
          <View style={[styles.investmentCard, { backgroundColor: theme.tint + '10' }]}>
            <Text style={[styles.investmentAmount, { color: theme.tint }]}>
              ${project.price?.toFixed(2)}
            </Text>
            <Text style={[styles.investmentLabel, { color: theme.text }]}>Minimum Investment</Text>
            
            <TouchableOpacity 
              style={[styles.investButton, { backgroundColor: 'rgba(103, 197, 231, 0.9)'/*theme.tint*/  }]}
              onPress={() => router.push(`/invest/${project.product_id}`)}
            >
              <Text style={styles.investButtonText}>Invest</Text>
            </TouchableOpacity>
          </View>
        </View>
      <Footer />
      </ScrollView>

    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: '#ef4444' },
  
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    padding: 8,
  },
  
  heroImage: {
    width: '100%',
    height: 300,
  },
  
  content: {
    padding: 20,
  },
  
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  title: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  category: {
    fontSize: 16,
    marginBottom: 16,
  },
  
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  
  statLabel: {
    fontSize: 12,
  },
  
  section: {
    marginBottom: 24,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  
  detailLabel: {
    fontSize: 14,
  },
  
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  progressContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  
  progressBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
  },
  
  progressText: {
    position: 'absolute',
    right: 8,
    top: 2,
    fontSize: 10,
    fontWeight: '600',
  },
  
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  languageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  
  languageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  investmentCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  
  investmentAmount: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  
  investmentLabel: {
    fontSize: 14,
    marginBottom: 16,
  },
  
  investButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  
  investButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProjectDetailScreen;