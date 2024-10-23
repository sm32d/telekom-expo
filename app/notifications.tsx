import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import useNotificationStore, { Notification } from "./store/notificationStore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Notifications() {
  const { notifications, deleteNotification } = useNotificationStore();
  const router = useRouter();

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.supportCard}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="notifications-outline" size={24} color="#ff443c" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.message}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={() => deleteNotification(item.id)}
      >
        <Ionicons name="close" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  supportCard: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    color: "#999",
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    color: "#666",
    fontSize: 12,
  },
  dismissButton: {
    padding: 4,
  },
});
