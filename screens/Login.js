import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "firebase";
import db from "../firebase/config";
import { Icon } from "react-native-elements";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import { windowHeight } from "../constants/Dimensions";
import * as Google from "expo-google-app-auth";
import { SocialIcon } from "react-native-elements";
import { windowWidth } from "../components/Dimensions";

const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [user_email, setUser_email] = React.useState("");
  const [user_password, setUser_password] = React.useState("");
  const [showLoading, setShowLoading] = React.useState(false);
  const [googleSubmitting, setGoogleSubmitting] = React.useState(false);
  const passwordRef = useRef(null);

  //  refs make excel sheet - quantity, name, productId,

  const handleGoogleSignIn = () => {
    setGoogleSubmitting(true);
    const config = {
      iosClientId: `537430705010-3gms7nmveb2khl8qplccp0rq30mvu4oh.apps.googleusercontent.com`,
      androidClientId: `537430705010-h0liglm3g84e2letcfn16p2mrd4rf78e.apps.googleusercontent.com`,
      scopes: ["profile", "email"],
    };

    Google.logInAsync(config)
      .then((result) => {
        const { type, user } = result;
        if (type === "success") {
          const { email, name, photoUrl } = user;
          Alert.alert(
            "Succesfully Connected!",
            "Please verify email before login"
          );

          db.collection("users")
            .add({
              user_name: name,
              email_id: email,
              photo_url: photoUrl,
              google_login: true,
              contact: "",
              selected_area: [
                {
                  callingCode: "",
                  code: "",
                  flag: "",
                  name: "",
                },
              ],
            })
            .then(() => {
              navigation.replace("Home");
            });
        } else {
          Alert.alert("Error Connecting !", "Google signin was canclled");
        }
        setGoogleSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        setGoogleSubmitting(false);
        Alert.alert("Error Connecting !", "Chek you network connection!");
      });
  };

  const login = (emailId, password) => {
    setShowLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then((authUser) => {
        if (authUser.user.emailVerified) {
          navigation.replace("Home");
          return alert("Logged in successfully !");
        } else {
          return alert("Verify Email before login !");
        }
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setShowLoading(false);
        alert(errorMessage);
        console.log(errorMessage);
      });
  };

  function renderLogo() {
    return (
      <View
        style={{
          marginTop: SIZES.padding * 5,
          height: 100,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          alignSelf: "center",
        }}
      >
        <StatusBar hidden />
        <Image
          source={require("../assets/app-icon.png")}
          resizeMode="contain"
          style={{
            width: "20%",
            marginRight: 12,
          }}
        />
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
          marginTop: SIZES.padding * 3,
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
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordRef.current.focus();
            }}
            blurOnSubmit={false}
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

        {/* Password */}
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
            Password
          </Text>
          {showPassword ? (
            <View style={{ position: "absolute", top: 37, left: 5 }}>
              <Icon
                type="feather"
                name="unlock"
                size={28}
                color={COLORS.white}
              />
            </View>
          ) : (
            <View style={{ position: "absolute", top: 37, left: 5 }}>
              <Icon type="feather" name="lock" size={28} color={COLORS.white} />
            </View>
          )}
          <TextInput
            ref={passwordRef}
            value={user_password}
            onChangeText={(user_password) => setUser_password(user_password)}
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
              paddingLeft: 50,
            }}
            placeholder="Enter Password"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 0,
              bottom: 10,
              height: 30,
              width: 30,
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Image
              source={showPassword ? icons.disable_eye : icons.eye}
              style={{
                height: 20,
                width: 20,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
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
          disabled={showLoading ? true : false}
          onPress={() => {
            login(user_email, user_password);
          }}
        >
          {showLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: 30,
          }}
          onPress={() => navigation.replace("ForgotPassword")}
        >
          <Text
            style={{ color: COLORS.white, ...FONTS.h4, textAlign: "center" }}
          >
            Forgot password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: 30,
          }}
          onPress={() => navigation.replace("SignUp")}
        >
          <Text
            style={{ color: COLORS.white, ...FONTS.h4, textAlign: "center" }}
          >
            Don't have an account? Make One !!!
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop: 30,
          }}
        >
          <SocialIcon
            iconColor="#000"
            title="Sign In With Google"
            button
            disabled={!googleSubmitting ? false : true}
            type="google"
            fontStyle={{ fontSize: 17 }}
            loading={!googleSubmitting ? false : true}
            onPress={() => {
              handleGoogleSignIn();
            }}
            style={{ height: 60 }}
          />
        </View>
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
          <View
            style={{
              justifyContent: "space-between",
            }}
          >
            <View>
              {renderLogo()}
              {renderForm()}
            </View>
            {renderButton()}
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default Login;
