import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import useServiceData from "../hooks/useServiceData";

interface Settings {
  receivePromotionalMessages: boolean;
  disableInternationalCall: boolean;
  disableInternationalSMS: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { bearerToken } = useAuthStore();
  const { profileData } = useServiceData();
  const [settings, setSettings] = useState<Settings>({
    receivePromotionalMessages: true,
    disableInternationalCall: false,
    disableInternationalSMS: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileData?.svcId) {
      fetchSettings();
    }
  }, [profileData]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(
        `https://account.eight.com.sg/api/v1/service/${profileData?.svcId}/settings`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );
      const data = await response.json();
      if (data.code === 0) {
        setSettings({
          receivePromotionalMessages: data.data.receivePromotionalMessages,
          disableInternationalCall: data.data.disableInternationalCall,
          disableInternationalSMS: data.data.disableInternationalSMS,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    try {
      const response = await fetch(
        `https://account.eight.com.sg/api/v1/service/${profileData?.svcId}/settings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newSettings,
            doNotCall: false,
          }),
        },
      );
      const data = await response.json();
      if (data.code === 0) {
        setSettings(newSettings);
      }
    } catch (error) {
      console.error(error);
    }
  };

  interface SettingsItemProps {
    icon: any;
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
      <TouchableOpacity style={styles.supportCard} onPress={onPress}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={24} color="#ff443c" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>
    );
  };

  const ToggleItem = ({ title, value, onValueChange }: any) => (
    <View style={styles.toggleContainer}>
      <Text style={styles.toggleText}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#666", true: "#ff443c" }}
        thumbColor="#fff"
      />
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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsItem
          icon="person-outline"
          title="Account"
          description="Manage your account details"
          onPress={() => router.push("/profile")}
        />
        <SettingsItem
          icon="help-circle-outline"
          title="Help & Support"
          description="Get assistance and view FAQs"
          onPress={() => {
            router.back();
            setTimeout(() => {
              router.replace("/(tabs)/support");
            }, 100);
          }}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication Preferences</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ff443c" />
            </View>
          ) : (
            <View style={styles.toggleGroup}>
              <ToggleItem
                title="I would like to receive promotional messages and updates from eight"
                value={settings.receivePromotionalMessages}
                onValueChange={(value: boolean) =>
                  updateSettings({
                    ...settings,
                    receivePromotionalMessages: value,
                  })
                }
              />
              <ToggleItem
                title="I would like to block all overseas (international) calls"
                value={settings.disableInternationalCall}
                onValueChange={(value: boolean) =>
                  updateSettings({
                    ...settings,
                    disableInternationalCall: value,
                  })
                }
              />
              <ToggleItem
                title="I would like to block all overseas (international) SMS"
                value={settings.disableInternationalSMS}
                onValueChange={(value: boolean) =>
                  updateSettings({
                    ...settings,
                    disableInternationalSMS: value,
                  })
                }
              />
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
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
    alignItems: "center",
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
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: "#999",
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  toggleGroup: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  toggleText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
    marginRight: 16,
  },
  bottomSpacing: {
    height: 100,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
});
