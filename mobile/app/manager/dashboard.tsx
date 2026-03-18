// app/dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  useColorScheme,
  ActivityIndicator,
  Alert
} from "react-native";
import Header from "../components/header";
import Footer from "../components/footer";
import { LineChart } from "react-native-chart-kit";
import { apiFetch } from "../../services/api";
import { API_BASE_URL } from '@/config/api';

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors = {
    background: isDark ? "#0f172a" : "#f8fafc",
    card: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f1f5f9" : "#1e293b",
    subText: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#334155" : "#e2e8f0",
    input: isDark ? "#334155" : "#f1f5f9"
  };

  // ============ STATE ============
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }]
  });
  const [statusDistribution, setStatusDistribution] = useState([]);

  // ============ FETCH DATA ============
  const fetchDashboardData = async (searchQuery = "") => {
    setLoading(true);
    try {
      const url = searchQuery 
        ? `${API_BASE_URL}/api/dashboard?search=${encodeURIComponent(searchQuery)}`
        : `${API_BASE_URL}/api/dashboard`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        // تحديث الإحصائيات
        setStats(result.stats || []);
        
        // تحديث المشاريع
        setProjects(result.recent_projects || []);
        
        // تحديث الرسم البياني
        if (result.chart) {
          setChartData({
            labels: result.chart.labels || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: result.chart.datasets || [{ data: [] }]
          });
        }
        console.log(result.chart.datasets);
        
        // تحديث توزيع الحالات
        setStatusDistribution(result.status_distribution || []);
      } else {
        Alert.alert("Error", result.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // البحث مع debounce (يبحث بعد 500ms من توقف الكتابة)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        fetchDashboardData(search);
      } else {
        fetchDashboardData(); // جلب كل البيانات لو البحث فاضي
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // فلترة المشاريع محلياً (اختياري)
  const filteredProjects = projects.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  // عرض التحميل
  if (loading && !stats.length) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ color: colors.text, marginTop: 10 }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <Header />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Project Dashboard
        </Text>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          {stats.map((item, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statTitle, { color: colors.subText }]}>
                {item.title}
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {item.value}
              </Text>
              <Text style={styles.statChange}>
                {item.change} from last month
              </Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Investment Analytics
          </Text>
          {chartData.datasets[0].data.some( value =>value > 0) ? (
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              bezier
              chartConfig={{
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                labelColor: () => colors.subText,
                propsForDots: {
                  r: "5",
                  strokeWidth: "2",
                  stroke: "#4f46e5"
                }
              }}
              style={{ borderRadius: 16 }}
            />
          ) : (
            <Text style={{ color: colors.subText, textAlign: 'center', padding: 20 }}>
              No chart data available
            </Text>
          )}
        </View>

        {/* Recent Projects Table */}
        <View style={[styles.tableCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Projects
          </Text>

          <TextInput
            placeholder="Search projects..."
            placeholderTextColor={colors.subText}
            style={[styles.search, { backgroundColor: colors.input, color: colors.text }]}
            value={search}
            onChangeText={setSearch}
          />

          <View style={[styles.tableHeader, { borderColor: colors.border }]}>
            <Text style={[styles.headerCell, { color: colors.subText }]}>Project</Text>
            <Text style={[styles.headerCell, { color: colors.subText }]}>Status</Text>
            <Text style={[styles.headerCell, { color: colors.subText }]}>Investment</Text>
            <Text style={[styles.headerCell, { color: colors.subText }]}>ROI</Text>
          </View>

            
          {filteredProjects.length > 0 ? (
  filteredProjects.map((project, index) => (
    <View key={index} style={[styles.row, { borderColor: colors.border }]}>
      <View style={{ flex: 2 }}>
        <Text style={[styles.projectName, { color: colors.text }]}>
          {project.name}
        </Text>
        <Text style={[styles.projectDate, { color: colors.subText }]}>
          {project.start_date}
        </Text>
      </View>
      <Text style={[styles.status, 
        project.status === 'Active' ? { color: '#059669' } : 
        project.status === 'Beta' ? { color: '#d97706' } : 
        { color: '#64748b' }
      ]}>
        {project.status}
      </Text>
      <Text style={[styles.cell, { color: colors.text }]}>
      {project.investment_display}
      </Text>
      <Text style={[styles.cell, { color: colors.text }]}>
      {project.roi_display ? project.roi_display  : '0%'}
      </Text>
    </View>
  ))
) : (
  <Text style={{ color: colors.subText, textAlign: 'center', padding: 20 }}>
    No projects found
  </Text>
)}


                </View>

        {/* Status Distribution */}
        <View style={[styles.analyticsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Project Status
          </Text>
          <View style={styles.statusRow}>
            {statusDistribution.length > 0 ? (
              statusDistribution.map((item, index) => (
                <View key={index} style={[styles.statusItem, { backgroundColor: colors.input }]}>
                  <Text style={[styles.statusValue, { color: colors.text }]}>{item.count}</Text>
                  <Text style={[styles.statusLabel, { color: colors.subText }]}>{item.status}</Text>
                </View>
              ))
            ) : (
              <>
                <View style={[styles.statusItem, { backgroundColor: colors.input }]}>
                  <Text style={[styles.statusValue, { color: colors.text }]}>0</Text>
                  <Text style={[styles.statusLabel, { color: colors.subText }]}>Active</Text>
                </View>
                <View style={[styles.statusItem, { backgroundColor: colors.input }]}>
                  <Text style={[styles.statusValue, { color: colors.text }]}>0</Text>
                  <Text style={[styles.statusLabel, { color: colors.subText }]}>Completed</Text>
                </View>
                <View style={[styles.statusItem, { backgroundColor: colors.input }]}>
                  <Text style={[styles.statusValue, { color: colors.text }]}>0</Text>
                  <Text style={[styles.statusLabel, { color: colors.subText }]}>Beta</Text>
                </View>
              </>
            )}
          </View>
        </View>

        <Footer />
      </ScrollView>
    </>
  );
}

// دالة مساعدة لتحديد لون الحالة
const statusColor = (status) => {
  switch (status) {
    case "Active":
      return { color: "#059669" };
    case "Completed":
      return { color: "#2563eb" };
    case "Upcoming":
      return { color: "#d97706" };
    default:
      return { color: "#64748b" };
  }
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  title: { 
    fontSize: 26, 
    fontWeight: "800", 
    marginBottom: 20 
  },
  statsGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between" 
  },
  statCard: { 
    width: "48%", 
    padding: 16, 
    borderRadius: 14, 
    marginBottom: 15, 
    elevation: 3 
  },
  statTitle: { 
    fontSize: 13 
  },
  statValue: { 
    fontSize: 22, 
    fontWeight: "700", 
    marginVertical: 5 
  },
  statChange: { 
    fontSize: 12, 
    color: "#059669" 
  },
  chartCard: { 
    padding: 16, 
    borderRadius: 14, 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 10 
  },
  tableCard: { 
    padding: 16, 
    borderRadius: 14, 
    marginBottom: 20 
  },
  search: { 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 10 
  },
  tableHeader: { 
    flexDirection: "row", 
    borderBottomWidth: 1, 
    paddingBottom: 6 
  },
  headerCell: { 
    flex: 1, 
    fontWeight: "600", 
    fontSize: 12 
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 12, 
    borderBottomWidth: 1 
  },
  projectName: { 
    fontWeight: "600" 
  },
  projectDate: { 
    fontSize: 11 
  },
  status: { 
    flex: 1, 
    fontWeight: "600" 
  },
  cell: { 
    flex: 1 
  },
  analyticsCard: { 
    padding: 16, 
    borderRadius: 14 
  },
  statusRow: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  statusItem: { 
    alignItems: "center", 
    padding: 14, 
    borderRadius: 10, 
    width: "30%" 
  },
  statusValue: { 
    fontSize: 20, 
    fontWeight: "700" 
  },
  statusLabel: { 
    fontSize: 12 
  }
});