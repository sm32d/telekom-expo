import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import useUsageStore from "./store/usageStore";
import AnimatedUsageCard from "./components/AnimatedUsageCard";
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function Home() {
  const { usageData, loading, error, fetchUsageData } = useUsageStore();
  const router = useRouter();
  useEffect(() => {
    fetchUsageData();
  }, []);

  const renderUsageGrid = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b6b" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading usage data</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUsageData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.usageGrid}>
        <AnimatedUsageCard title="Data" {...usageData.data} />
        <AnimatedUsageCard title="Calls" {...usageData.calls} />
        <AnimatedUsageCard title="SMS" {...usageData.sms} />
        <View style={styles.moreOptionsCard}>
          <Text style={styles.moreOptionsTitle}>More options</Text>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => router.push("/more-options")}
          >
            <Text style={styles.manageText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Previous header code remains the same */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.userName}>Andrew</Text>
            <Text style={styles.phoneNumber}>9999-8888</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/settings")}
          >
            <Ionicons name="settings-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Section */}
        <View style={styles.balanceContainer}>
          <View>
            <Text style={styles.balanceLabel}>Bill</Text>
            <Text style={styles.balanceAmount}>${usageData.bill.amount}</Text>
            <Text style={styles.balanceTime}>Due on {usageData.bill.due}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.topUpButton}
              onPress={() =>
                router.push({
                  pathname: "/paybill",
                  params: { amountDue: usageData.bill.amount },
                })
              }
            >
              <Text style={styles.topUpText}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.autoReloadButton}
              onPress={() => router.push("/auto-reload")}
            >
              <Text style={styles.autoReloadText}>Set Autopay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderUsageGrid()}

        {/* Add bottom padding to account for navigation bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/")}
        >
          <View style={[styles.iconButton, { backgroundColor: "#ff6b6b" }]}>
            <Ionicons name="home" size={18} color="#fff" />
          </View>
          <Text style={[styles.navText, { color: "#ff6b6b" }]}>Summary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/payments")}
        >
          <View style={styles.iconButton}>
            <Ionicons name="card" size={18} color="#999" />
          </View>
          <Text style={styles.navText}>Payments</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/services")}
        >
          <View style={styles.iconButton}>
            <Ionicons name="apps" size={18} color="#999" />
          </View>
          <Text style={styles.navText}>Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/support")}
        >
          <View style={styles.iconButton}>
            <Ionicons name="headset" size={18} color="#999" />
          </View>
          <Text style={styles.navText}>Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
    paddingHorizontal: 24,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  phoneNumber: {
    color: "#999",
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 8,
  },
  bottomSpacing: {
    height: 100,
  },
  balanceContainer: {
    padding: 20, // Increased padding
    marginBottom: 20, // Increased bottom margin
    backgroundColor: "#222",
    borderRadius: 20,
    marginHorizontal: 8,
    marginTop: 12,
  },
  balanceLabel: {
    color: "#999",
    fontSize: 16,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 4,
  },
  balanceTime: {
    color: "#999",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  topUpButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25, // More rounded corners
    flex: 1,
  },
  autoReloadButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25, // More rounded corners
    flex: 1,
  },
  topUpText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  autoReloadText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  usageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    gap: 16,
    marginTop: 0,
    justifyContent: "space-between",
  },
  usageCard: {
    width: "47%", // Adjust width considering the new gap
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 20, // Increased padding
  },
  usageTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  usageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#ff6b6b",
    alignItems: "center",
    justifyContent: "center",
  },
  usageText: {
    color: "#fff",
    fontSize: 20,
    marginTop: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  moreOptionsCard: {
    width: "47%",
    backgroundColor: "#222",
    borderRadius: 30, // More rounded corners
    padding: 16,
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  moreOptionsTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  manageButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginHorizontal: 10,
    alignItems: "center",
  },
  manageText: {
    color: "#ff6b6b",
    fontSize: 14,
  },
  iconButton: {
    backgroundColor: "#333",
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#222",
    position: "absolute",
    bottom: 8,
    left: 16,
    right: 16,
    borderRadius: 30,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
