import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/authStore";

interface AccountDetails {
  svcId: string;
  mobileNumber: string;
  serialNumber: string;
  plan: string;
  firstName: string | null;
  lastName: string;
  blockNumber: string | null;
  unitNumber: string | null;
  streetName: string | null;
  postcode: string;
  buildingName: string | null;
  contactMobile: string | null;
  email: string | null;
}

export default function Profile() {
  const router = useRouter();
  const { bearerToken } = useAuthStore();
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountDetails();
  }, []);

  const fetchAccountDetails = async () => {
    try {
      const response = await fetch(
        "https://account.eight.com.sg/api/v1/service/account/details",
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );
      const data = await response.json();
      if (data.code === 0 && data.data.length > 0) {
        setAccountDetails(data.data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderDetailItem = (label: string, value: string | null) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || "Not provided"}</Text>
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
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.name}>
            {accountDetails?.lastName || "Loading..."}
          </Text>
          <Text style={styles.plan}>
            {accountDetails?.plan || "Loading..."}
          </Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {renderDetailItem(
            "Mobile Number",
            formatPhoneNumber(accountDetails?.mobileNumber),
          )}
          {renderDetailItem("Email", accountDetails?.email || "Not provided")}
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Address</Text>
          {renderDetailItem(
            "Block",
            accountDetails?.blockNumber || "Not provided",
          )}
          {renderDetailItem(
            "Unit",
            accountDetails?.unitNumber || "Not provided",
          )}
          {renderDetailItem(
            "Street",
            accountDetails?.streetName || "Not provided",
          )}
          {renderDetailItem(
            "Building",
            accountDetails?.buildingName || "Not provided",
          )}
          {renderDetailItem(
            "Postal Code",
            accountDetails?.postcode || "Not provided",
          )}
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          {renderDetailItem(
            "Service ID",
            accountDetails?.svcId || "Not available",
          )}
          {renderDetailItem(
            "SIM Serial",
            accountDetails?.serialNumber || "Not available",
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 32,
    paddingHorizontal: 24,
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
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  plan: {
    color: "#999",
    fontSize: 16,
  },
  detailsCard: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    color: "#fff",
    fontSize: 16,
  },
  bottomSpacing: {
    height: 100,
  },
});

const formatPhoneNumber = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return "Loading...";

  // Remove any non-digit characters and country code (65)
  const cleaned = phoneNumber.replace(/\D/g, "").replace(/^65/, "");

  // Split into groups and join with hyphen
  const first = cleaned.slice(0, 4);
  const second = cleaned.slice(4);

  return `${first}-${second}`;
};
