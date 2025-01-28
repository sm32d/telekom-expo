import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import useServiceData from "../hooks/useServiceData";
import AnimatedUsageCard from "../components/AnimatedUsageCard";
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  RefreshControl,
} from "react-native";

export default function Home() {
  const { profileData, serviceDetails, loading, error, refetch } =
    useServiceData();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch()]);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const renderUsageGrid = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff443c" />
        </View>
      );
    }

    if (error || !serviceDetails) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading usage data</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Find domestic inclusions
    const domesticData = serviceDetails.currentPlan.inclusions.find(
      (inclusion) =>
        inclusion.inclusionType === "gprs" &&
        inclusion.walletType === "domestic" &&
        inclusion.guiMetadata?.includes("Local Data"),
    );

    const domesticCalls = serviceDetails.currentPlan.inclusions.find(
      (inclusion) =>
        inclusion.inclusionType === "call" &&
        inclusion.walletType === "domestic" &&
        inclusion.guiMetadata?.includes("Local Outgoing Mins"),
    );

    const domesticSMS = serviceDetails.currentPlan.inclusions.find(
      (inclusion) =>
        inclusion.inclusionType === "sms" &&
        inclusion.walletType === "domestic" &&
        inclusion.guiMetadata?.includes("Local SMS"),
    );

    // Data calculations (KB to GB)
    const dataTotal = domesticData
      ? Number(domesticData.allowance) / (1024 * 1024)
      : 0;
    const dataRemaining = domesticData
      ? Number(domesticData.remaining) / (1024 * 1024)
      : 0;
    const dataPercentage =
      dataTotal > 0 ? (dataRemaining / dataTotal) * 100 : 0;

    // Calls calculations (seconds to minutes)
    const callsTotal = domesticCalls
      ? Math.round(Number(domesticCalls.allowance) / 60)
      : 0;
    const callsRemaining = domesticCalls
      ? Math.round(Number(domesticCalls.remaining) / 60)
      : 0;
    const callsPercentage =
      callsTotal > 0 ? (callsRemaining / callsTotal) * 100 : 0;

    // SMS calculations
    const smsTotal = domesticSMS ? Number(domesticSMS.allowance) : 0;
    const smsRemaining = domesticSMS ? Number(domesticSMS.remaining) : 0;
    const smsPercentage = smsTotal > 0 ? (smsRemaining / smsTotal) * 100 : 0;

    return (
      <View>
        <Text style={styles.usageHeading}>Remaining Allowance</Text>
        <View style={styles.usageGrid}>
          <AnimatedUsageCard
            title="Data"
            used={parseFloat(dataRemaining.toFixed(2))}
            total={parseFloat(dataTotal.toFixed(2))}
            unit="GB"
            percentage={dataPercentage}
          />
          <AnimatedUsageCard
            title="Calls"
            used={callsRemaining}
            total={callsTotal}
            unit="mins"
            percentage={callsPercentage}
          />
          <AnimatedUsageCard
            title="SMS"
            used={smsRemaining}
            total={smsTotal}
            unit="SMS"
            percentage={smsPercentage}
          />
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/profile",
              })
            }
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.userName}>
              {profileData?.lastName || "Loading..."}
            </Text>
            <Text style={styles.phoneNumber}>
              {profileData?.mobileNumber || "Loading..."}
            </Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff443c" // This will color the spinner
            colors={["#ff443c"]} // For Android
            progressBackgroundColor="#222" // For Android
          />
        }
      >
        {/* Balance Section */}
        <View style={styles.balanceContainer}>
          <View>
            <Text style={styles.balanceLabel}>Main Balance</Text>
            <Text style={styles.balanceAmount}>
              $
              {serviceDetails
                ? Number(serviceDetails.mainBalance).toFixed(2)
                : "0.00"}
            </Text>
            <Text style={styles.balanceTime}>
              Current plan expires on{" "}
              {serviceDetails
                ? new Date(serviceDetails.acctExpiry).toLocaleDateString(
                    "en-GB",
                  )
                : "N/A"}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.topUpButton}
              onPress={() =>
                Linking.openURL(
                  "https://account.eight.com.sg/dashboard/recharge",
                )
              }
            >
              <Text style={styles.topUpText}>Top-up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.autoReloadButton}
              onPress={() => router.push("/(tabs)/payments")}
            >
              <Text style={styles.autoReloadText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderUsageGrid()}

        {/* Add bottom padding to account for navigation bar */}
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
    padding: 20,
    marginBottom: 20,
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
    backgroundColor: "#ff443c",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    flex: 1,
  },
  autoReloadButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
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
  usageHeading: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    width: "47%",
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 20,
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
    borderColor: "#ff443c",
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
    borderRadius: 30,
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
    color: "#ff443c",
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
    color: "#ff443c",
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#ff443c",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
