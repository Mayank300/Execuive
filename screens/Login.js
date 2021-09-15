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
  ImageBackground,
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
import { RFValue } from "react-native-responsive-fontsize";

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
            "Thank you for creating your account"
          );
          onSignIn(result);
          // navigation.replace("GoogleSignInForm", {
          //   user_name: name,
          //   email_id: email,
          //   photo_url: photoUrl,
          //   google_login: true,
          // });
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

  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const onSignIn = (googleUser) => {
    console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        const credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((result) => {
            console.log(result);
            try {
              db.collection("users").add({
                user_name: result.additionalUserInfo.profile.name,
                email_id: result.user.email,
                contact: "",
                selected_area: "",
                google_login: true,
              });
            } catch (error) {
              console.log(error);
            }
            //create document in users collections
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            console.log(error);
            // The credential that was used.
            // const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  const login = (emailId, password) => {
    setShowLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then((authUser) => {
        setShowLoading(false);
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
          marginTop: SIZES.padding * 6,
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
          <Text style={{ color: "#1BB273", ...FONTS.body3 }}>Email</Text>
          <View style={{ position: "absolute", top: 40, left: 5 }}>
            <Icon type="feather" name="mail" size={28} color={"#5B5D69"} />
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
              borderBottomColor: "#1BB273",
              borderBottomWidth: 1,
              height: 40,
              color: "#5B5D69",
              ...FONTS.body3,
              paddingLeft: 50,
            }}
            placeholder="Enter Email ID"
            placeholderTextColor={"#5B5D69"}
            selectionColor={"#5B5D69"}
          />
        </View>

        {/* Password */}
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: "#1BB273", ...FONTS.body3 }}>Password</Text>
          {showPassword ? (
            <View style={{ position: "absolute", top: 37, left: 5 }}>
              <Icon type="feather" name="unlock" size={28} color={"#5B5D69"} />
            </View>
          ) : (
            <View style={{ position: "absolute", top: 37, left: 5 }}>
              <Icon type="feather" name="lock" size={28} color={"#5B5D69"} />
            </View>
          )}
          <TextInput
            ref={passwordRef}
            value={user_password}
            onChangeText={(user_password) => setUser_password(user_password)}
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: "#1BB273",
              borderBottomWidth: 1,
              height: 40,
              color: "#5B5D69",
              ...FONTS.body3,
              paddingLeft: 50,
            }}
            placeholder="Enter Password"
            placeholderTextColor={"#5B5D69"}
            selectionColor={"#5B5D69"}
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
                tintColor: "#5B5D69",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderButton() {
    return (
      <View
        style={{
          margin: SIZES.padding * 3,
          height: 400,
          marginBottom: 150,
        }}
      >
        {/* forgot password */}
        <TouchableOpacity
          style={{
            marginBottom: 30,
            alignItems: "flex-end",
          }}
          onPress={() => navigation.replace("ForgotPassword")}
        >
          <Text style={{ color: "#2ABA7E", ...FONTS.h4, textAlign: "center" }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
        {/* login */}
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={["#73f5be", "#02f58f", "#73f5be"]}
          style={{
            backgroundColor: "#4dccc6",
            height: 60,
            borderRadius: SIZES.radius,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: windowWidth,
              alignItems: "center",
              justifyContent: "center",
              height: 60,
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
        </LinearGradient>

        {/* google */}
        <View
          style={{
            marginTop: 30,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <SocialIcon
            iconColor="#000"
            title="Google"
            button
            disabled={!googleSubmitting ? false : true}
            type="google"
            fontStyle={{ fontSize: 17 }}
            loading={!googleSubmitting ? false : true}
            onPress={() => {
              handleGoogleSignIn();
            }}
            style={{ height: 60, width: windowWidth / 1.2 }}
          />
        </View>
        {/* signup */}
        <TouchableOpacity
          style={{
            marginTop: 30,
          }}
          onPress={() => navigation.replace("SignUp")}
        >
          <Text
            style={{ color: COLORS.todoGray, ...FONTS.h4, textAlign: "center" }}
          >
            Don't have an account?
            <Text
              style={{ color: "#2ABA7E", ...FONTS.h4, textAlign: "center" }}
            >
              {" "}
              Register Here
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1, flexDirection: "column" }}
    >
      <View
        style={{ flex: 1, backgroundColor: "#36B273", flexDirection: "column" }}
      >
        <Image
          source={require("../assets/side.jpeg")}
          style={{
            position: "absolute",
            top: -50,
            left: -70,
            height: 500,
          }}
        />
        <Image
          source={require("../assets/side2.png")}
          style={{
            position: "absolute",
            top: -370,
            left: 160,
            transform: [{ rotate: "180deg" }],
          }}
        />
        {renderLogo()}
        <View
          style={{
            backgroundColor: "#F6F8F6",
            height: windowHeight,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            overflow: "hidden",
            marginTop: windowHeight / 12,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#5B5D69",
              fontSize: RFValue(26),
              marginTop: 25,
              fontWeight: "bold",
            }}
          >
            Login to your account
          </Text>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              height: windowHeight,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              overflow: "hidden",
              marginTop: windowHeight / 22,
            }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              style={{
                marginTop: -30,
                marginBottom: 100,
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                }}
              >
                <View>{renderForm()}</View>
                {renderButton()}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
