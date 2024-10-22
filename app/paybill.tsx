import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const BillPaymentPage = () => {
  const router = useRouter();
  const { amountDue } = useLocalSearchParams();

  const [amount, setAmount] = useState("");

  const handlePayment = () => {
    // Implement payment logic here
    console.log("Payment of $" + amount + " processed");
    // You might want to update the balance in your Zustand store here
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>Bill Payment</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>${amountDue}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Amount to Pay</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
          placeholderTextColor="#999999"
        />
        <TouchableOpacity
          style={styles.fillButton}
          onPress={() => setAmount(amountDue.toString())}
        >
          <Text style={styles.fillButtonText}>Pay All</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 30,
  },
  balanceContainer: {
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#AAAAAA",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: "#AAAAAA",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
    fontSize: 18,
    padding: 15,
    borderRadius: 10,
  },
  fillButton: {
    paddingVertical: 5, // Smaller vertical padding
    paddingHorizontal: 10, // Horizontal padding for a compact look
    borderRadius: 5, // Slightly rounded corners
    alignSelf: "flex-start", // Aligns the button to the start
    marginTop: 10, // Space above the button
    backgroundColor: "#333333",
  },
  fillButtonText: {
    fontSize: 14, // Smaller font size for a compact button
    fontWeight: "bold",
    color: "#0099FF",
  },
  payButton: {
    backgroundColor: "#ff6b6b",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BillPaymentPage;
