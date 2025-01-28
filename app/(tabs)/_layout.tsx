import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        height: 80,
        backgroundColor: "#222",
        borderTopWidth: 0,
        position: "absolute",
        bottom: 8,
        left: 16,
        right: 16,
        borderRadius: 30,
        paddingVertical: 0,
        marginHorizontal: 16,
      },
        tabBarIcon: ({ focused, color, size }) => null, // handle icons in tabBarLabel
        tabBarLabel: ({ focused, color, children }) => {
          const getIconName = () => {
            switch (children) {
              case "index":
                return "home";
              case "payments":
                return "card";
              case "services":
                return "apps";
              case "support":
                return "headset";
              default:
                return "home";
            }
          };

          return (
            <View style={{ 
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              alignItems: "center",
             }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: focused ? "#ff443c" : "#333",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <Ionicons
                  name={getIconName()}
                  size={18}
                  color={focused ? "#fff" : "#999"}
                />
              </View>
              <Text
                style={{
                  color: focused ? "#ff443c" : "#999",
                  fontSize: 12,
                }}
              >
                {children === "index"
                  ? "Summary"
                  : children.charAt(0).toUpperCase() + children.slice(1)}
              </Text>
            </View>
          );
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="payments" />
      <Tabs.Screen name="support" />
    </Tabs>
  );
}
