import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Share,
} from "react-native";
import firebase from "firebase";
import db from "../firebase/config";
import { Icon, Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [area, setArea] = useState([]);
  const [image, setImage] = useState("#");
  var userEmail = firebase.auth().currentUser.email;

  useEffect(() => {
    getUserDetails();
    fetchImage(userEmail);
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Name: ${name}\nEmail ID: ${email}\nContact: ${
          area.callingCode + " " + contact
        }`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  selectPicture = async () => {
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

  uploadImage = async (uri, imageName) => {
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

  fetchImage = (imageName) => {
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

  function getUserDetails() {
    db.collection("users")
      .where("email_id", "==", userEmail)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          setName(data.user_name);
          setEmail(data.email_id);
          setContact(data.contact);
          setArea(data.selected_area);
        });
      });
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{
          uri: image,
        }}
        blurRadius={4}
        style={{
          flex: 1,
          resizeMode: "cover",
        }}
      >
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              marginTop: SIZES.padding * 5,
              height: 100,
            }}
          >
            <View
              style={{
                width: windowWidth / 1.15,
                backgroundColor: "#fff",
                borderRadius: 20,
                position: "absolute",
                top: 100,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => onShare()}
                style={{ position: "absolute", top: 20, right: 20 }}
              >
                <Icon type="feather" name="share" size={25} />
              </TouchableOpacity>
              <View
                style={{
                  marginTop: SIZES.padding * 5,
                  marginBottom: SIZES.padding,
                }}
              >
                <Text style={{ ...FONTS.h2, textAlign: "center" }}>{name}</Text>
                <Text
                  style={{
                    ...FONTS.h4,
                    textAlign: "center",
                    opacity: 0.6,
                    margin: 5,
                  }}
                >
                  {email}
                </Text>
              </View>
            </View>
            {image === "#" ? (
              <Avatar
                rounded
                source={require("../assets/images/edit.png")}
                size="xlarge"
                onPress={() => selectPicture()}
                containerStyle={{
                  flex: 0.75,
                  marginTop: 50,
                  borderRadius: 20,
                  marginBottom: -80,
                }}
              />
            ) : (
              <Avatar
                rounded
                source={{
                  uri: image,
                }}
                size="xlarge"
                onPress={() => selectPicture()}
                containerStyle={{
                  borderRadius: 100,
                  borderWidth: 3,
                  borderColor: "#fff",
                }}
              />
            )}
          </View>
          <View
            style={{
              width: windowWidth / 1.15,
              height: 330,
              backgroundColor: "#fff",
              borderRadius: 20,
              alignSelf: "center",
              flexDirection: "column",
              marginTop: 200,
              marginBottom: 60,
            }}
          >
            <TouchableOpacity
              style={{
                margin: SIZES.padding * 2,
                width: windowWidth / 1.3,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "grey",
                borderBottomWidth: 1,
              }}
              onPress={() => console.log("wallet")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <View
                  style={{
                    height: 50,
                    width: 50,
                    marginBottom: 5,
                    borderRadius: 20,
                    backgroundColor: COLORS.lightyellow,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={icons.wallet}
                    resizeMode="contain"
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: COLORS.yellow,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -1,
                      height: 21,
                      width: 21,
                      backgroundColor: COLORS.red,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#fff" }}>99</Text>
                  </View>
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    flexWrap: "wrap",
                    fontSize: RFValue(25),
                    marginLeft: 10,
                    fontWeight: "bold",
                    marginLeft: 15,
                  }}
                >
                  Wallet
                </Text>
              </View>
              <Icon name="arrow-right" type="feather" size={30} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginHorizontal: SIZES.padding * 2,
                width: windowWidth / 1.3,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "grey",
                borderBottomWidth: 1,
              }}
              onPress={() => console.log("wallet")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <View
                  style={{
                    height: 50,
                    width: 50,
                    marginBottom: 5,
                    borderRadius: 20,
                    backgroundColor: COLORS.lightGreen,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={icons.shelf}
                    resizeMode="contain"
                    style={{
                      height: 22,
                      width: 22,
                      tintColor: COLORS.green,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -1,
                      height: 21,
                      width: 21,
                      backgroundColor: COLORS.red,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#fff" }}>99</Text>
                  </View>
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    flexWrap: "wrap",
                    fontSize: RFValue(25),
                    marginLeft: 10,
                    fontWeight: "bold",
                    marginLeft: 15,
                  }}
                >
                  Shelves
                </Text>
              </View>
              <Icon name="arrow-right" type="feather" size={30} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                margin: SIZES.padding * 2,
                width: windowWidth / 1.3,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "grey",
                borderBottomWidth: 1,
              }}
              onPress={() => console.log("expiry")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <View
                  style={{
                    height: 50,
                    width: 50,
                    marginBottom: 5,
                    borderRadius: 20,
                    backgroundColor: COLORS.lightRed,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={icons.alert}
                    resizeMode="contain"
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: COLORS.red,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -1,
                      height: 21,
                      width: 21,
                      backgroundColor: COLORS.red,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#fff" }}>99</Text>
                  </View>
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    flexWrap: "wrap",
                    fontSize: RFValue(25),
                    marginLeft: 10,
                    fontWeight: "bold",
                    marginLeft: 15,
                  }}
                >
                  Expiry
                </Text>
              </View>
              <Icon name="arrow-right" type="feather" size={30} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginHorizontal: SIZES.padding * 2,
                width: windowWidth / 1.3,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              onPress={() => {
                navigation.replace("Login");
                firebase.auth().signOut();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <View
                  style={{
                    height: 50,
                    width: 50,
                    marginBottom: 5,
                    borderRadius: 20,
                    backgroundColor: COLORS.lightRed,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      marginBottom: 5,
                      borderRadius: 20,
                      backgroundColor: COLORS.lightyellow,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      type="feather"
                      name="arrow-right"
                      color="#FFC664"
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -1,
                      height: 21,
                      width: 21,
                      backgroundColor: COLORS.red,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#fff" }}>99</Text>
                  </View>
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    flexWrap: "wrap",
                    fontSize: RFValue(25),
                    marginLeft: 10,
                    fontWeight: "bold",
                    marginLeft: 15,
                  }}
                >
                  Logout
                </Text>
              </View>
              <Icon name="arrow-right" type="feather" size={30} />
            </TouchableOpacity>
          </View>
          {/* <View
            style={{
              width: windowWidth / 1.15,
              height: 150,
              backgroundColor: "#fff",
              borderRadius: 20,
              alignSelf: "center",
              flexDirection: "column",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ ...FONTS.h2, marginLeft: 20, marginTop: 20 }}>
                Total Products
              </Text>
              <Text
                style={{
                  ...FONTS.h2,
                  color: "grey",
                  marginTop: 21,
                  marginHorizontal: 20,
                }}
              >
                30
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ ...FONTS.h2, marginLeft: 20 }}>Total Cost</Text>
              <Text
                style={{ ...FONTS.h2, color: "grey", marginHorizontal: 20 }}
              >
                30,000
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ ...FONTS.h2, marginLeft: 20 }}>Expired</Text>
              <Text
                style={{ ...FONTS.h2, color: "grey", marginHorizontal: 20 }}
              >
                10
              </Text>
            </View>
          </View> */}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;
