import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

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
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleCircumference = 2 * Math.PI * 40; // radius is 40

  useEffect(() => {
    // Reset animation value before starting new animation
    animatedValue.setValue(0);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [percentage]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      circleCircumference,
      circleCircumference * (1 - percentage / 100),
    ],
  });

  return (
    <View style={styles.usageCard}>
      <Text style={styles.usageTitle}>{title}</Text>
      <View style={styles.circleContainer}>
        <Svg width={100} height={100}>
          {/* Background Circle */}
          <Circle
            cx={50}
            cy={50}
            r={40}
            stroke="#333"
            strokeWidth={8}
            fill="transparent"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={50}
            cy={50}
            r={40}
            stroke="#ff443c"
            strokeWidth={8}
            fill="transparent"
            strokeDasharray={`${circleCircumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </Svg>
        <View style={styles.usageTextContainer}>
          <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
        </View>
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
    borderRadius: 30,
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
    position: "relative",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  usageTextContainer: {
    position: "absolute",
    alignItems: "center",
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
