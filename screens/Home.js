import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
} from "react-native";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import { Icon, Avatar } from "react-native-elements";
import firebase from "firebase";
import db from "../firebase/config";
import * as ImagePicker from "expo-image-picker";
import ExpiryProduct from "./ExpiryProduct";
import { DrawerActions } from "@react-navigation/native";
import moment from "moment";
import { ActivityIndicator } from "react-native";
import { windowHeight, windowWidth } from "../constants/Dimensions";
// import { useIsFocused } from "@react-navigation/native";

import ToastAnimation from "../components/ToastAnimation";

const Home = ({ navigation }) => {
  const [name, setName] = React.useState("");
  const [image, setImage] = React.useState("#");
  const [docId, setDocId] = React.useState("");
  const [allNotifications, setAllNotifications] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [messages, setMessages] = React.useState([]);

  // const isFocused = useIsFocused();

  useEffect(() => {
    getUserDetails();
    getNotifications();
    var email = firebase.auth().currentUser.email;
    fetchImage(email);
  }, []);

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

  const getNotifications = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("notifications")
      .where("notification_status", "==", "unread")
      .where("user_id", "==", email)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          allNotifications.push(notification);
        });
        setAllNotifications(allNotifications);
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
          <Text style={{ ...FONTS.h1 }}>Welcome!</Text>
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
            onPress={() => {
              navigation.navigate("Notification");
            }}
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
              <Text style={{ fontSize: 10, color: "#fff" }}>
                {allNotifications.length}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ marginLeft: 20 }}>
            {image === "#" ? (
              <Avatar
                rounded
                source={require("../assets/images/edit.png")}
                size="medium"
                onPress={() => {
                  const message = "Change profile pic in settings";
                  setMessages([...messages, message]);
                }}
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
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
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
            onPress={() => navigation.navigate("Bill")}
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
              Bill
            </Text>
          </TouchableOpacity>
          {/* MyActivities */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("MyActivities");
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
              <Icon type="feather" name="activity" color="#66D59A" size={30} />
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Activities
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
        <View>
          {/* Expired */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("ExpiryProductScreen")}
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
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Expired
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalSubContainer}>
              <Image
                source={{
                  uri: image,
                }}
                style={styles.image}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <ExpiryProduct
        renderHeader={renderHeader()}
        renderFeatures={renderFeatures()}
      />
      <View
        style={{
          position: "absolute",
          top: 45,
          left: 0,
          right: 0,
        }}
      >
        {messages.map((message) => (
          <ToastAnimation
            key={message}
            message={message}
            onHide={() => {
              setMessages((messages) =>
                messages.filter((currentMessage) => currentMessage !== message)
              );
            }}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: windowHeight,
    width: windowWidth,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  subContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: SIZES.radius,
  },
});
