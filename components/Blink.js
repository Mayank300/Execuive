import React, { Component } from "react";
import { View, Animated } from "react-native";

export class Blink extends Component {
  constructor(props) {
    super(props);
    this.fadeAnimation = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.fadeAnimation, {
          toValue: 0,
          duration: this.props.duration,
          useNativeDriver: true,
        }),
        Animated.timing(this.fadeAnimation, {
          toValue: 1,
          duration: this.props.duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }

  render() {
    return (
      <View>
        <Animated.View style={{ opacity: this.fadeAnimation }}>
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
}

export default Blink;
