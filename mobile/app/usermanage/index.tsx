import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
    useColorScheme,

} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/header';
import Footer from '../components/footer';

const { width } = Dimensions.get('window');

export default function InvestDashboard() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [activeTab, setActiveTab] = useState('Overview');

    // بيانات تجريبية (Replace with API data)
    const user = {
        name: "Mohammed",
        email: "moha772876@gmail.com",
        role: "Premium Investor",
        photo: 'https://via.placeholder.com/100'
    };

    const stats = [
        { label: 'Total Invested', value: '$12,500', icon: 'coins', color: '#3b82f6' },
        { label: 'Total Returns', value: '$2,100', icon: 'chart-line', color: '#10b981' },
        { label: 'Active Projects', value: '3', icon: 'rocket-launch', color: '#f59e42' },
        { label: 'Success Rate', value: '94%', icon: 'trophy', color: '#4361ee' },
    ];

    // الألوان بناءً على الوضع (Dark/Light)
    const theme = {
        bg: isDark ? '#0f172a' : '#f8f9fa',
        card: isDark ? '#1e293b' : '#ffffff',
        text: isDark ? '#f8fafc' : '#2b2d42',
        muted: isDark ? '#94a3b8' : '#8d99ae',
        border: isDark ? '#334155' : '#e9ecef',
        primary: '#4361ee'
    };

    return (
        <>
            <Header />
            <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
                {/* <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} /> */}
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* --- 1. User Profile Header (دمج الـ Sidebar) --- */}
                    <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Image source={{ uri: user.photo }} style={styles.avatar} />
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
                            <Text style={[styles.userEmail, { color: theme.muted }]}>{user.email}</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{user.role}</Text>
                            </View>
                        </View>
                    </View>

                    {/* --- 2. Portfolio Overview (Stats Grid) --- */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Portfolio Overview</Text>
                        <TouchableOpacity style={styles.investBtn}>
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.investBtnText}>New Investment</Text>
                        </TouchableOpacity>
                    </View>

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

                    {/* --- 3. Active Investments List --- */}
                    <View style={[styles.listContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.listTitle, { color: theme.text }]}>Your Investments</Text>

                        {/* محاكاة الجدول (Rows) */}
                        <InvestmentItem
                            name="CodeMaster IDE"
                            amount="$5,000"
                            status="Active"
                            statusColor="#10b981"
                            theme={theme}
                        />
                        <InvestmentItem
                            name="DataAnalyzer Pro"
                            amount="$2,500"
                            status="Completed"
                            statusColor="#64748b"
                            theme={theme}
                        />
                        <InvestmentItem
                            name="SecureVault"
                            amount="$5,000"
                            status="Pending"
                            statusColor="#f59e42"
                            theme={theme}
                        />
                    </View>
                    <Footer />

                </ScrollView>
            </SafeAreaView>
        </>
    );
}

// مكوّن فرعي لكل صف في الجدول لضمان نظافة الكود
const InvestmentItem = ({ name, amount, status, statusColor, theme }) => (
    <View style={[styles.itemRow, { borderBottomColor: theme.border }]}>
        <View style={{ flex: 2 }}>
            <Text style={[styles.itemName, { color: theme.text }]}>{name}</Text>
            <Text style={[styles.itemSub, { color: theme.muted }]}>{amount}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
        <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
    </View>
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
    }});