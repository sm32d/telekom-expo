import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

interface AnimatedUsageCardProps {
  title: string;
  used: number;
  total: number;
  unit: string;
  percentage: number;
}

const AnimatedUsageCard = ({
  title,
  used,
  total,
  unit,
  percentage,
}: AnimatedUsageCardProps) => {
  return (
    <View style={styles.usageCard}>
      <Text style={styles.usageTitle}>{title}</Text>
      <View style={styles.circleContainer}>
        <Progress.Circle
          size={80}
          progress={percentage / 100}
          thickness={8}
          color="#ff443c"
          unfilledColor="#333"
          borderWidth={0}
          animated={true}
          showsText={true}
          formatText={() => `${Math.round(percentage)}%`}
          textStyle={styles.percentageText}
        />
      </View>
      <Text style={styles.usageText}>
        <Text style={styles.usedText}>{used}</Text>/{total} {unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  usageCard: {
    width: "47%",
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  usageTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  percentageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  usageText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "bold",
  },
  usedText: {
    fontSize: 18,
  },
});

export default AnimatedUsageCard;
