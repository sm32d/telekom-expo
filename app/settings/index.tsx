import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SettingsPage = () => {
  const router = useRouter();

  interface SettingsItemProps {
    icon: string;
    title: string;
    description: string;
    onPress: () => void;
  }
  const SettingsItem = ({
    icon,
    title,
    description,
    onPress,
  }: SettingsItemProps) => {
    return (
      <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
        <View style={styles.settingsItemText}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          <Text style={styles.settingsItemDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>Settings</Text>
      <ScrollView>
        <SettingsItem
          icon="person-outline"
          title="Account"
          description="Manage your account details"
          onPress={() => {
            /* Navigate to account page */
          }}
        />
        <SettingsItem
          icon="card-outline"
          title="Billing"
          description="View and manage your billing information"
          onPress={() => {
            /* Navigate to billing page */
          }}
        />
        <SettingsItem
          icon="notifications-outline"
          title="Notifications"
          description="Customize your notification preferences"
          onPress={() => {
            /* Navigate to notifications page */
          }}
        />
        <SettingsItem
          icon="lock-closed-outline"
          title="Privacy & Security"
          description="Manage your privacy and security settings"
          onPress={() => {
            /* Navigate to privacy page */
          }}
        />
        <SettingsItem
          icon="help-circle-outline"
          title="Help & Support"
          description="Get assistance and view FAQs"
          onPress={() => {
            /* Navigate to help page */
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
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
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  settingsItemText: {
    flex: 1,
    marginLeft: 15,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  settingsItemDescription: {
    fontSize: 14,
    color: "#AAAAAA",
  },
});

export default SettingsPage;
