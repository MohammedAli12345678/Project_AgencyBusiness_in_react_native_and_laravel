// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config/api';

export const apiFetch = async (endpoint: string, options: any = {}) => {
  try {
    // 1. نجيب التوكن من التخزين
    const token = await AsyncStorage.getItem('user_token');

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const finalUrl = `${API_BASE_URL}/${cleanEndpoint}`;
    
    // 2. نجهز الهيدرز
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    
    
    // 3. نضيف التوكن إذا موجود
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`;
    // }
    
    // // 4. ندمج مع الهيدرز اللي جايه من options (إذا موجودة)
    // if (options.headers) {
    //   Object.assign(headers, options.headers);
    // }

    // 5. ننفذ الطلب
    // const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    //   ...options,
    //   headers,
    // });
    // 💡 اطبع الرابط النهائي للتأكد منه في الـ Debugger
    console.log(`🌐 Requesting: [${options.method || 'GET'}] ${finalUrl}`);

    const response = await fetch(finalUrl, {
      ...options,
      headers,
    });

    return response;
    
  } catch (error) {
    console.log('❌ API Fetch Error:', error);
    throw error;
  }
};