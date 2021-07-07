import React, { Component } from "react";
import { Share, Text, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { WebView } from "react-native-webview";
import { windowWidth } from "../constants/Dimensions";

export default class GoogleSearch extends Component {
  render() {
    const { data } = this.props.route.params;

    const onShare = async () => {
      try {
        const result = await Share.share({
          message: `This is the link of product available on Google\nhttps://www.google.com/search?q=${data}&oq=${data}&aqs=chrome..69i57.947j0j1&sourceid=chrome&ie=UTF-8`,
        });
      } catch (error) {
        alert(error.message);
      }
    };

    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.pop();
          }}
          style={{ marginLeft: -windowWidth + 80, margin: 20 }}
        >
          <Icon type="feather" name="x" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onShare()}
          style={{ position: "absolute", top: 20, right: 20 }}
        >
          <Icon type="feather" name="share" size={25} />
        </TouchableOpacity>
        <WebView
          source={{
            uri: `https://www.google.com/search?q=${data}&oq=${data}&aqs=chrome..69i57.947j0j1&sourceid=chrome&ie=UTF-8`,
          }}
        />
      </View>
    );
  }
}
