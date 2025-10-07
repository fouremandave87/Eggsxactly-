import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

function HomeScreen() {
  const [eggCount, setEggCount] = useState(0);
  const [date, setDate] = useState(new Date().toDateString());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const saved = await AsyncStorage.getItem("eggData");
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      const todayData = parsed.find((e) => e.date === today);
      if (todayData) setEggCount(todayData.count);
    }
  };

  const saveData = async (count) => {
    const saved = await AsyncStorage.getItem("eggData");
    let data = saved ? JSON.parse(saved) : [];
    const today = new Date().toDateString();

    const existing = data.findIndex((e) => e.date === today);
    if (existing >= 0) {
      data[existing].count = count;
    } else {
      data.push({ date: today, count });
    }
    await AsyncStorage.setItem("eggData", JSON.stringify(data));
  };

  const addEgg = () => {
    const newCount = eggCount + 1;
    setEggCount(newCount);
    saveData(newCount);
  };

  const resetCount = () => {
    Alert.alert("Reset Count", "Are you sure you want to reset today's count?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: async () => {
          setEggCount(0);
          saveData(0);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥚 Eggsxactly</Text>
      <Text style={styles.subtitle}>{date}</Text>
      <Text style={styles.count}>{eggCount}</Text>

      <TouchableOpacity style={styles.button} onPress={addEgg}>
        <Text style={styles.buttonText}>+ Add Egg</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.reset]} onPress={resetCount}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

function HistoryScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const saved = await AsyncStorage.getItem("eggData");
    if (saved) setData(JSON.parse(saved).reverse());
  };

  return (
    <View style={styles.container}>
      <