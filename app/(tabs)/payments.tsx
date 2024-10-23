import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useUsageStore, { Bill } from "../store/usageStore";

export default function Payments() {
  const router = useRouter();
  const { usageData } = useUsageStore();
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "paid" | "pending"
  >("all");

  const filters = [
    { label: "All", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Pending", value: "pending" },
  ];

  const filteredBills = usageData.billHistory.filter((bill) =>
    selectedFilter === "all" ? true : bill.status === selectedFilter,
  );

  const BillCard = ({ bill }: { bill: Bill }) => (
    <TouchableOpacity
      style={styles.billCard}
      onPress={() =>
        router.push({
          pathname: "/bill-details",
          params: { billId: bill.id },
        })
      }
    >
      <View style={styles.billHeader}>
        <View style={styles.billPeriod}>
          <Text style={styles.billPeriodText}>{bill.billPeriod}</Text>
          <Text style={styles.billDateText}>
            Generated on {new Date(bill.date).toLocaleDateString()}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                bill.status === "paid"
                  ? "#1a472a"
                  : bill.status === "pending"
                    ? "#2a2a2a"
                    : "#4a1515",
            },
          ]}
        >
          <Text style={styles.statusText}>{bill.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.billDetails}>
        <View>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountText}>${bill.amount.toFixed(2)}</Text>
        </View>
        <View>
          <Text style={styles.dueDateLabel}>Due Date</Text>
          <Text style={styles.dueDateText}>
            {new Date(bill.dueDate).toLocaleDateString()}
          </Text>
        </View>
        {bill.status === "pending" && (
          <TouchableOpacity
            style={styles.payButton}
            onPress={() =>
              router.push({
                pathname: "/paybill",
                params: { amountDue: bill.amount },
              })
            }
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                selectedFilter === filter.value && styles.activeFilter,
              ]}
              onPress={() => setSelectedFilter(filter.value as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.value && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredBills.map((bill) => (
          <BillCard key={bill.id} bill={bill} />
        ))}

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
  filterContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#222",
  },
  activeFilter: {
    backgroundColor: "#ff443c",
  },
  filterText: {
    color: "#999",
    fontSize: 14,
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "600",
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
    borderRadius: 12,
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
  dueDateLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 4,
  },
  dueDateText: {
    color: "#fff",
    fontSize: 16,
  },
  payButton: {
    backgroundColor: "#ff443c",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 100,
  },
});
