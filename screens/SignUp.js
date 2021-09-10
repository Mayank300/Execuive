import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
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
  ActivityIndicator,
  Alert,
  StatusBar,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as firebase from "firebase";
import db from "../firebase/config";
import { Icon } from "react-native-elements";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import { windowHeight } from "../constants/Dimensions";
import * as Google from "expo-google-app-auth";
import { SocialIcon } from "react-native-elements";
import { windowWidth } from "../components/Dimensions";
import { RFValue } from "react-native-responsive-fontsize";

const SignUp = ({ navigation }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [areas, setAreas] = React.useState([]);
  const [selectedArea, setSelectedArea] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [user_name, setUser_name] = React.useState("");
  const [user_email, setUser_email] = React.useState("");
  const [user_contact, setUser_contact] = React.useState("");
  const [user_password, setUser_password] = React.useState("");
  const [otpFormVisibility, setOtpFormVisibility] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const [showOTPLoading, setShowOTPLoading] = React.useState(false);
  const [showVerificationModal, setShowVerificationModal] =
    React.useState(false);
  // otp Verification

  const recaptchaVerifier = React.useRef(null);
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const firebaseConfig = firebase.apps.length
    ? firebase.app().options
    : undefined;
  const attemptInvisibleVerification = false;

  //  refs

  const nameRef = useRef(null);
  const mailRef = useRef(null);
  const numberRef = useRef(null);
  const passwordRef = useRef(null);
  const otpRef = useRef(null);

  React.useEffect(() => {
    fetch("https://restcountries.eu/rest/v2/all")
      .then((response) => response.json())
      .then((data) => {
        let areaData = data.map((item) => {
          return {
            code: item.alpha2Code,
            name: item.name,
            callingCode: `+${item.callingCodes[0]}`,
            flag: `https://www.countryflags.io/${item.alpha2Code}/flat/64.png`,
          };
        });

        setAreas(areaData);

        if (areaData.length > 0) {
          let defaultData = areaData.filter((a) => a.code == "IN");

          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
          }
        }
      });
    nameRef.current.focus();
  }, []);

  const signUpMethod = (emailId, password) => {
    {
      user_name !== "" && user_contact.length === 10
        ? firebase
            .auth()
            .createUserWithEmailAndPassword(emailId, password)
            .then(() => {
              firebase
                .auth()
                .currentUser.sendEmailVerification()
                .then(() => {
                  Alert.alert("Check Email And Verify It To Login");
                });
              db.collection("users").add({
                user_name: user_name,
                email_id: user_email,
                contact: user_contact,
                selected_area: selectedArea,
                google_login: false,
              });
              setUser_email(emailId);
              setShowVerificationModal(true);
              // navigation.replace("Login");
            })
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              return Alert.alert(errorMessage);
            })
        : alert("Please enter name or check phone number");
    }
  };

  const handleSendCode = async () => {
    setShowLoading(true);
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        `${selectedArea.callingCode}` + user_contact,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      setOtpFormVisibility(true);

      alert("Verification code has been sent to your phone.");
      setShowLoading(false);
      otpRef.current.focus();
    } catch (err) {
      console.log(`Error: ${err.message}`);
      alert(err.message);
      setShowLoading(false);
    }
  };

  const handleConfirmSendCode = async () => {
    setShowOTPLoading(true);
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await firebase.auth().signInWithCredential(credential);
      signUpMethod(user_email, user_password);
      setShowOTPLoading(false);
    } catch (err) {
      console.log(`Error: ${err.message}`);
      alert(err.message);
      setShowOTPLoading(false);
    }
  };

  function renderForm() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          marginHorizontal: SIZES.padding * 3,
        }}
      >
        {/* Name */}
        <View style={{ marginTop: SIZES.padding * 3 }}>
          <Text style={{ color: "#1BB273", ...FONTS.body3 }}>Full Name</Text>
          <View style={{ position: "absolute", top: 40, left: 5 }}>
            <Icon type="feather" name="user" size={28} color={"#5B5D69"} />
          </View>
          <TextInput
            returnKeyType="next"
            onSubmitEditing={() => {
              mailRef.current.focus();
            }}
            blurOnSubmit={false}
            ref={nameRef}
            value={user_name}
            onChangeText={(user_name) => setUser_name(user_name)}
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: "#1BB273",
              borderBottomWidth: 1,
              height: 40,
              color: "#5B5D69",
              ...FONTS.body3,
              paddingLeft: 50,
            }}
            placeholder="Enter Full Name"
            placeholderTextColor={"#5B5D69"}
            selectionColor={"#5B5D69"}
          />
        </View>

        {/* mail Name */}
        <View style={{ marginTop: SIZES.padding * 3 }}>
          <Text style={{ color: "#1BB273", ...FONTS.body3 }}>Email</Text>
          <View style={{ position: "absolute", top: 40, left: 5 }}>
            <Icon type="feather" name="mail" size={28} color={"#5B5D69"} />
          </View>
          <TextInput
            returnKeyType="next"
            onSubmitEditing={() => {
              numberRef.current.focus();
            }}
            blurOnSubmit={false}
            ref={mailRef}
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

        {/* Phone Number & country code */}
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: "#1BB273", ...FONTS.body3 }}>Phone Number</Text>

          <View style={{ flexDirection: "row" }}>
            {/* Country Code */}
            <TouchableOpacity
              style={{
                width: 100,
                height: 50,
                marginHorizontal: 5,
                borderBottomColor: "#1BB273",
                borderBottomWidth: 1,
                flexDirection: "row",
                ...FONTS.body2,
              }}
              onPress={() => setModalVisible(true)}
            >
              <View style={{ justifyContent: "center" }}>
                <Image
                  source={icons.down}
                  style={{
                    width: 10,
                    height: 10,
                    tintColor: "#1BB273",
                  }}
                />
              </View>
              <View style={{ justifyContent: "center", marginLeft: 5 }}>
                <Image
                  source={{ uri: selectedArea?.flag }}
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              </View>

              <View style={{ justifyContent: "center", marginLeft: 5 }}>
                <Text style={{ color: "#5B5D69", ...FONTS.body3 }}>
                  {selectedArea?.callingCode}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Phone Number */}
            <View style={{ position: "absolute", top: 10, left: 120 }}>
              <Icon type="feather" name="phone" size={28} color={"#5B5D69"} />
            </View>
            <TextInput
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordRef.current.focus();
              }}
              blurOnSubmit={false}
              ref={numberRef}
              value={user_contact}
              onChangeText={(user_contact) => setUser_contact(user_contact)}
              autoCompleteType="tel"
              keyboardType="phone-pad"
              style={{
                flex: 1,
                marginVertical: SIZES.padding,
                borderBottomColor: "#1BB273",
                borderBottomWidth: 1,
                height: 40,
                color: "#5B5D69",
                ...FONTS.body3,
                paddingLeft: 50,
              }}
              placeholder="Phone Number"
              placeholderTextColor={"#5B5D69"}
              selectionColor={"#5B5D69"}
            />
          </View>
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

  function otpForm() {
    return (
      <View
        style={{
          marginTop: SIZES.padding - 25,
          marginHorizontal: SIZES.padding * 3,
          marginBottom: 200,
        }}
      >
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: "#1BB273", ...FONTS.body3 }}>OTP</Text>
          <View style={{ position: "absolute", top: 35, left: 10 }}>
            <Icon
              type="feather"
              name="message-square"
              size={28}
              color={"#5B5D69"}
            />
          </View>
          <TextInput
            ref={otpRef}
            value={verificationCode}
            onChangeText={(otp) => setVerificationCode(otp)}
            keyboardType={"numeric"}
            editable={!!verificationId}
            style={{
              flex: 1,
              marginVertical: SIZES.padding,
              borderBottomColor: "#1BB273",
              borderBottomWidth: 1,
              height: 40,
              color: "#5B5D69",
              ...FONTS.body3,
              paddingLeft: 50,
            }}
            placeholder="Enter OTP"
            placeholderTextColor={"#5B5D69"}
            selectionColor={"#5B5D69"}
          />
        </View>

        <View style={{ marginBottom: 50, marginTop: SIZES.padding * 3 }}>
          <TouchableOpacity
            style={{
              height: 60,
              backgroundColor: COLORS.black,
              borderRadius: SIZES.radius / 1.5,
              alignItems: "center",
              justifyContent: "center",
            }}
            disabled={showOTPLoading ? true : false}
            onPress={() => {
              handleConfirmSendCode();
            }}
          >
            {showOTPLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderButton() {
    return (
      <View>
        <View
          style={{
            margin: SIZES.padding * 3,
            height: !otpFormVisibility ? 300 : 80,
            marginBottom: !otpFormVisibility ? 150 : 0,
          }}
        >
          <TouchableOpacity
            style={{
              height: 60,
              backgroundColor: COLORS.black,
              borderRadius: SIZES.radius / 1.5,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              if (user_contact !== "") {
                handleSendCode();
              } else {
                return Alert.alert("Check Phone Number");
              }
            }}
            disabled={showLoading ? true : false}
          >
            {showLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                Verify Account
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderAreaCodesModal() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{ padding: SIZES.padding, flexDirection: "row" }}
          onPress={() => {
            setSelectedArea(item);
            setModalVisible(false);
          }}
        >
          <Image
            source={{ uri: item.flag }}
            style={{
              width: 30,
              height: 30,
              marginRight: 10,
            }}
          />
          <Text style={{ ...FONTS.body4 }}>{item.name}</Text>
        </TouchableOpacity>
      );
    };

    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                height: 400,
                width: SIZES.width * 0.8,
                backgroundColor: COLORS.lightGreen,
                borderRadius: SIZES.radius,
              }}
            >
              <FlatList
                data={areas}
                renderItem={renderItem}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={false}
                style={{
                  padding: SIZES.padding * 2,
                  marginBottom: SIZES.padding * 2,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
                  firebase
                    .auth()
                    .currentUser.sendEmailVerification()
                    .then(() => {
                      Alert.alert("Check Email And Verify It To Login");
                    });
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
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
      />
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
        <View
          style={Platform.OS === "ios" ? { marginTop: 70 } : { marginTop: 40 }}
        >
          <TouchableOpacity
            style={{
              marginLeft: 30,
              marginTop: 0,
              marginBottom: 30,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.replace("Login")}
          >
            <Icon
              type="feather"
              name="arrow-left"
              size={35}
              color={"#5B5D69"}
            />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 30,
                fontWeight: "700",
                width: windowWidth / 1.5,
                marginLeft: 5,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#F6F8F6",
            height: windowHeight,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            overflow: "hidden",
            marginTop: windowHeight / 25,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#5B5D69",
              fontSize: RFValue(27),
              marginTop: 25,
              fontWeight: "bold",
            }}
          >
            Make your account for free!
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
              {otpFormVisibility ? otpForm() : null}
            </ScrollView>
          </View>
        </View>
      </View>
      {renderAreaCodesModal()}
      {renderVerificationModal()}
    </KeyboardAvoidingView>
  );
};

export default SignUp;
