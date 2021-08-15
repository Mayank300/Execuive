import React, { useState, useEffect, useRef } from "react";
import { Icon, Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import { COLORS, FONTS, icons, SIZES } from "../constants";
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
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import db from "../firebase/config";

const EditProfileScreen = ({ navigation }) => {
  const [user_name, setUser_name] = useState("");
  const [docId, setDocID] = useState("");

  const [image, setImage] = useState("#");

  var userEmail = firebase.auth().currentUser.email;

  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user_contact, setUser_contact] = useState("");
  const [otpFormVisibility, setOtpFormVisibility] = useState(false);

  // otp Verification

  const recaptchaVerifier = useRef(null);
  const [verificationId, setVerificationId] = useState();
  const [verificationCode, setVerificationCode] = useState();
  const firebaseConfig = firebase.apps.length
    ? firebase.app().options
    : undefined;
  const attemptInvisibleVerification = false;

  const otpRef = useRef(null);

  useEffect(() => {
    getUserDetails();
    fetchImage(userEmail);
  }, []);

  useEffect(() => {
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
  }, []);

  const handleSendCode = async () => {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        `${selectedArea.callingCode}` + user_contact,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      setOtpFormVisibility(true);
      alert("Verification code has been sent to your phone.");
      otpRef.current.focus();
    } catch (err) {
      console.log(`Error: ${err.message}`);
      alert(err.message);
    }
  };

  const handleConfirmSendCode = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await firebase.auth().signInWithCredential(credential);
      updateUserDetails();
    } catch (err) {
      console.log(`Error: ${err.message}`);
      alert(err.message);
    }
  };

  const selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!cancelled) {
      uploadImage(uri, userEmail);
    }
  };

  const uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      fetchImage(imageName);
    });
  };

  const fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    storageRef
      .getDownloadURL()
      .then((url) => {
        setImage(url);
      })
      .catch((error) => {
        setImage("#");
      });
  };

  const getUserDetails = () => {
    db.collection("users")
      .where("email_id", "==", userEmail)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          setUser_name(data.user_name);
          setUser_contact(data.contact);
          setDocID(doc.id);
        });
      });
  };

  const updateUserDetails = () => {
    {
      user_name !== "" && user_contact.length === 10
        ? db
            .collection("users")
            .doc(docId)
            .update({
              user_name: user_name,
              contact: user_contact,
            })
            .then(() => {
              navigation.replace("Home");
              return Alert.alert("Profile Updated Successfully");
            })
        : alert("Please fill or recheck data");
    }
  };

  function renderForm() {
    return (
      <View style={styles.forCon}>
        {/* Full Name */}
        <View style={{ marginTop: SIZES.padding * 3 }}>
          <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Full Name</Text>
          <View style={{ position: "absolute", top: 35, left: 5 }}>
            <Icon type="feather" name="user" size={28} color={COLORS.white} />
          </View>
          <TextInput
            value={user_name}
            onChangeText={(user_name) => setUser_name(user_name)}
            style={[styles.name, { ...FONTS.body3 }]}
            placeholder="Enter Full Name"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
        </View>

        {/* Phone Number & country code */}
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
            Phone Number
          </Text>

          <View style={{ flexDirection: "row" }}>
            {/* Country Code */}
            <TouchableOpacity
              style={{
                width: 100,
                height: 50,
                marginHorizontal: 5,
                borderBottomColor: COLORS.white,
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
                    tintColor: COLORS.white,
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
                <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                  {selectedArea?.callingCode}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Phone Number */}
            <View style={{ position: "absolute", top: 10, left: 120 }}>
              <Icon
                type="feather"
                name="phone"
                size={28}
                color={COLORS.white}
              />
            </View>
            <TextInput
              value={user_contact}
              onChangeText={(user_contact) => setUser_contact(user_contact)}
              autoCompleteType="tel"
              keyboardType="phone-pad"
              style={{
                flex: 1,
                marginVertical: SIZES.padding,
                borderBottomColor: COLORS.white,
                borderBottomWidth: 1,
                height: 40,
                color: COLORS.white,
                ...FONTS.body3,
                paddingLeft: 50,
              }}
              placeholder="Phone Number"
              placeholderTextColor={COLORS.white}
              selectionColor={COLORS.white}
            />
          </View>
        </View>
      </View>
    );
  }

  function renderButton() {
    return (
      <View style={{ margin: SIZES.padding * 3 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleSendCode();
          }}
        >
          <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
            Verify Account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function otpForm() {
    return (
      <View
        style={{
          marginTop: SIZES.padding - 25,
          marginHorizontal: SIZES.padding * 3,
        }}
      >
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>OTP</Text>
          <View style={{ position: "absolute", top: 35, left: 10 }}>
            <Icon
              type="feather"
              name="message-square"
              size={28}
              color={COLORS.white}
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
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
              paddingLeft: 50,
            }}
            placeholder="Enter OTP"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
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
            onPress={() => {
              handleConfirmSendCode();
            }}
          >
            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
              Update Account
            </Text>
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

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
      />

      <View style={styles.goBack}>
        <Icon
          type="font-awesome"
          name="long-arrow-left"
          size={40}
          onPress={() => navigation.pop()}
        />
      </View>
      <View style={styles.image}>
        {image === "#" ? (
          <Avatar
            rounded
            source={require("../assets/images/edit.png")}
            size="xlarge"
            onPress={() => selectPicture()}
          />
        ) : (
          <Avatar
            rounded
            source={{
              uri: image,
            }}
            size="xlarge"
            onPress={() => selectPicture()}
          />
        )}
      </View>

      <ScrollView style={{ height: windowHeight }}>
        {renderForm()}
        {renderButton()}
        {otpFormVisibility ? otpForm() : null}
      </ScrollView>
      {renderAreaCodesModal()}
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lime,
    height: windowHeight,
  },
  goBack: {
    position: "absolute",
    top: 50,
    left: 30,
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    alignSelf: "center",
  },
  headContainer: {
    backgroundColor: COLORS.lime,
    height: 240,
    marginTop: -50,
  },
  forCon: {
    marginTop: SIZES.padding,
    marginHorizontal: SIZES.padding * 3,
  },
  name: {
    marginVertical: SIZES.padding,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    height: 40,
    color: COLORS.white,
    paddingLeft: 50,
  },
  countryCode: {
    width: 100,
    height: 50,
    marginHorizontal: 5,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  button: {
    height: 60,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius / 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  pass: {
    marginVertical: SIZES.padding,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    height: 40,
    color: COLORS.white,
    ...FONTS.body3,
    paddingLeft: 50,
  },
});
