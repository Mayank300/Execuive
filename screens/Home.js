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
import HomeComponent from "./HomeComponent";
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
  const [sold, setSold] = React.useState([]);
  const [activity, setActivity] = React.useState([]);
  const [expiredProductList, setExpiredProductList] = React.useState([]);

  // const isFocused = useIsFocused();

  useEffect(() => {
    const MINUTE_MS = 5000;
    getUserDetails();
    getNotifications();
    getSoldProducts();
    getProductList();
    getAllActivities();
    fetchImage(email);
    var email = firebase.auth().currentUser.email;
    const interval = setInterval(() => {
      fetchImage(email);
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  const getProductList = () => {
    var email = firebase.auth().currentUser.email;
    var DATA = [];
    var expiredProducts = [];

    db.collection("products")
      .where("user_id", "==", email)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        DATA.forEach((product) => {
          var expDateString = product.exp_date;
          if (moment(expDateString).isBefore(moment(), "day")) {
            expiredProducts.push(product);
          }
        });
        setExpiredProductList(expiredProducts);
      });
  };

  const getSoldProducts = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("sold")
      .where("user_id", "==", email)
      .onSnapshot((snapshot) => {
        var soldNumber = [];
        snapshot.docs.map((doc) => {
          var sold = doc.data();
          soldNumber.push(sold);
        });
        setSold(soldNumber);
      });
  };

  const getAllActivities = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("activities")
      .where("user_id", "==", email)
      .onSnapshot((snapshot) => {
        var activityNumber = [];
        snapshot.docs.map((doc) => {
          var sold = doc.data();
          activityNumber.push(sold);
        });
        setActivity(activityNumber);
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
          {/* Expired */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("ExpiredProductScreen")}
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
                name="alert-triangle"
                color="#FF4134"
                size={26}
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
                <Text style={{ fontSize: 10, color: "#fff" }}>
                  {expiredProductList.length}
                </Text>
              </View>
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Expired
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
                backgroundColor: COLORS.lightGreen,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                type="feather"
                name="bar-chart-2"
                color="#00BA63"
                style={{
                  height: 20,
                  width: 20,
                }}
              />
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Graph
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* Sellers */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("SellerScreen")}
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
              <Icon type="feather" name="users" color="#00BA63" size={26} />
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Sellers
            </Text>
          </TouchableOpacity>
          {/* Todo */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("TodoScreen")}
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
              <Icon type="feather" name="edit" color="#FFC664" size={26} />
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Todo
            </Text>
          </TouchableOpacity>
          {/* Sold */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("SoldScreen")}
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
              <Icon
                type="feather"
                name="trending-up"
                color="#6B3CE9"
                size={26}
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
                <Text style={{ fontSize: 10, color: "#fff" }}>
                  {sold.length}
                </Text>
              </View>
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Sold
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
      <HomeComponent
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
