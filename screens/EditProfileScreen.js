import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import firebase from "firebase";
import db from "../firebase/config";
import { Icon, Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { TextInput } from "react-native";
import { TouchableOpacity, ScrollView, Modal, Alert } from "react-native";

const EditProfileScreen = ({ navigation }) => {
  const [user_password, setUser_password] = React.useState("");

  const [user_name, setUser_name] = React.useState("");
  const [user_contact, setUser_contact] = React.useState("");
  const [authUserPassword, setAuthUserPassowrd] = React.useState("");
  const [docId, setDocID] = React.useState("");

  const [image, setImage] = useState("#");

  var userEmail = firebase.auth().currentUser.email;

  useEffect(() => {
    getUserDetails();
    fetchImage(userEmail);
  }, []);

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
          setAuthUserPassowrd(data.password);
          setDocID(doc.id);
        });
      });
  };

  const updateUserDetails = () => {
    db.collection("users")
      .doc(docId)
      .update({
        user_name: user_name,
        contact: user_contact,
      })
      .then(() => {
        navigation.replace("Home");
        return Alert.alert("Profile Updated Successfully");
      });
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

        {/* Phone Number */}
        <View style={{ marginTop: SIZES.padding * 2 }}>
          <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
            Phone Number
          </Text>

          <View style={{ flexDirection: "row" }}>
            {/* Phone Number */}
            <View style={{ position: "absolute", top: 17, left: 10 }}>
              <Icon
                type="feather"
                name="phone"
                size={25}
                color={COLORS.white}
              />
            </View>
            <TextInput
              value={user_contact}
              onChangeText={(user_contact) => setUser_contact(user_contact)}
              keyboardType={"numeric"}
              style={[styles.name, { ...FONTS.body3, flex: 1 }]}
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
            updateUserDetails();
          }}
        >
          <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
            Update Profile
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
      </ScrollView>
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
