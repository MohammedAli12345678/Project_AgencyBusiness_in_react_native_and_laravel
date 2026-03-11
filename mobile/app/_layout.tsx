// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }

// app/layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MenuDrawer from './components/MenuDrawer';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(()=>
  {
    const checkLogin = async()=>
    {
      const token = await AsyncStorage.getItem('user_token');
      if(token)
      {
       router.replace('/');
      }
    }
    checkLogin();
  },[])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          drawerContent={(props) => <MenuDrawer {...props} />}
          screenOptions={{
            headerShown: false, // نخفي الهيدر الافتراضي
          }}
        >
          {/* التبويبات (Tabs) */}
          <Drawer.Screen 
            name="index" 
            options={{ 
              title: 'Home',
              drawerLabel: 'Home',
            }} 
          />
          
          {/* المودال */}
          <Drawer.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal', 
              title: 'Modal',
              drawerLabel: 'Modal' 
            }} 
          />
          
        </Drawer>
      </GestureHandlerRootView>
      
      {/* <Stack.Screen name="(Login)" options={{ headerShown: false }} /> */}
    </ThemeProvider>
  );
}
