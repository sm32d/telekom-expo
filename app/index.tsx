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
          <TouchableOpacity onPress={() => router.push("/notifications")}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

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

      {/* Previous bottom navigation code remains the same */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/")}
        >
          <Ionicons name="home" size={24} color="#ff6b6b" />
          <Text style={[styles.navText, { color: "#ff6b6b" }]}>Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/payments")}
        >
          <Ionicons name="card" size={24} color="#999" />
          <Text style={styles.navText}>Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/services")}
        >
          <Ionicons name="apps" size={24} color="#999" />
          <Text style={styles.navText}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/support")}
        >
          <Ionicons name="headset" size={24} color="#999" />
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
    paddingTop: 60,
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
  balanceContainer: {
    padding: 16,
    marginBottom: 16,
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
    borderRadius: 8,
    flex: 1,
  },
  autoReloadButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
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
    gap: 8,
  },
  usageCard: {
    width: "48%",
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
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
    width: "48%",
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
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
    borderRadius: 8,
    marginHorizontal: 10,
    alignItems: "center",
  },
  manageText: {
    color: "#ff6b6b",
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#222",
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 12,
    marginBottom: 8,
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
