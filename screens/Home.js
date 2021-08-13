import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import { Icon, Avatar } from "react-native-elements";
import firebase from "firebase";
import db from "../firebase/config";
import * as ImagePicker from "expo-image-picker";
import ExpiryProduct from "./ExpiryProduct";
import { DrawerActions } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const [name, setName] = React.useState("");
  const [image, setImage] = React.useState("#");
  const [docId, setDocId] = React.useState("");

  useEffect(() => {
    getUserDetails();
    var email = firebase.auth().currentUser.email;
    fetchImage(email);
  }, []);

  const selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    var user_Id = firebase.auth().currentUser.email;
    if (!cancelled) {
      uploadImage(uri, user_Id);
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
    var email = firebase.auth().currentUser.email;
    db.collection("users")
      .where("email_id", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          setName(data.user_name);
          setDocId(doc.id);
        });
      });
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginVertical: SIZES.padding * 3,
        }}
      >
        <StatusBar hidden />
        <View style={{ flex: 1 }}>
          <Text style={{ ...FONTS.h1 }}>Hello!</Text>
          <Text style={{ ...FONTS.body2, color: COLORS.gray, marginLeft: 12 }}>
            {name === "" ? "Loading..." : <Text>{name}</Text>}
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => {}}
            style={{
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon type="feather" name="bell" size={30} />
            <View
              style={{
                position: "absolute",
                top: -1,
                right: 1,
                height: 18,
                width: 18,
                backgroundColor: COLORS.red,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 10, color: "#fff" }}>99</Text>
            </View>
          </TouchableOpacity>
          <View style={{ marginLeft: 20 }}>
            {image === "#" ? (
              <Avatar
                rounded
                source={require("../assets/images/edit.png")}
                size="medium"
                onPress={() => selectPicture()}
                containerStyle={{
                  imageContainer: {
                    flex: 0.75,
                    marginTop: 50,
                    borderRadius: 20,
                    marginBottom: -80,
                  },
                }}
              />
            ) : (
              <Avatar
                rounded
                source={{
                  uri: image,
                }}
                size="medium"
                onPress={() => selectPicture()}
                containerStyle={{
                  imageContainer: {
                    flex: 0.75,
                    marginTop: 50,
                    borderRadius: 20,
                    marginBottom: -80,
                  },
                }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderFeatures = () => {
    return (
      <View style={{ flexDirection: "column" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* AddScreen */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("AddScreen")}
          >
            <View
              style={{
                height: 50,
                width: 50,
                marginBottom: 5,
                borderRadius: 20,
                backgroundColor: COLORS.lightpurple,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon type="feather" name="plus" color="#6B3CE9" size={30} />
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Add
            </Text>
          </TouchableOpacity>
          {/* wallet */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => console.log("wallet")}
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
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Wallet
            </Text>
          </TouchableOpacity>
          {/* shelf */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => console.log("shelf")}
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
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Shelves
            </Text>
          </TouchableOpacity>
          {/* graph */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("Graph")}
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
              <Icon
                type="feather"
                name="bar-chart-2"
                color="#FF4134"
                style={{
                  height: 20,
                  width: 20,
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
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Graph
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ExpiryProduct
        renderHeader={renderHeader()}
        renderFeatures={renderFeatures()}
      />
    </SafeAreaView>
  );
};

export default Home;
