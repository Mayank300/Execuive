import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { COLORS, FONTS, SIZES, icons, images } from "../constants";
import { BarCodeScanner } from "expo-barcode-scanner";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import ToastAnimation from "./ToastAnimation";
import { RFValue } from "react-native-responsive-fontsize";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

const ScanProductIdScreen = ({ navigation }) => {
  const [scanned, setScanned] = React.useState(false);
  const [data, setData] = React.useState("");
  const [messages, setMessages] = useState([]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
  };

  if (scanned) {
    navigation.navigate("AddScreen");
    setScanned(false);
  }

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: SIZES.padding * 4,
          paddingHorizontal: SIZES.padding * 3,
        }}
      >
        <TouchableOpacity
          style={{
            width: 45,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.pop()}
        >
          <Image
            source={icons.close}
            style={{
              height: 20,
              width: 20,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
            {scanned ? "Scanned" : "Scan Product"}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            height: 45,
            width: 45,
            backgroundColor: COLORS.green,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            const message = `${scanned ? "Scanned" : "Scan Product"}`;
            setMessages([...messages, message]);
          }}
        >
          <Image
            source={icons.info}
            style={{
              height: 25,
              width: 25,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.black,
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        style={{
          position: "absolute",
          top: 25,
          left: 0,
          right: 0,
        }}
      >
        {messages.map((message) => (
          <ToastAnimation
            key={message}
            message={message}
            onHide={() => {
              setMessages((messages) =>
                messages.filter((currentMessage) => currentMessage !== message)
              );
            }}
          />
        ))}
      </View>
      {renderHeader()}
      <View
        style={{
          // flex: 1,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          marginTop: windowHeight / 3.8,
        }}
      >
        <Image
          source={images.focus}
          resizeMode="stretch"
          style={{
            width: windowWidth - 100,
            height: 200,
          }}
        />
      </View>
    </View>
  );
};

function ScanProductId() {
  return (
    <Tab.Navigator
      initialRouteName="Scan"
      tabBarOptions={{
        activeTintColor: "#000",
        labelStyle: { fontSize: RFValue(18) },
      }}
      style={{
        marginTop: Platform.OS === "ios" ? 30 : null,
      }}
    >
      <Tab.Screen
        name="Scan"
        component={ScanProductIdScreen}
        options={{ tabBarLabel: "Scan" }}
      />
    </Tab.Navigator>
  );
}

export default ScanProductId;
