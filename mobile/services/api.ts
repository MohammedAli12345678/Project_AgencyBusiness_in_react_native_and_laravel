// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config/api';

export const apiFetch = async (endpoint: string, options: any = {}) => {
  try {
    // 1. نجيب التوكن من التخزين
    const token = await AsyncStorage.getItem('user_token');
    
    // 2. نجهز الهيدرز
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // 3. نضيف التوكن إذا موجود
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 4. ندمج مع الهيدرز اللي جايه من options (إذا موجودة)
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    // 5. ننفذ الطلب
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return response;
    
  } catch (error) {
    console.log('❌ API Fetch Error:', error);
    throw error;
  }
};