import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useAuthStore from "../store/authStore";
import useServiceData from "../hooks/useServiceData";

interface PaymentHistory {
  transactedAt: string;
  paymentType: string;
  receipt: string;
  amount: string;
  product: string;
}

interface TimeFilter {
  label: string;
  value: number;
  startDate: () => string;
  endDate: () => string;
}

const timeFilters: TimeFilter[] = [
  {
    label: "Last Month",
    value: 1,
    startDate: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return date.toISOString().split("T")[0];
    },
    endDate: () => new Date().toISOString().split("T")[0],
  },
  {
    label: "Last 3 Months",
    value: 3,
    startDate: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      return date.toISOString().split("T")[0];
    },
    endDate: () => new Date().toISOString().split("T")[0],
  },
  {
    label: "Last 6 Months",
    value: 6,
    startDate: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 6);
      return date.toISOString().split("T")[0];
    },
    endDate: () => new Date().toISOString().split("T")[0],
  },
];

export default function Payments() {
  const router = useRouter();
  const { bearerToken } = useAuthStore();
  const { profileData } = useServiceData();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>(
    timeFilters[2],
  );

  const fetchPaymentHistory = async (filter: TimeFilter) => {
    try {
      if (!profileData?.svcId) throw new Error("No svcId found");
      setLoading(true);
      const response = await fetch(
        `https://account.eight.com.sg/api/v1/service/${profileData.svcId}/payment/history?startDate=${filter.startDate()}&endDate=${filter.endDate()}&rows=10&offset=0`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );
      const data = await response.json();
      if (data.code === 0) {
        setPaymentHistory(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileData?.svcId) {
      fetchPaymentHistory(selectedFilter);
    }
  }, [selectedFilter, bearerToken, profileData]);

  const PaymentCard = ({ payment }: { payment: PaymentHistory }) => (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <View style={styles.billPeriod}>
          <Text style={styles.billPeriodText}>{payment.product}</Text>
          <Text style={styles.billDateText}>
            {new Date(payment.transactedAt).toLocaleDateString("en-GB")}{" "}
            {new Date(payment.transactedAt).toLocaleTimeString("en-GB")}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: "#ff443c" }]}>
          <Text style={styles.statusText}>
            {payment.paymentType.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.billDetails}>
        <View>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountText}>
            ${Number(payment.amount).toFixed(2)}
          </Text>
        </View>
        <View>
          <Text style={styles.receiptLabel}>Receipt</Text>
          <Text style={styles.receiptText}>#{payment.receipt}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historic Payments</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.selectedFilterContainer}>
        <Text style={styles.selectedFilterText}>
          Showing payments for: {selectedFilter.label}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff443c" />
          </View>
        ) : (
          paymentHistory.map((payment, index) => (
            <PaymentCard key={payment.receipt + index} payment={payment} />
          ))
        )}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time Period</Text>
            {timeFilters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterOption,
                  selectedFilter.value === filter.value &&
                    styles.selectedFilter,
                ]}
                onPress={() => {
                  setSelectedFilter(filter);
                  setShowFilterModal(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedFilter.value === filter.value &&
                      styles.selectedFilterText,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  filterButton: {
    padding: 8,
  },
  selectedFilterContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  selectedFilterText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  billCard: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  billHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  billPeriod: {
    flex: 1,
  },
  billPeriodText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  billDateText: {
    color: "#999",
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  billDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 4,
  },
  amountText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  receiptLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 4,
  },
  receiptText: {
    color: "#fff",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 24,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  selectedFilter: {
    backgroundColor: "#ff443c",
  },
  filterOptionText: {
    color: "#fff",
    fontSize: 16,
  },
  bottomSpacing: {
    height: 100,
  },
});
