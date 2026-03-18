// app/invest-dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    useColorScheme,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/header';
import Footer from '../components/footer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from '@/config/api';

const { width } = Dimensions.get('window');

export default function InvestDashboard() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const router = useRouter();
    
    // States
    const [user, setUser] = useState(null);
    const [investments, setInvestments] = useState([]);
    const [stats, setStats] = useState<any[]>([])
    const [loading, setLoading] = useState(true);

    const theme = {
        bg: isDark ? '#0f172a' : '#f8f9fa',
        card: isDark ? '#1e293b' : '#ffffff',
        text: isDark ? '#f8fafc' : '#2b2d42',
        muted: isDark ? '#94a3b8' : '#8d99ae',
        border: isDark ? '#334155' : '#e9ecef',
        primary: '#4361ee'
    };

    // جلب كل البيانات مرة واحدة
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('user_token');
                if (!token) {
                    router.push('/Login');
                    return;
                }

                // 1. جلب بيانات المستخدم من AsyncStorage
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser({
                        name: parsedUser.name || parsedUser.user_name || 'User',
                        role: parsedUser.role || parsedUser.user_type || 'Investor',
                        email: parsedUser.email || '',
                        photo: parsedUser.photo || 'https://via.placeholder.com/70'
                    });
                }

                // 2. جلب استثمارات المستخدم من API
                const investmentsResponse = await fetch(`${API_BASE_URL}/api/user/investments`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                const investmentsResult = await investmentsResponse.json();
                
                if (investmentsResult.success) {
                    setInvestments(investmentsResult.data || []);
                    
                    // حساب الإحصائيات من البيانات
                    const investmentsData = investmentsResult.data || [];
                    const totalInvested = investmentsData.reduce((sum:any, inv:any) => {
                        const amount = parseFloat(inv.amount.replace('$', '').replace(',', '')) || 0;
                        return sum + amount;
                    }, 0);

                    const activeProjects = investmentsData.filter(inv => 
                        inv.status === 'Active' || inv.status === 'Pending' 
                    ).length;

                    const completedProjects = investmentsData.filter(inv => inv.status === 'Completed').length;
                    const successRate = investmentsData.length > 0 
                        ? Math.round((completedProjects / investmentsData.length) * 100) 
                        : 0;

                    const totalReturns = Math.round(totalInvested * 0.15);

                    setStats([
                        { label: 'Total Invested', value: '$' + totalInvested.toLocaleString(), icon: 'currency-usd', color: '#3b82f6' },
                        { label: 'Total Returns', value: '$' + totalReturns.toLocaleString(), icon: 'chart-line', color: '#10b981' },
                        { label: 'Active Projects', value: activeProjects.toString(), icon: 'rocket-launch', color: '#f59e42' },
                        { label: 'Success Rate', value: successRate + '%', icon: 'trophy', color: '#4361ee' },
                    ]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.text, marginTop: 10 }}>Loading dashboard...</Text>
            </View>
        );
    }

    return (
        <>
            <Header />
            <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* User Profile */}
                    <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Image source={{ uri: user?.photo }} style={styles.avatar} />
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { color: theme.text }]}>{user?.name}</Text>
                            <Text style={[styles.userEmail, { color: theme.muted }]}>{user?.email}</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{user?.role}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Portfolio Overview */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Portfolio Overview</Text>
                        <TouchableOpacity style={styles.investBtn} onPress={() => router.push('/projects')}>
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.investBtnText}>New Investment</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stats Cards */}
                    <View style={styles.statsGrid}>
                        {stats.map((item, index) => (
                            <View key={index} style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                                    <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                                </View>
                                <View>
                                    <Text style={[styles.statValue, { color: theme.text }]}>{item.value}</Text>
                                    <Text style={[styles.statLabel, { color: theme.muted }]}>{item.label}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Investments List */}
                    <View style={[styles.listContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.listTitle, { color: theme.text }]}>Your Investments</Text>

                        {investments.length > 0 ? (
                            investments.map((item, index) => (
                                // const displayName = item.project_name || item.project?.name || item.name || "Zetrix Project";
                                <InvestmentItem
                                
                                    key={item.id || index}
                                    name={item.project_name || item.name}
                                    amount={item.amount}
                                    status={item.status}
                                    statusColor={item.status_color}
                                    theme={theme}
                                    onPress={() => router.push(`/invest/${item.id}`)}
                                />
                            ))
                        ) : (
                            <View style={{ padding: 30, alignItems: 'center' }}>
                                <MaterialCommunityIcons name="briefcase-off" size={50} color={theme.muted} />
                                <Text style={{ color: theme.muted, marginTop: 10, textAlign: 'center' }}>
                                    No investments yet.{'\n'}
                                    Start investing today!
                                </Text>
                            </View>
                        )}
                    </View>

                    <Footer />
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

// Investment Item Component
const InvestmentItem = ({ name, amount, status, statusColor, theme, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.itemRow, { borderBottomColor: theme.border }]}>
        <View style={{ flex: 2 }}>
            <Text style={[styles.itemName, { color: theme.text }]}>{name}</Text>
            <Text style={[styles.itemSub, { color: theme.muted }]}>{amount}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
        <View style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileCard: {
        margin: 16,
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#4361ee',
    },
    userInfo: {
        marginLeft: 16,
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
    },
    userEmail: {
        fontSize: 13,
        marginBottom: 8,
    },
    badge: {
        backgroundColor: '#4361ee',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    investBtn: {
        backgroundColor: '#4361ee',
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
    },
    investBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 8,
    },
    statCard: {
        width: (width / 2) - 24,
        margin: 8,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 11,
    },
    listContainer: {
        margin: 16,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 100,
    },
    listTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 20,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
    },
    itemSub: {
        fontSize: 12,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginBottom: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    viewBtn: {
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    viewBtnText: {
        color: '#4361ee',
        fontSize: 12,
        fontWeight: '600',
    }
});