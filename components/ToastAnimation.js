import React, { useEffect, useRef } from "react";
import { Animated, Text, Platform } from "react-native";

const ToastAnimation = (props) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      props.onHide();
    });
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
        marginTop: Platform.OS === "ios" ? 60 : 10,
        marginHorizontal: 10,
        marginBottom: 5,
        backgroundColor: "#FFFAFA",
        padding: 10,
        borderRadius: 12,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 17,
          fontWeight: "bold",
        }}
      >
        {props.message}
      </Text>
    </Animated.View>
  );
};

export default ToastAnimation;
