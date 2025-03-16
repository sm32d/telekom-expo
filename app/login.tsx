import React, { useState, useEffect } from "react";
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
  Switch,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useAuthStore from "./store/authStore";
import profileService from "./services/profileService";

export default function Login() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState("");
  const [isValidOtp, setIsValidOtp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [profiles, setProfiles] = useState<{ phoneNumber: string; label?: string }[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [saveProfile, setSaveProfile] = useState(false);
  const { requestOTP, validateOTP } = useAuthStore();

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[89]\d{7}$/;
    return phoneRegex.test(number);
  };

  useEffect(() => {
    const loadProfiles = async () => {
      const savedProfiles = await profileService.getProfiles();
      setProfiles(savedProfiles.sort((a, b) => b.lastUsed - a.lastUsed));
    };
    loadProfiles();
  }, []);

  useEffect(() => {
    if (phoneNumber && validatePhoneNumber(phoneNumber)) {
      handleRequestOTP();
    }
  }, [phoneNumber]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleRequestOTP = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setIsValidNumber(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsValidNumber(true);
      
      if (saveProfile) {
        await profileService.addProfile(phoneNumber);
      }
      await profileService.updateLastUsed(phoneNumber);
      await requestOTP(phoneNumber);
      
      setShowOtpInput(true);
      setCountdown(60);
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
      setIsValidOtp(true);
      await validateOTP(otp);
      requestAnimationFrame(() => {
        router.replace("/");
      });
    } catch (error) {
      console.error('Invalid OTP', error);
      setIsValidOtp(false);
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
            {profiles.length > 0 && !showOtpInput && (
              <View style={styles.profilesContainer}>
                {profiles.map((profile) => (
                  <TouchableOpacity
                    key={profile.phoneNumber}
                    style={styles.profileCard}
                    onPress={() => {
                      setPhoneNumber(profile.phoneNumber);
                      setIsValidNumber(true);
                      // handleRequestOTP will be triggered by useEffect
                    }}
                  >
                    <View style={styles.profileCardContent}>
                      <View>
                        <Text style={styles.profileCardNumber}>{profile.phoneNumber}</Text>
                        <Text style={styles.profileCardLabel}>{profile.label || 'Tap to login'}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.profileDeleteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          setProfileToDelete(profile.phoneNumber);
                          setDeleteModalVisible(true);
                        }}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ff443c" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
              {!showOtpInput && (
                <View style={styles.saveProfileContainer}>
                  <Text style={styles.saveProfileText}>Save this number for future use</Text>
                  <Switch
                    value={saveProfile}
                    onValueChange={setSaveProfile}
                    trackColor={{ false: '#333', true: '#ff443c' }}
                    thumbColor={saveProfile ? '#fff' : '#666'}
                  />
                </View>
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
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, !isValidOtp && styles.inputError]}
                    placeholder="Enter OTP"
                    placeholderTextColor="#666"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={(text) => {
                      setOtp(text);
                      if (!isValidOtp) setIsValidOtp(true);
                    }}
                    maxLength={6}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />
                  {!isValidOtp && (
                    <Text style={styles.errorText}>
                      Invalid OTP. Please try again.
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.resendButton, countdown > 0 && styles.resendButtonDisabled]}
                  onPress={handleRequestOTP}
                  disabled={countdown > 0}
                >
                  <Text style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                  </Text>
                </TouchableOpacity>
              </>
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

          <Modal
            animationType="fade"
            transparent={true}
            visible={deleteModalVisible}
            onRequestClose={() => setDeleteModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Delete Profile</Text>
                    <Text style={styles.modalText}>
                      Are you sure you want to delete this profile? This action cannot be undone.
                    </Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => setDeleteModalVisible(false)}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.deleteButton]}
                        onPress={async () => {
                          if (profileToDelete) {
                            await profileService.deleteProfile(profileToDelete);
                            const updatedProfiles = await profileService.getProfiles();
                            setProfiles(updatedProfiles);
                          }
                          setDeleteModalVisible(false);
                          setProfileToDelete(null);
                        }}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 20,
  },
  cancelButton: {
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#ff443c",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  profilesContainer: {
    marginBottom: 16,
    gap: 8,
  },
  profileCard: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  profileCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileDeleteButton: {
    padding: 8,
  },
  profileCardNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  profileCardLabel: {
    color: '#666',
    fontSize: 14,
  },
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
    borderRadius: 20,
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
    borderRadius: 20,
  },
  editButtonText: {
    color: '#ff443c',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: "#ff443c",
    borderRadius: 20,
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
  resendButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendText: {
    color: '#ff443c',
    fontSize: 14,
    fontWeight: '500',
  },
  resendTextDisabled: {
    color: '#666',
  },
  saveProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  saveProfileText: {
    color: '#999',
    fontSize: 14,
  },
});
