import React, { Component } from "react";
import { View, Button } from "react-native";

export default class GraphScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Click me" color="#841584" />
      </View>
    );
  }
}
