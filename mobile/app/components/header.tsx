

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
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Header() {
  const navigation = useNavigation();
  const user = null;
  const router = useRouter();

  const openDrawer = () => {
    navigation.openDrawer(); // فتح القائمة الجانبية
  };

  return (
    <View style={styles.container}>
      {/* زر القائمة - يفتح القائمة الجانبية */}
      <TouchableOpacity onPress={openDrawer}>
        <Ionicons name="menu-outline" size={30} color="#2B2D42" />
      </TouchableOpacity>

      {/* اللوجو */}
      <TouchableOpacity onPress={() => router.push('/Home')}>
        <Text style={styles.logo}>Zetrix</Text>
      </TouchableOpacity>

      {/* زر Get Started */}
      <View style={styles.rightContainer}>
        {user ? (
          <TouchableOpacity onPress={() => router.push('/')}>
            <Ionicons name="person-circle-outline" size={28} color="#2B2D42" />
          </TouchableOpacity>
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
});