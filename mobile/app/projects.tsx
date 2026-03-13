import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  useColorScheme,
  Modal,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Header from './components/header';
import Footer from './components/footer';
import { Colors } from '@/constants/theme';
import { useEffect } from 'react';
import { Search, Eye, TrendingUp, Clock, MessageSquare, Star, ChevronDown, Filter } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';  // أضف هذا مع الاستيرادات
import { API_BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');

//# شوف إذا Typesense شغال
//curl http://localhost:8108/health , http://localhost:8000/api/projects/search?q=*
// لتجربة typenesen http://localhost:8108/health
// http://localhost:8000/api/projects/search?q=c,http://10.0.6.106:8000/api/projects/search?q=c&sort_by=created_at:desc


// docker run -p 8108:8108 -v D:\typesense-data:/data typesense/typesense:0.25.2 --data-dir /data --api-key=xyz --enable-cors
/*
docker run -d -p 8108:8108 `
  --name typesense_server `
  --log-opt max-size=10m --log-opt max-file=3 `
  -v D:\typesense-data:/data `
  typesense/typesense:0.25.2 --data-dir /data --api-key=xyz --enable-cors

*/

const ProjectsScreen = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  // حالة الفلاتر الجديدة
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Price: Low to High');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  // const [languages, setLanguages] = useState([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const [selectedType, setSelectedType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // تأكد من إضافة <any[]> هنا أيضاً
  const [types, setTypes] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');        // النص اللي يكتبه المستخدم
  const [searchResults, setSearchResults] = useState([]);    // نتائج البحث
  const [isSearching, setIsSearching] = useState(false);     // حالة التحميل
  const [searchError, setSearchError] = useState(null);
  const [loading, setLoading] = useState(true);

  const styles = createStyles(theme, colorScheme);

  const [projects, setProjects] = useState([]);


const [quickViewVisible, setQuickViewVisible] = useState(false);
const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      const data = await response.json();
      setProjects(data);

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to fetch projects');
    }
  };


  const fetchFilters = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/filters`);
      const data = await response.json();

      console.log('📦 Filters received:', {
        languagesCount: data.languages?.length,
        typesCount: data.types?.length,
        statusesCount: data.statuses?.length
      });

      setLanguages(data.languages || []);
      setTypes(data.types || []);
      setStatuses(data.statuses || []);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to fetch filters');
    }
  };


  const searchProjects = async () => {


    console.log('🔍 Starting search with:', {
      searchQuery,
      selectedLanguage,
      selectedType,
      selectedStatus,
      selectedSort,
      minPrice,
      maxPrice
    });
    setIsSearching(true);

    // بناء URL مع كل الفلاتر
    let query = searchQuery.trim() ? searchQuery : '*';
    let url = `${API_BASE_URL}/api/projects/search?q=${encodeURIComponent(query)}`;

    // استخدم searchQuery مباشرة
    // if (!searchQuery.trim() && !selectedLanguage && !selectedType && !selectedStatus) {
    //   setSearchResults([]);
    //   return;
    // }



    if (selectedLanguage) {
      url += `&language=${encodeURIComponent(selectedLanguage)}`;
    }
    if (selectedType) {
      url += `&type=${encodeURIComponent(selectedType)}`;
    }
    if (selectedStatus) {
      url += `&status=${encodeURIComponent(selectedStatus)}`;
    }
      // 👇 Add price range filters
  if (minPrice) {
    url += `&min_price=${encodeURIComponent(minPrice)}`;
  }
  if (maxPrice) {
    url += `&max_price=${encodeURIComponent(maxPrice)}`;
  }
    const sortMap: Record<string, string> = {
      'Price: Low to High': 'price:asc',
      'Price: High to Low': 'price:desc',
      'Most Popular': 'rates_count:desc',
      'Newest First': 'created_at:desc',
      'Highest Rated': 'rates_avg_rate:desc'
    };

    if (sortMap[selectedSort]) {
      url += `&sort_by=${sortMap[selectedSort]}`;
    }
    console.log('📡 Final URL:', url);

    try {
      const response = await fetch(url);
      const result = await response.json();

      console.log('📦 Full response:', result);
      if (result.success) {
        setSearchResults(result.data);
        console.log('✅ Sort used:', result.sort_used);
      }
    } catch (error) {
      console.log('❌ Search error:', error);
    } finally {
      setIsSearching(false);
    }
    console.log('🔍 selectedSort:', selectedSort);
    console.log('🔍 sortMap[selectedSort]:', sortMap[selectedSort]);
  };
  // راقب كل التغييرات (النص والفلاتر)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchFilters();
        await fetchProjects();
      } catch (error) {
        console.log('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProjects();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedLanguage, selectedType, selectedStatus, minPrice, maxPrice,selectedSort]);






// استخدم searchResults إذا فيه نتائج، حتى لو كانت 0
const displayedProjects = searchResults.length > 0 ? searchResults : projects;
  const isEmpty = displayedProjects.length === 0 && !isSearching && !loading;


  // هذا المكون يمثل زر الفلتر مع المودال الخاص به
 
  // هذا المكون يمثل زر الفلتر مع المودال الخاص به
  const FilterDropdown = ({ label, data, selectedValue, onSelect, dataKey, labelKey }: any) => {
    const [visible, setVisible] = useState(false);

    return (
      <>
        <TouchableOpacity
          style={styles.filterDropdown}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.filterText}>
            {selectedValue ? selectedValue : `All ${label}s`}
          </Text>
          <ChevronDown size={16} color="#666" />
        </TouchableOpacity>

        <Modal visible={visible} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setVisible(false)}
            activeOpacity={1}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <ScrollView style={{ maxHeight: 300 }}>

                {/* 👈 خيار All */}
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    selectedValue === null && styles.sortOptionSelected
                  ]}
                  onPress={() => {
                    onSelect(null);
                    setVisible(false);
                  }}
                >
                  <Text style={[
                    styles.sortOptionText,
                    selectedValue === null && styles.sortOptionTextSelected
                  ]}>
                    All {label}s
                  </Text>
                </TouchableOpacity>

                {/* الفلاتر الأصلية */}
                {data.map((item: any, index: number) => {
                  const itemLabel = labelKey ? item[labelKey] : item;
                  const itemKey = dataKey ? item[dataKey] : index;

                  return (
                    <TouchableOpacity
                      key={itemKey}
                      style={[
                        styles.sortOption,
                        selectedValue === itemLabel && styles.sortOptionSelected
                      ]}
                      onPress={() => {
                        onSelect(itemLabel);
                        setVisible(false);
                      }}
                    >
                      <Text style={[
                        styles.sortOptionText,
                        selectedValue === itemLabel && styles.sortOptionTextSelected
                      ]}>
                        {itemLabel}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  };




  const sortOptions = [
    'Price: Low to High',
    'Price: High to Low',
    'Most Popular',
    'Newest First',
    'Highest Rated'
  ];


  const FilterSection = () => (
    <View style={styles.containerFilter}>
      <View style={styles.filterSearch}>
        <Search size={20} color={theme.icon} style={styles.iconSearch} />
        <TextInput
          style={styles.inputSearch}
          placeholder="Search in Projects"
          placeholderTextColor={theme.tabIconDefault}
          value={searchQuery}
          onChangeText={(text) => {

            setSearchQuery(text);
            
            // تحديث النص
          }}
          submitBehavior="submit"  // 👈 أضف هذا
          autoCorrect={false} 
        />
        {isSearching && (
          <ActivityIndicator size="small" color={theme.tint} style={{ marginLeft: 8 }} />
        )}
      </View>

      <View style={styles.filterControls}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* فلتر اللغة */}
          <FilterDropdown
            label="Language"
            data={languages}
            selectedValue={selectedLanguage}
            onSelect={(value: any) => { setSelectedLanguage(value) }}
            labelKey="language_name" // الاسم الموجود في الـ API الخاص بك
            dataKey="language_id"
          />

          {/* فلتر النوع */}
          <FilterDropdown
            label="Type"
            data={types}
            selectedValue={selectedType}
            onSelect={(value: any) => { setSelectedType(value) }}
            labelKey="category_name" // الاسم الموجود في الـ API الخاص بك
            dataKey="category_id"
          />

          {/* فلتر الحالة */}
          <FilterDropdown
            label="Status"
            data={statuses}
            selectedValue={selectedStatus}
            onSelect={(value: any) => { setSelectedStatus(value) }}
          // لا نحتاج labelKey هنا لأن الـ Status نصوص مباشرة
          />
        </ScrollView>
      </View>

      {/* فلتر السعر الجديد */}
      <View style={styles.priceFilterContainer}>
        <Text style={styles.priceFilterLabel}>Price Range:</Text>
        <View style={styles.priceInputs}>
          <TextInput
            style={styles.priceInput}
            placeholder="Min"
            placeholderTextColor={theme.tabIconDefault}
            value={minPrice}
            onChangeText={setMinPrice}
            keyboardType="numeric"
          />
          <Text style={styles.priceSeparator}>to</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Max"
            placeholderTextColor={theme.tabIconDefault}
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity
           style={styles.priceApplyButton}
           onPress={()=>{
            console.log('price filter applied',{minPrice,maxPrice});
           }}
           >
            <Text style={styles.priceApplyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* فلتر Sort الجديد */}
      <View style={styles.sortFilterContainer}>
        <Text style={styles.sortFilterLabel}>Sort By</Text>
        <TouchableOpacity
          style={styles.sortSelector}
          onPress={() => setSortModalVisible(true)}
        >
          <Text style={styles.sortSelectorText}>{selectedSort}</Text>
          <ChevronDown size={16} color={theme.icon} />
        </TouchableOpacity>
      </View>

      {/* مودال اختيار الترتيب */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sortOption,
                  selectedSort === option && styles.sortOptionSelected
                ]}
                onPress={() => {
                  setSelectedSort(option);
                  setSortModalVisible(false);
                }}
              >
                <Text style={[
                  styles.sortOptionText,
                  selectedSort === option && styles.sortOptionTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  const renderProjectCard = ({ item }) => (
    <TouchableOpacity 
    onPress={() => {
      console.log('📱 Navigating to project:', item.product_id);
      // router.push(`/project/${item.product_id}`);
      router.push(`/project/${item.product_id}`);
    }}
    activeOpacity={0.7}
    style={styles.projectCard}
  >
    
    {/* <View style={styles.projectCard}> */}
      
      <Image source={{ uri: item.full_image_path }} style={styles.projectImage} />

      <View style={styles.projectContent}>
        <View style={styles.tags}>
          <Text style={[styles.tag, styles.tagBlue]}>Development</Text>
          <Text style={[styles.tag, styles.tagRed]}>{item.category?.category_name ? item.category?.category_name : "not found"}</Text>
          <Text style={[styles.tag, styles.tagGreen]}>Project</Text>
        </View>

        <Text style={styles.projectTitle} numberOfLines={2}>{item.product_name}</Text>
        <Text style={styles.projectDesc} numberOfLines={3}>{item.short_description}</Text>

        <View style={styles.projectStats}>
          <View style={styles.statItem}>
            <MessageSquare size={14} color={theme.tabIconDefault} />
            <Text style={styles.statText}>{item.comments_count} Comments</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={14} color="#eab308" />
            <Text style={styles.statText}>{item.rates_count} Rate</Text>
          </View>
          <View style={styles.statItem}>
            <TrendingUp size={14} color="#10b981" />
            <Text style={styles.statText}>{item.rates_avg_rate}</Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={14} color={theme.tint} />
            <Text style={styles.statText}>{item.duration} Months</Text>
          </View>
        </View>

        <View style={styles.projectFooter}>
          <View style={styles.investmentInfo}>
            <Text style={styles.investmentAmount}>${item.price.toFixed(2)}</Text>
            <Text style={styles.investmentLabel}>Minimum Investment</Text>
          </View>

          <View style={styles.footerDivider} />

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.btnQuickView} 
              onPress={() => {
                setSelectedProject(item);
                setQuickViewVisible(true);
              }}>
              <Eye size={16} color={theme.tabIconDefault} />
              <Text style={styles.btnQuickViewText}>Quick View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnInvest}
                   onPress={() => {
                    console.log('📱 Navigating to project:', item.product_id);
                    // router.push(`/project/${item.product_id}`);
                    router.push(`/invest/${item.product_id}`);
                  }}>
              <Text style={styles.btnInvestText}>View Investment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
     
    {/* </View> */}
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <Header />
      <View style={styles.projectsHeader}>
        <Text style={styles.headerH1}>Our Projects</Text>
        <Text style={styles.headerP}>Browse our latest and greatest work. Use the filters to find what interests you!</Text>
      </View>

      {/* <FilterSection/> */}

      <FlatList
        ListHeaderComponent={FilterSection}
        // data={projects}
        data={displayedProjects}
        renderItem={renderProjectCard}
        keyExtractor={item => item.product_id.toString()}
        contentContainerStyle={styles.projectsGrid}
        ListFooterComponent={<Footer />}
      />
            {/* Quick View Modal */}
            <Modal
        visible={quickViewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setQuickViewVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.quickViewContent}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setQuickViewVisible(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            {selectedProject && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Project Image */}
                <Image 
                  source={{ uri: selectedProject.full_image_path }} 
                  style={styles.quickViewImage} 
                />

                {/* Project Details */}
                <View style={styles.quickViewDetails}>
                  <Text style={[styles.quickViewTitle, { color: theme.text }]}>
                    {selectedProject.product_name}
                  </Text>

                  <Text style={[styles.quickViewCategory, { color: theme.tint }]}>
                    {selectedProject.category?.category_name || 'Uncategorized'}
                  </Text>

                  <Text style={[styles.quickViewDescription, { color: theme.text }]}>
                    {selectedProject.short_description}
                  </Text>

                  {/* Stats */}
                  <View style={styles.quickViewStats}>
                    <View style={styles.statItem}>
                      <MessageSquare size={16} color={theme.tint} />
                      <Text style={styles.statText}>{selectedProject.comments_count || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Star size={16} color="#eab308" />
                      <Text style={styles.statText}>{selectedProject.rates_count || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <TrendingUp size={16} color="#10b981" />
                      <Text style={styles.statText}>{selectedProject.rates_avg_rate || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Clock size={16} color={theme.tint} />
                      <Text style={styles.statText}>{selectedProject.duration || 0}m</Text>
                    </View>
                  </View>

                  {/* Investment Details */}
                  <View style={styles.investmentDetails}>
                    <Text style={[styles.investmentTitle, { color: theme.text }]}>
                      Investment Details
                    </Text>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Minimum Investment:</Text>
                      <Text style={styles.detailValue}>${selectedProject.price?.toFixed(2)}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Expected ROI:</Text>
                      <Text style={styles.detailValue}>345</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Investment Period:</Text>
                      <Text style={styles.detailValue}>{selectedProject.duration || 12} months</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Risk Level:</Text>
                      <Text style={styles.detailValue}>Moderate</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Market Potential:</Text>
                      <Text style={styles.detailValue}>High</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.quickViewActions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.investButton]}
                      onPress={() => {
                        setQuickViewVisible(false);
                        Alert.alert('Invest', 'Investment feature coming soon');
                      }}
                    >
                      <Text style={styles.actionButtonText}>Invest Now</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.detailsButton]}
                      onPress={() => {
                        setQuickViewVisible(false);
                        router.push(`/project/${selectedProject.product_id}`);
                      }}
                    >
                      <Text style={styles.detailsButtonText}>View Full Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaProvider>
    
  );
};

function createStyles(theme: any, colorScheme: any) {
  const isDark = colorScheme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    projectsHeader: {
      backgroundColor: '#111827',
      padding: 30,
      paddingTop: 50,
      alignItems: 'center',
    },
    headerH1: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 10 },
    headerP: { fontSize: 14, color: '#fff', opacity: 0.9, textAlign: 'center', maxWidth: 300 },

    containerFilter: {
      padding: 20,
      backgroundColor: colorScheme === 'dark' ? theme.background : '#f8f9fa'
    },
    filterSearch: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#333' : '#e2e8f0',
      paddingHorizontal: 15,
      marginBottom: 15
    },
    iconSearch: { marginRight: 10 },
    inputSearch: { flex: 1, height: 45, fontSize: 16, color: theme.text },

    filterControls: { marginBottom: 15 },
    filterDropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#fff',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#333' : '#e2e8f0',
      marginRight: 10,
      minWidth: 100,
      justifyContent: 'space-between'
    },
    filterText: { fontSize: 13, color: theme.text },

    // أنماط جديدة للـ Price Range
    priceFilterContainer: {
      marginBottom: 15,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colorScheme === 'dark' ? '#333' : '#e2e8f0',
    },
    priceFilterLabel: {
      fontSize: 13,
      color: theme.text,
      marginBottom: 8,
      fontWeight: '500',
    },
    priceInputs: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    priceInput: {
      flex: 1,
      height: 40,
      backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#fff',
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#333' : '#e2e8f0',
      borderRadius: 6,
      paddingHorizontal: 10,
      color: theme.text,
    },
    priceSeparator: {
      color: theme.tabIconDefault,
      fontSize: 14,
    },
    priceApplyButton: {
      backgroundColor: isDark ? '#333' : theme.tint,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 6,
    },
    priceApplyText: {
      color: '#fff',
      fontWeight: '500',
      fontSize: 13,
    },

    // أنماط جديدة للـ Sort By
    sortFilterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colorScheme === 'dark' ? '#333' : '#e2e8f0',
    },
    sortFilterLabel: {
      fontSize: 13,
      color: theme.text,
      fontWeight: '500',
    },
    sortSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#fff',
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#333' : '#e2e8f0',
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 8,
      minWidth: 160,
      justifyContent: 'space-between',
    },
    sortSelectorText: {
      color: theme.text,
      fontSize: 13,
    },

    // أنماط المودال
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#fff',
      borderRadius: 12,
      padding: 20,
      width: '80%',
      maxWidth: 300,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 15,
      textAlign: 'center',
    },
    sortOption: {
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginBottom: 5,
    },
    sortOptionSelected: {
      backgroundColor: theme.tint + '20', // 20 = opacity 20%
    },
    sortOptionText: {
      fontSize: 15,
      color: theme.text,
    },
    sortOptionTextSelected: {
      color: theme.tint,
      fontWeight: '500',
    },

    projectsGrid: { paddingBottom: 20 },
    projectCard: {
      backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#fff',
      margin: 15,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#333' : '#e2e8f0',
      overflow: 'hidden',
      elevation: 3,
    },
    projectImage: { width: '100%', height: 180 },
    projectContent: { padding: 15 },

    tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, fontSize: 11, fontWeight: '600' },
    tagBlue: { backgroundColor: '#e0f2fe', color: '#0369a1' },
    tagRed: { backgroundColor: '#fee2e2', color: '#b91c1c' },
    tagGreen: { backgroundColor: '#dcfce7', color: '#15803d' },

    projectTitle: { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 8 },
    projectDesc: { fontSize: 14, color: theme.tabIconDefault, lineHeight: 20, marginBottom: 15 },

    projectStats: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colorScheme === 'dark' ? '#333' : '#e2e8f0',
      paddingVertical: 12,
      gap: 15
    },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    statText: { fontSize: 12, color: theme.tabIconDefault },

    projectFooter: { marginTop: 15 },
    investmentAmount: { fontSize: 22, fontWeight: '700', color: theme.tint },
    investmentLabel: { fontSize: 11, color: theme.tabIconDefault },
    footerDivider: { height: 1, backgroundColor: colorScheme === 'dark' ? '#333' : '#e2e8f0', marginVertical: 10 },

    buttonGroup: { flexDirection: 'row', gap: 10 },
    btnQuickView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#333' : '#f1f5f9',
      padding: 10,
      borderRadius: 8
    },
    btnQuickViewText: { color: theme.text, fontWeight: '500', fontSize: 14 },
    btnInvest: {
      flex: 2,
      backgroundColor: isDark ? '#333' : theme.tint,
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center'
    },
    btnInvestText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    // Quick View Modal
quickViewContent: {
  backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#fff',
  borderRadius: 12,
  width: '90%',
  maxHeight: '80%',
  overflow: 'hidden',
  position: 'relative',
},
closeButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 10,
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
closeButtonText: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
},
quickViewImage: {
  width: '100%',
  height: 200,
},
quickViewDetails: {
  padding: 20,
},
quickViewTitle: {
  fontSize: 22,
  fontWeight: '700',
  marginBottom: 5,
},
quickViewCategory: {
  fontSize: 14,
  marginBottom: 10,
},
quickViewDescription: {
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 15,
},
quickViewStats: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingVertical: 15,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: '#e2e8f0',
  marginBottom: 15,
},
investmentDetails: {
  marginBottom: 20,
},
investmentTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 10,
},
detailRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#e2e8f0',
},
detailLabel: {
  fontSize: 14,
  color: '#64748b',
},
detailValue: {
  fontSize: 14,
  fontWeight: '500',
  color: '#1e293b',
},
quickViewActions: {
  flexDirection: 'row',
  gap: 10,
  marginTop: 10,
},
actionButton: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
},
investButton: {
  backgroundColor: theme.tint,
},
actionButtonText: {
  color: '#fff',
  fontWeight: '600',
},
detailsButton: {
  backgroundColor: '#f1f5f9',
},
detailsButtonText: {
  color: '#64748b',
  fontWeight: '600',
},

  });
}

export default ProjectsScreen;
