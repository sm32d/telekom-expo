import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const BillPaymentPage = () => {
  const router = useRouter();
  const { amountDue } = useLocalSearchParams();
  const [amount, setAmount] = useState("");

  const handlePayment = () => {
    console.log("Payment of $" + amount + " processed");
    router.back();
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
        <Text style={styles.headerTitle}>Bill Payment</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Bill Amount</Text>
            <Text style={styles.balanceAmount}>${amountDue}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Amount to Pay</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            style={styles.fillButton}
            onPress={() => setAmount(amountDue.toString())}
          >
            <Text style={styles.fillButtonText}>Pay Full Amount</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay Now</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

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
  card: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  balanceContainer: {
    alignItems: "center",
    padding: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#999",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  inputLabel: {
    fontSize: 16,
    color: "#999",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    fontSize: 18,
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
  },
  fillButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  fillButtonText: {
    fontSize: 16,
    color: "#ff443c",
    fontWeight: "600",
  },
  payButton: {
    backgroundColor: "#ff443c",
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default BillPaymentPage;
