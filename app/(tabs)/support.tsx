import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Support() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>How can we help you?</Text>

        <TouchableOpacity
          style={styles.supportCard}
          onPress={() => router.push("/faqs")}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="help-circle-outline" size={24} color="#ff443c" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>FAQs</Text>
              <Text style={styles.cardDescription}>
                Find quick answers to common questions
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.supportCard}
          onPress={() => router.push("/email-support")}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={24} color="#ff443c" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Email Support</Text>
              <Text style={styles.cardDescription}>
                Send us your questions or complaints
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.supportCard}
          onPress={() => router.push("/live-chat")}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubbles-outline" size={24} color="#ff443c" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Live Chat</Text>
              <Text style={styles.cardDescription}>
                Chat with our support team in real-time
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.supportCard}
          onPress={() => router.push("/store-locator")}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={24} color="#ff443c" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Store Locator</Text>
              <Text style={styles.cardDescription}>
                Find our nearest service center
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

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
    padding: 16,
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
  sectionTitle: {
    color: "#999",
    fontSize: 16,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  supportCard: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    color: "#999",
    fontSize: 14,
  },
  bottomSpacing: {
    height: 100,
  },
  iconButton: {
    backgroundColor: "#333",
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
