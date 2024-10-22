import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useRef } from "react";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedUsageCardProps {
  title: string;
  used: number;
  total: number;
  unit: string;
}

const AnimatedUsageCard = ({
  title,
  used,
  total,
  unit,
}: AnimatedUsageCardProps) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const percentage = (used / total) * 100;

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: percentage,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [percentage]);

  const circleCircumference = 2 * Math.PI * 40; // radius is 40
  const strokeDashoffset = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: [circleCircumference, 0],
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
            stroke="#ff6b6b"
            strokeWidth={8}
            fill="transparent"
            strokeDasharray={circleCircumference}
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
    width: "48%",
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
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
