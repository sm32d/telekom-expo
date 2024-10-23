import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BenefitIconProps {
  name?: string;
  text?: string;
}

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
}

type TabType = "Most Popular" | "Entertainment" | "Financial Services";

interface ServiceData {
  title: string;
  description: string;
  icon: string;
}

type ServicesByTabType = {
  [key in TabType]: ServiceData[];
};

export default function Services() {
  const tabs = ["Most Popular", "Entertainment", "Financial Services"] as const;
  type TabType = (typeof tabs)[number];

  const [activeTab, setActiveTab] = useState<TabType>("Most Popular");

  const BenefitIcon: React.FC<BenefitIconProps> = ({ name, text }) => (
    <View style={styles.benefitIcon}>
      {text ? (
        <Text style={styles.benefitText}>{text}</Text>
      ) : (
        <Ionicons name={name as any} size={16} color="#fff" />
      )}
    </View>
  );

  const PremiumCard = () => (
    <View style={styles.premiumCard}>
      <View style={styles.premiumHeader}>
        <Ionicons name="star" size={24} color="#fff" />
        <TouchableOpacity style={styles.learnMore}>
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.premiumTitle}>Boost Your Experience</Text>
      <Text style={styles.premiumDescription}>
        Unlock exclusive benefits with our Premium Subscription.
      </Text>
      <View style={styles.benefitsContainer}>
        <BenefitIcon text="50GB" />
        <BenefitIcon name="videocam" />
        <BenefitIcon name="musical-notes" />
        <BenefitIcon name="logo-apple" />
        <BenefitIcon text="+7" />
      </View>
      <View style={styles.subscriptionContainer}>
        <Text style={styles.priceText}>
          $19.99<Text style={styles.monthText}>/month</Text>
        </Text>
        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeText}>Subscribe Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ServiceCard: React.FC<ServiceCardProps> = ({
    title,
    description,
    icon,
  }) => (
    <TouchableOpacity style={styles.serviceCard}>
      <View style={styles.serviceContent}>
        <View style={styles.serviceTextContainer}>
          <Text style={styles.serviceTitle}>{title}</Text>
          <Text style={styles.serviceDescription}>{description}</Text>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: "#ff443c" }]}>
          <Ionicons name={icon as any} size={24} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderServices = () => {
    const services = servicesByTab[activeTab];
    return services.map((service: ServiceData, index: number) => (
      <ServiceCard
        key={index}
        title={service.title}
        description={service.description}
        icon={service.icon}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <PremiumCard />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {renderServices()}

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
  premiumCard: {
    backgroundColor: "#ff443c",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  premiumHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  learnMore: {
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  learnMoreText: {
    color: "#fff",
    fontSize: 14,
  },
  premiumTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  premiumDescription: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 16,
    marginBottom: 16,
  },
  benefitsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  benefitText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  subscriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  monthText: {
    fontSize: 16,
    fontWeight: "normal",
  },
  subscribeButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  subscribeText: {
    color: "#ff443c",
    fontSize: 16,
    fontWeight: "600",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tab: {
    marginRight: 20,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff443c",
  },
  tabText: {
    color: "#999",
    fontSize: 16,
  },
  activeTabText: {
    color: "#fff",
  },
  serviceCard: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  serviceContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  serviceTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  serviceDescription: {
    color: "#999",
    fontSize: 14,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSpacing: {
    height: 100,
  },
});

const servicesByTab: ServicesByTabType = {
  "Most Popular": [
    {
      title: "Smart Spam Call Blocker",
      description:
        "Automatically identify and block spam and fraudulent calls.",
      icon: "call-outline",
    },
    {
      title: "eSIM Services",
      description: "Activate and manage your eSIM effortlessly.",
      icon: "wifi-outline",
    },
    {
      title: "Mobile Wallet",
      description: "Make secure payments and manage your finances.",
      icon: "wallet-outline",
    },
    {
      title: "Data Add-ons",
      description: "Purchase additional data when you need it.",
      icon: "cellular-outline",
    },
  ],
  Entertainment: [
    {
      title: "Streaming Bundle",
      description: "Access premium streaming services at discounted rates.",
      icon: "play-outline",
    },
    {
      title: "Gaming Pass",
      description: "Unlimited access to mobile gaming content.",
      icon: "game-controller-outline",
    },
    {
      title: "Music Premium",
      description: "Ad-free music streaming with offline playback.",
      icon: "musical-notes-outline",
    },
  ],
  "Financial Services": [
    {
      title: "Bill Payments",
      description: "Pay all your utility bills in one place.",
      icon: "receipt-outline",
    },
    {
      title: "Mobile Insurance",
      description: "Protect your device against damage and theft.",
      icon: "shield-checkmark-outline",
    },
    {
      title: "International Transfer",
      description: "Send money abroad at competitive rates.",
      icon: "globe-outline",
    },
  ],
};
