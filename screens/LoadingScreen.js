import React, { Component } from "react";
import { ActivityIndicator, View } from "react-native";
import LottieView from "lottie-react-native";
import { windowHeight, windowWidth } from "../constants/Dimensions";

export class LoadingScreen extends Component {
  componentDidMount() {
    this.animation.play();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LottieView
          ref={(animation) => {
            this.animation = animation;
          }}
          style={{
            width: windowWidth,
            height: windowHeight,
            backgroundColor: "#eaeef7",
          }}
          source={require("../assets/no-internet.json")}
        />
      </View>
    );
  }
}

export default LoadingScreen;
