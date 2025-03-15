import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import useAuthStore from "./store/authStore";

export default function Login() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { requestOTP, validateOTP } = useAuthStore();

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[89]\d{7}$/;
    return phoneRegex.test(number);
  };

  const handleRequestOTP = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setIsValidNumber(false);
      return;
    }

    try {
      setIsLoading(true);
      await requestOTP(phoneNumber);
      setShowOtpInput(true);
      setIsValidNumber(true);
    } catch (error) {
      console.error(error);
      // Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateOTP = async () => {
    try {
      setIsLoading(true);
      await validateOTP(otp);
      requestAnimationFrame(() => {
        router.replace("/");
      });
    } catch (error) {
      console.error(error);
      // Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    if (!isValidNumber) {
      setIsValidNumber(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input, 
                  { paddingRight: showOtpInput ? 70 : 16 },
                  !isValidNumber && styles.inputError
                ]}
                placeholder="Phone Number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                maxLength={8}
              />
              {!isValidNumber && (
                <Text style={styles.errorText}>
                  Please enter a valid 8-digit number starting with 8 or 9
                </Text>
              )}
              {showOtpInput && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setShowOtpInput(false)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>

            {showOtpInput && (
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={showOtpInput ? handleValidateOTP : handleRequestOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {showOtpInput ? "Verify OTP" : "Request OTP"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },
  editButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -14 }],
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#ff443c',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: "#ff443c",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff443c',
  },
  errorText: {
    color: '#ff443c',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
