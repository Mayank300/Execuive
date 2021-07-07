import React, { Component } from "react";
import { Share, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { WebView } from "react-native-webview";
import { windowWidth } from "../constants/Dimensions";

export default class AmazonSearch extends Component {
  render() {
    const { data } = this.props.route.params;
    const onShare = async () => {
      try {
        const result = await Share.share({
          message: `This is the link of product available on Amazon\nhttps://www.amazon.com/s?k=${data}&ref=nb_sb_noss`,
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
            uri: `https://www.amazon.com/s?k=${data}&ref=nb_sb_noss`,
          }}
        />
      </View>
    );
  }
}
