

// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";

// export default function Header() {
//   const router = useRouter();

//   const user = null; // replace with auth later

//   return (
//     <View style={styles.container}>
//       <Text style={styles.logo}>Zetrix</Text>

//       {user ? (
//         <TouchableOpacity>
//           <Text style={styles.profile}>{/*user.name*/}</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity onPress={() => router.push("/"/*"/login"*/)}>
//           <Text style={styles.button}>Get Started</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     height: 70,
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#ffffff",
//     elevation: 4,
//   },
//   logo: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#ef4444",
//   },
//   button: {
//     backgroundColor: "#ef4444",
//     color: "#fff",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//   },
//   profile: {
//     fontWeight: "600",
//   },
// });

// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from '@expo/vector-icons'; // Import icons for the hamburger menu

// export default function Header() {
//   const router = useRouter();
//   const user = null; // replace with auth later

//   return (
//     <View style={styles.container}>
//       {/* 1. Left Side: Hamburger Menu (matching your image) */}
//       <TouchableOpacity onPress={() => console.log("Open Menu")}>
//         <Ionicons name="menu-outline" size={30} color="#2B2D42" />
//       </TouchableOpacity>

//       {/* 2. Middle: Logo */}
//       <Text style={styles.logo}>Zetrix</Text>

//       {/* 3. Right Side: Profile/Action Button */}
//       <View style={styles.rightContainer}>
//         {user ? (
//           <TouchableOpacity onPress={() => router.push("/profile")}>
//              <Ionicons name="person-circle-outline" size={28} color="#2B2D42" />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity 
//             style={styles.actionButton} 
//             onPress={() => router.push("/")}
//           >
//             <Text style={styles.buttonText}>Start</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     height: Platform.OS === 'ios' ? 100 : 70, // Extra height for iOS status bar
//     paddingTop: Platform.OS === 'ios' ? 40 : 0,
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#ffffff",
//     // Adding a cleaner shadow
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.05)',
//     elevation: 2,
//   },
//   logo: {
//     fontSize: 22,
//     fontWeight: "900", // Extra bold for brand identity
//     color: "#EF233C", // Matching your red theme
//     letterSpacing: 1,
//   },
//   rightContainer: {
//     minWidth: 40,
//     alignItems: 'flex-end',
//   },
//   actionButton: {
//     backgroundColor: "#EF233C",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20, // Rounded pill shape
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 14,
//   },
// });


// components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform,Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import  { useState,useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage"; // أضف useState هنا


export default function Header() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
/*
  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        console.log('🔑 Header Token:', token);
        
        if (token) {
          // مؤقتاً: خلي اسم المستخدم ثابت
          setUser({ name: "Mohammed" });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Error getting user:', error);
      }
    };
    
    getUserFromToken();
  }, []);

*/
useEffect(() => {
  const getUserFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      console.log('🔑 Header Token:', token);
      
      if (token) {
        // 👇 جيب بيانات المستخدم من التخزين
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // لو مفيش بيانات، استخدم الاسم الافتراضي
          setUser({ name: "User" });
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('Error getting user:', error);
    }
  };
  
  getUserFromToken();
}, []);

  const openDrawer = () => {
    navigation.openDrawer(); // فتح القائمة الجانبية
  };

  const handleLogout = async()=>
  {
    await AsyncStorage.removeItem('user_token');  // 1. مسح التوكن
    await AsyncStorage.removeItem('user');        // 2. مسح بيانات المستخدم
    setUser(null);                                 // 3. تحديث حالة المستخدم
    setMenuVisible(false);                         // 4. إغلاق القائمة
    router.push('/');

  }

  return (
    
    <View style={styles.container}>
      {/* زر القائمة - يفتح القائمة الجانبية */}
      <TouchableOpacity onPress={openDrawer}>
        <Ionicons name="menu-outline" size={30} color="#2B2D42" />
      </TouchableOpacity>

      {/* اللوجو */}
      <TouchableOpacity onPress={() => router.push('/')}>
        <Text style={styles.logo}>Zetrix</Text>
      </TouchableOpacity>

      {/* زر Get Started */}
      <View style={styles.rightContainer}>
        {user ? (
          // <TouchableOpacity onPress={() => router.push('/')}>
          //   <Ionicons name="person-circle-outline" size={28} color="#2B2D42" />
          // </TouchableOpacity>

          <View style={{ zIndex: 5000 }}>
    <TouchableOpacity 
      style={styles.profileWrapper} 
      onPress={() => setMenuVisible(!menuVisible)} // فتح/إغلاق القائمة
    >
      <Text style={styles.userName}>{user.name}</Text>
      <Ionicons name="chevron-down" size={14} color="#2B2D42" />
      <Image source={{ uri: 'https://via.placeholder.com/35' }} style={styles.avatar} />
    </TouchableOpacity>

    {/* القائمة المنسدلة */}
    {menuVisible && (
      <View style={styles.dropdown}>
        <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/profile'); }}>
          <Ionicons name="person-outline" size={18} />
          <Text>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/usermanage'); }}>
          <Ionicons name="settings-outline" size={18} />
          <Text>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/manager/dashboard'); }}>
          <Ionicons name="person-outline" size={18} />
          <Text>Dashborad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleLogout() /*setMenuVisible(false)*/}>
          <Ionicons name="log-out-outline" size={18} color="red" />
          <Text style={{color: 'red'}}>Logout</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
        ) : (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => { router.push('/Login')/* Navigate to Login */}}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#EF233C",
  },
  rightContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  actionButton: {
    backgroundColor: "#EF233C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#eee',
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    // position: Platform.OS === 'web' ? 'fixed' : 'absolute', // 👈 غيرها
    // top: Platform.OS === 'web' ? 70 : 45, // 👈 للويب يكون تحت الهيدر مباشرة
    // right: 20,
    backgroundColor: '#fff',
    width: 140,
    borderRadius: 10,
    padding: 5,
    elevation: 5, // للاندرويد
    shadowColor: '#000', // للايفون
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    // zIndex: 2000,
    zIndex: 9999,
    ...(Platform.OS === 'web' && {
      top: 70,
      right: 20,
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
});