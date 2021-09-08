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
  const [showVerificationModal, setShowVerificationModal] =
    React.useState(false);
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
          navigation.replace("GoogleSignInForm", {
            user_name: name,
            email_id: email,
            photo_url: photoUrl,
            google_login: true,
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
          <Text style={{ color: "#5B5D69", ...FONTS.body3 }}>Email</Text>
          <View style={{ position: "absolute", top: 40, left: 5 }}>
            <Icon type="feather" name="mail" size={28} color={"#1BB273"} />
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
              color: "#1BB273",
              ...FONTS.body3,
              paddingLeft: 50,
            }}
            placeholder="Enter Email ID"
            placeholderTextColor={"#1BB273"}
            selectionColor={"#1BB273"}
          />
        </View>

        {/* Password */}
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: "#5B5D69", ...FONTS.body3 }}>Password</Text>
          {showPassword ? (
            <View style={{ position: "absolute", top: 37, left: 5 }}>
              <Icon type="feather" name="unlock" size={28} color={"#1BB273"} />
            </View>
          ) : (
            <View style={{ position: "absolute", top: 37, left: 5 }}>
              <Icon type="feather" name="lock" size={28} color={"#1BB273"} />
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
              color: "#1BB273",
              ...FONTS.body3,
              paddingLeft: 50,
            }}
            placeholder="Enter Password"
            placeholderTextColor={"#1BB273"}
            selectionColor={"#1BB273"}
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
            marginBottom: 30,
          }}
          onPress={() => navigation.replace("ForgotPassword")}
        >
          <Text style={{ color: "#2ABA7E", ...FONTS.h4, textAlign: "center" }}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: "#1BB273",
            borderRadius: SIZES.radius,
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={showLoading ? true : false}
          onPress={() => {
            // login(user_email, user_password);
            setShowVerificationModal(true);
          }}
        >
          {showLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Login</Text>
          )}
        </TouchableOpacity>

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
            style={{ height: 50, width: windowWidth / 1.2 }}
          />
        </View>

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

  function renderVerificationModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showVerificationModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: windowHeight,
            width: windowWidth,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View
            style={{
              height: windowHeight / 1.6,
              width: SIZES.width * 0.8,
              backgroundColor: COLORS.white,
              borderRadius: SIZES.radius,
              justifyContent: "center",
              borderRadius: 40,
            }}
          >
            <ImageBackground
              source={require("../assets/verification.jpeg")}
              style={{
                flex: 1,
                resizeMode: "cover",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 40,
                overflow: "hidden",
              }}
            >
              <Icon
                type="feather"
                name="x"
                size={25}
                style={{ marginLeft: 230, marginTop: 0 }}
                onPress={() => setShowVerificationModal(false)}
              />
              <Image
                source={require("../assets/mail.png")}
                style={{ width: 100, height: 100, marginBottom: 50 }}
              />
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.h1,
                  textAlign: "center",
                }}
              >
                Thank you for registering!
              </Text>
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.h4,
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                We're glad you are here!
              </Text>
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.h4,
                  textAlign: "center",
                }}
              >
                Before you start exploring, we
              </Text>
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.h4,
                  textAlign: "center",
                }}
              >
                just sent you the email
              </Text>
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.h4,
                  textAlign: "center",
                  marginBottom: 50,
                }}
              >
                confirmation
              </Text>
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
                  setShowVerificationModal(true);
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: RFValue(15),
                    marginHorizontal: 20,
                  }}
                >
                  Resend email conformation
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
      </Modal>
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
            widht: 30,
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
            <ScrollView>
              <View
                style={{
                  justifyContent: "space-between",
                }}
              >
                <View>{renderForm()}</View>
                {renderButton()}
              </View>
            </ScrollView>
            {renderVerificationModal()}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
