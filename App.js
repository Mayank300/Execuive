import React from "react";
import {
  SignUp,
  Login,
  OnboardingScreen,
  GraphScreen,
  SettingsScreen,
  ForgotPassword,
  ProductList,
  ProductInfo,
  EditProfileScreen,
  ExpiryProduct,
  NotificationScreen,
  BillScreen,
  OTPVerification,
} from "./screens";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Tabs from "./navigation/tabs";
import AmazonSearch from "./search/AmazonSearch";
import GoogleSearch from "./search/GoogleSearch";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: "transparent",
  },
};

const Stack = createStackNavigator();

const App = ({ navigation }) => {
  const [loaded] = useFonts({
    "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={"Onboarding"}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={Tabs} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Graph" component={GraphScreen} />
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="Profile" component={SettingsScreen} />
        <Stack.Screen name="ProductInfo" component={ProductInfo} />
        <Stack.Screen name="GoogleSearch" component={GoogleSearch} />
        <Stack.Screen name="AmazonSearch" component={AmazonSearch} />
        <Stack.Screen name="ExpiryProduct" component={ExpiryProduct} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Bill" component={BillScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
