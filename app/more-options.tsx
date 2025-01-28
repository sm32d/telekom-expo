import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import useServiceData from "./hooks/useServiceData";
import { Ionicons } from "@expo/vector-icons";

export default function MoreOptions() {
  const { serviceDetails, loading, error } = useServiceData();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>More Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff443c" />
        </View>
      </View>
    );
  }

  const kbToGb = (kb: string) => (Number(kb) / (1024 * 1024)).toFixed(2);
  const secondsToMinutes = (seconds: string) =>
    Math.round(Number(seconds) / 60);

  const renderDetailItem = (label: string, value: string, icon: string) => (
    <View style={styles.detailItem}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color="#ff443c" style={styles.icon} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>More Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name="phone-portrait" size={24} color="#ff443c" />
            </View>
            <Text style={styles.sectionTitle}>Plan Information</Text>
          </View>
          {renderDetailItem(
            "Plan Name",
            serviceDetails?.currentPlan.productName || "",
            "document-text",
          )}
          {renderDetailItem(
            "Start Date",
            new Date(
              serviceDetails?.currentPlan.startDate || "",
            ).toLocaleDateString("en-GB"),
            "calendar",
          )}
          {renderDetailItem(
            "End Date",
            new Date(
              serviceDetails?.currentPlan.endDate || "",
            ).toLocaleDateString("en-GB"),
            "calendar-outline",
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name="globe" size={24} color="#ff443c" />
            </View>
            <Text style={styles.sectionTitle}>Roaming Data</Text>
          </View>
          {serviceDetails?.currentPlan.inclusions
            .filter(
              (inclusion) =>
                inclusion.walletType === "roaming" &&
                inclusion.inclusionType === "gprs",
            )
            .map((data, index) => (
              <View key={`roaming-${index}-${data.guiMetadata}`}>
                {renderDetailItem(
                  data.guiMetadata?.split(",")[2] || "Roaming Data",
                  `${kbToGb(data.remaining)}/${kbToGb(data.allowance)} GB`,
                  "cellular",
                )}
              </View>
            ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name="call" size={24} color="#ff443c" />
            </View>
            <Text style={styles.sectionTitle}>International Calls</Text>
          </View>
          {renderDetailItem(
            "IDD Minutes",
            `${secondsToMinutes(
              serviceDetails?.currentPlan.inclusions.find(
                (i) => i.walletType === "IDD",
              )?.remaining || "0",
            )}/${secondsToMinutes(
              serviceDetails?.currentPlan.inclusions.find(
                (i) => i.walletType === "IDD",
              )?.allowance || "0",
            )} mins`,
            "time",
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name="server" size={24} color="#ff443c" />
            </View>
            <Text style={styles.sectionTitle}>Data Bank</Text>
          </View>
          {renderDetailItem(
            "Saved Data",
            `${kbToGb(serviceDetails?.databank.inclusions[0].remaining || "0")} GB`,
            "save",
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name="wallet" size={24} color="#ff443c" />
            </View>
            <Text style={styles.sectionTitle}>Account Status</Text>
          </View>
          {renderDetailItem(
            "Main Balance",
            `$${Number(serviceDetails?.mainBalance || 0).toFixed(2)}`,
            "cash",
          )}
          {renderDetailItem(
            "Account Expiry",
            new Date(serviceDetails?.acctExpiry || "").toLocaleDateString(
              "en-GB",
            ),
            "hourglass",
          )}
          {renderDetailItem(
            "Service Type",
            (serviceDetails?.serviceType || "").toUpperCase(),
            "information-circle",
          )}
        </View>
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
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  detailLabel: {
    color: "#999",
    fontSize: 16,
  },
  detailValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
