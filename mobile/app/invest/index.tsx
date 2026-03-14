// app/invest/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp, Clock, DollarSign } from 'lucide-react-native';
import Header from '../components/header';
import Footer from '../components/footer';
import { Colors } from '@/constants/theme';
import { API_BASE_URL } from '@/config/api';

const InvestmentsListScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      // جلب استثمارات المستخدم (مؤقتاً userId = 1)
      const response = await fetch(`${API_BASE_URL}/api/users/1/investments`);
      const data = await response.json();
      setInvestments(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderInvestmentCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={() => router.push(`/invest/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.projectName, { color: theme.text }]}>{item.product?.product_name}</Text>
        <View style={[styles.statusBadge, { 
          backgroundColor: item.status === 'completed' ? '#10b981' : 
                          item.status === 'pending' ? '#f59e0b' : '#ef4444' 
        }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <DollarSign size={16} color={theme.tint} />
          <Text style={[styles.detailText, { color: theme.text }]}>${item.amount}</Text>
        </View>
        <View style={styles.detailItem}>
          <TrendingUp size={16} color="#10b981" />
          <Text style={[styles.detailText, { color: theme.text }]}>15% ROI</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color={theme.tint} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Investments</Text>
      </View>

      <FlatList
        data={investments}
        renderItem={renderInvestmentCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text + '80' }]}>
              No investments yet
            </Text>
            <Footer />
          </View>
        }
      />

  
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default InvestmentsListScreen;