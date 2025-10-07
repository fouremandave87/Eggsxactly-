2# Eggsxactly-
Track all the details of your flock or flocks
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function App() {
  const [tab, setTab] = useState("dashboard");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥚 Eggsxactly</Text>

      <View style={styles.tabBar}>
        {["dashboard", "birds", "tracker", "settings"].map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}>
            <Text style={[styles.tab, tab === t && styles.activeTab]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {tab === "dashboard" && <Dashboard />}
        {tab === "birds" && <BirdList />}
        {tab === "tracker" && <Tracker />}
        {tab === "settings" && <Settings />}
      </ScrollView>
    </View>
  );
}

function Dashboard() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Flock Overview</Text>
      <Text>You have 12 hens and 4 ducks. 10 are currently laying.</Text>
    </View>
  );
}

function BirdList() {
  return (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>Your Birds</Text>
        <TouchableOpacity style={styles.addButton}><Text style={{color: 'white'}}>+ Add</Text></TouchableOpacity>
      </View>
      <View style={styles.card}><Text>Henrietta — Rhode Island Red</Text></View>
      <View style={styles.card}><Text>Daisy — Pekin Duck</Text></View>
    </View>
  );
}

function Tracker() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Egg Tracker</Text>
      <Text>Today's eggs: 🐔 8 | 🦆 3</Text>
    </View>
  );
}

function Settings() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Settings</Text>
      <Text>Data backup: Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8E7", padding: 16, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", color: "#8B4513", marginBottom: 20 },
  tabBar: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  tab: { fontSize: 16, color: "#8B4513" },
  activeTab: { fontWeight: "bold", textDecorationLine: "underline" },
  card: { backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 3 },
  cardTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 6 },
  addButton: { backgroundColor: "#EAB308", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  content: { flex: 1 },
});
Eggsxactly/
│
├── App.js
├── app.json
├── package.json
├── assets/            ← icons, logos, splash images
└── src/
    ├── screens/
    │   ├── Dashboard.js
    │   ├── Birds.js
    │   ├── Tracker.js
    │   └── Settings.js
    ├── components/
    │   └── BirdCard.js
    ├── data/
    │   └── firebaseConfig.js
    └── navigation/
        └── BottomTabs.js
npm install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npm install firebase
expo install @react-native-async-storage/async-storage
git init
git branch -M main
git add .
git commit -m "Initial Eggsxactly commit"
git remote add origin https://github.com/YOUR_USERNAME/Eggsxactly.git
git push -u origin main
node_modules/
.expo/
build/
dist/
.env
git clone https://github.com/YOUR_USERNAME/Eggsxactly.git
cd Eggsxactly
npm install
npx expo start