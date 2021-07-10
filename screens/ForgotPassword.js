import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import firebase from "firebase";
import db from "../firebase/config";
import { Icon } from "react-native-elements";
import { windowWidth } from "../constants/Dimensions";

const ForgotPassword = ({ navigation }) => {
  const [user_email, setUser_email] = React.useState("");

  const sendPasswordReset = () => {
    if (user_email !== "") {
      firebase
        .auth()
        .sendPasswordResetEmail(user_email)
        .then(() => {
          setUser_email("");
          navigation.replace("Login");
          return alert("Check registered email and change passowrd ");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error);
        });
    } else {
      return alert("Invalid Email ID");
    }
  };

  function renderHeader() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: SIZES.padding * 6,
          paddingHorizontal: SIZES.padding * 2,
        }}
        onPress={() => navigation.replace("Login")}
      >
        <Image
          source={icons.back}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            tintColor: COLORS.white,
          }}
        />

        <Text
          style={{
            marginLeft: SIZES.padding * 1.5,
            color: COLORS.white,
            ...FONTS.h4,
          }}
        >
          Go Back
        </Text>
      </TouchableOpacity>
    );
  }

  function renderLogo() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 2,
          height: 100,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          alignSelf: "center",
        }}
      >
        <StatusBar hidden />
        <Text
          style={{
            color: "#fff",
            fontSize: 50,
            fontWeight: "bold",
            marginRight: -10,
          }}
        >
          Execu
        </Text>
        <Image
          source={images.wallieLogo}
          resizeMode="contain"
          style={{
            width: "12%",
          }}
        />
        <Text
          style={{
            color: "#fff",
            fontSize: 50,
            fontWeight: "bold",
            marginLeft: -10,
          }}
        >
          ive
        </Text>
      </View>
    );
  }

  function renderForm() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          marginHorizontal: SIZES.padding * 3,
        }}
      >
        <View style={{ marginTop: SIZES.padding * 3 }}>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
            Email
          </Text>
          <View style={{ position: "absolute", top: 40, left: 5 }}>
            <Icon type="feather" name="mail" size={28} color={COLORS.white} />
          </View>
          <TextInput
            value={user_email}
            onChangeText={(user_email) => setUser_email(user_email)}
            keyboardType="email-address"
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
              paddingLeft: 50,
            }}
            placeholder="Enter Email ID"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
        </View>
      </View>
    );
  }

  function renderButton() {
    return (
      <View style={{ margin: SIZES.padding * 3 }}>
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: COLORS.black,
            borderRadius: SIZES.radius / 1.5,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => sendPasswordReset()}
        >
          <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Verify</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={[COLORS.lime, COLORS.emerald]}
        style={{ flex: 1 }}
      >
        <ScrollView>
          {renderHeader()}
          {renderLogo()}
          {renderForm()}
          {renderButton()}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
