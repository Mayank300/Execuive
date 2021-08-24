import React, { Component } from "react";
import { View, Platform } from "react-native";
import { AdMobInterstitial } from "expo-ads-admob";

export class AdScreen extends Component {
  constructor(props) {
    super(props);

    this.interstitialAdId =
      Platform.OS === "ios"
        ? "ca-app-pub-4959856572636607/6574949076"
        : "ca-app-pub-4959856572636607/5645010787";
  }

  async componentDidMount() {
    await AdMobInterstitial.setAdUnitID(
      "ca-app-pub-4959856572636607/5645010787"
    );
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* <AdMobBanner
          bannerSize="fullBanner"
          adUnitID={this.bannerAdId}
          servePersonalizedAds={true}
        /> */}
        {/* <AdMobBanner
          bannerSize="mediumRectangle"
          adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
          servePersonalizedAds // true or false
          onDidFailToReceiveAdWithError={this.bannerError}
        /> */}
      </View>
    );
  }
}

export default AdScreen;
