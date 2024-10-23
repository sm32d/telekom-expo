import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SettingsPage() {
  const router = useRouter();

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
          onPress={() => {}}
        />
        <SettingsItem
          icon="card-outline"
          title="Billing"
          description="View and manage your billing information"
          onPress={() => {}}
        />
        <SettingsItem
          icon="notifications-outline"
          title="Notifications"
          description="Customize your notification preferences"
          onPress={() => {}}
        />
        <SettingsItem
          icon="lock-closed-outline"
          title="Privacy & Security"
          description="Manage your privacy and security settings"
          onPress={() => {}}
        />
        <SettingsItem
          icon="help-circle-outline"
          title="Help & Support"
          description="Get assistance and view FAQs"
          onPress={() => {
            router.back(); // First go back
            setTimeout(() => {
              router.replace("/(tabs)/support"); // Then switch to support tab
            }, 100);
          }}
        />
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
  bottomSpacing: {
    height: 100,
  },
});
