import React from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "firebase";
import db from "../firebase/config";

import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import { StatusBar } from "react-native";

import { Icon } from "react-native-elements/dist/icons/Icon";
const SignUp = ({ navigation }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [areas, setAreas] = React.useState([]);
  const [selectedArea, setSelectedArea] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [user_name, setUser_name] = React.useState("");
  const [user_email, setUser_email] = React.useState("");
  const [user_contact, setUser_contact] = React.useState("");
  const [user_password, setUser_password] = React.useState("");

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
  }, []);

  const signUpMethod = (emailId, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(emailId, password)
      .then(() => {
        firebase
          .auth()
          .currentUser.sendEmailVerification()
          .then(() => {
            return Alert.alert("Check Email And Verify It To Login");
          });
        db.collection("users").add({
          user_name: user_name,
          email_id: user_email,
          contact: user_contact,
          selected_area: selectedArea,
        });

        navigation.replace("Login");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      });
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
          Login In
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
        {/* Full Name */}
        <View style={{ marginTop: SIZES.padding * 3 }}>
          <Text style={{ color: COLORS.lightGreen, ...FONTS.body3 }}>
            Full Name
          </Text>
          <View style={{ position: "absolute", top: 40, left: 5 }}>
            <Icon type="feather" name="user" size={28} color={COLORS.white} />
          </View>
          <TextInput
            value={user_name}
            onChangeText={(user_name) => setUser_name(user_name)}
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
              paddingLeft: 50,
            }}
            placeholder="Enter Full Name"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
          />
        </View>

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

        {/* Phone Number */}
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
              keyboardType={"numeric"}
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
          onPress={() => {
            signUpMethod(user_email, user_password);
          }}
        >
          <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
            Create Account
          </Text>
        </TouchableOpacity>
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
      {renderAreaCodesModal()}
    </KeyboardAvoidingView>
  );
};

export default SignUp;
