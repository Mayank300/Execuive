import React from "react";
import { Platform } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants";
import { RFValue } from "react-native-responsive-fontsize";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();
import ScanProduct from "../components/ScanProduct";
import AddProduct from "../components/AddProduct";

function AddScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Add"
      tabBarOptions={{
        activeTintColor: "#000",
        labelStyle: { fontSize: RFValue(18) },
      }}
      style={Platform.OS === "ios" ? { marginTop: 30 } : null}
    >
      <Tab.Screen
        name="Add"
        component={AddProduct}
        options={{ tabBarLabel: "Add Product" }}
      />
      <Tab.Screen
        name="ScanProduct"
        component={ScanProduct}
        options={{ tabBarLabel: "Scan Product" }}
      />
    </Tab.Navigator>
  );
}

export default AddScreen;
