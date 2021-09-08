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
  HomeComponent,
  NotificationScreen,
  BillScreen,
  SellerScreen,
  ExpiredProductScreen,
  LoadingScreen,
  MyActivities,
  TodoScreen,
  SoldScreen,
  GoogleSignInForm,
} from "./screens";
import AdScreen from "./AdScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Tabs from "./navigation/tabs";
import AmazonSearch from "./search/AmazonSearch";
import GoogleSearch from "./search/GoogleSearch";
import NetInfo from "@react-native-community/netinfo";
import ScanProduct from "./components/ScanProduct";
import ScanProductId from "./components/ScanProductId";
import AddProduct from "./components/AddProduct";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: "transparent",
  },
};

const Stack = createStackNavigator();

const MainRoute = ({ navigation }) => {
  React.useEffect(() => {
    const interval = setInterval(() => {
      NetInfo.addEventListener((networkState) => {
        if (networkState.isConnected) {
          setShowApp(true);
        } else {
          setShowApp(false);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [loaded] = useFonts({
    "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });

  const [showApp, setShowApp] = React.useState(false);

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer theme={theme}>
      {showApp ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          // initialRouteName={"AdScreen"}
          initialRouteName={"Onboarding"}
        >
          {/* <Stack.Screen name="AdScreen" component={AdScreen} /> */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Home" component={Tabs} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Graph" component={GraphScreen} />
          <Stack.Screen name="ProductList" component={ProductList} />
          <Stack.Screen name="Profile" component={SettingsScreen} />
          <Stack.Screen name="SellerScreen" component={SellerScreen} />
          <Stack.Screen name="ProductInfo" component={ProductInfo} />
          <Stack.Screen name="GoogleSearch" component={GoogleSearch} />
          <Stack.Screen name="AmazonSearch" component={AmazonSearch} />
          <Stack.Screen name="TodoScreen" component={TodoScreen} />
          <Stack.Screen name="HomeComponent" component={HomeComponent} />
          <Stack.Screen name="ScanProduct" component={ScanProduct} />
          <Stack.Screen name="ScanProductId" component={ScanProductId} />
          <Stack.Screen name="SoldScreen" component={SoldScreen} />
          <Stack.Screen name="AddProduct" component={AddProduct} />
          <Stack.Screen name="GoogleSignInForm" component={GoogleSignInForm} />
          <Stack.Screen
            name="ExpiredProductScreen"
            component={ExpiredProductScreen}
          />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
          />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Bill" component={BillScreen} />
          <Stack.Screen name="MyActivities" component={MyActivities} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={"Loading"}
        >
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default MainRoute;
