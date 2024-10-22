import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import useNotificationStore, { Notification } from "./store/notificationStore";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Notifications() {
  const { notifications, deleteNotification } = useNotificationStore();
  const router = useRouter();

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationDate}>{item.date}</Text>
      </View>
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={() => deleteNotification(item.id)}
      >
        <Ionicons name="close" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>Notifications</Text>
      {/** Render your notifications here */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 30,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: "#333333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between content and dismiss button
    alignItems: "center", // Center items vertically
  },
  notificationContent: {
    flex: 1, // Allow content to take available space
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#AAAAAA",
  },
  notificationDate: {
    fontSize: 12,
    color: "#999999",
    marginTop: 5,
  },
  dismissButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  dismissButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
