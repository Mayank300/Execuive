import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { COLORS, FONTS, SIZES, icons, images } from "../constants";
import { BarCodeScanner } from "expo-barcode-scanner";
import { RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import moment from "moment";
import { CalendarList } from "react-native-calendars";
import firebase from "firebase";
import db from "../firebase/config";
const Tab = createMaterialTopTabNavigator();
import ToastAnimation from "../components/ToastAnimation";

const ScanProduct = ({ navigation }) => {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [data, setData] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [messages, setMessages] = useState([]);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const message = "Bar code scanned successfully !";
    setMessages([...messages, message]);
    setData(data);
  };

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: SIZES.padding * 4,
          paddingHorizontal: SIZES.padding * 3,
        }}
      >
        <TouchableOpacity
          style={{
            width: 45,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={icons.close}
            style={{
              height: 20,
              width: 20,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
            {scanned ? "Scanned" : "Scan Product"}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            height: 45,
            width: 45,
            backgroundColor: COLORS.green,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            const message = `${scanned ? "Scanned" : "Scan Product"}`;
            setMessages([...messages, message]);
          }}
        >
          <Image
            source={icons.info}
            style={{
              height: 25,
              width: 25,
              tintColor: COLORS.white,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderScanFocus() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={images.focus}
          resizeMode="stretch"
          style={{
            marginTop: "-55%",
            width: 200,
            height: 300,
          }}
        />
      </View>
    );
  }

  function detailsTab() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: windowHeight / 3.3,
          padding: SIZES.padding * 3,
          borderTopLeftRadius: SIZES.radius,
          borderTopRightRadius: SIZES.radius,
          backgroundColor: COLORS.white,
        }}
      >
        <Text style={{ ...FONTS.h4 }}>Details</Text>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: SIZES.padding * 2,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => setScanned(false)}
          >
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: COLORS.lightpurple,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Image
                source={icons.phone}
                resizeMode="cover"
                style={{
                  height: 25,
                  width: 25,
                  tintColor: COLORS.purple,
                }}
              />
            </View>
            <Text style={{ marginLeft: SIZES.padding, ...FONTS.body4 }}>
              {scanned ? "Scan Again" : "Scan Product"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: SIZES.padding * 2,
            }}
            disabled={scanned === false ? true : false}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: COLORS.lightGreen,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Image
                source={icons.send}
                resizeMode="cover"
                style={{
                  height: 25,
                  width: 25,
                  tintColor: COLORS.primary,
                }}
              />
            </View>
            <Text
              style={{
                marginLeft: SIZES.padding,
                ...FONTS.body4,
              }}
            >
              View
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.transparent,
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        style={{
          position: "absolute",
          top: 25,
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
      {renderHeader()}
      {renderScanFocus()}
      {detailsTab()}
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
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("GoogleSearch", { data: data });
                    setModalVisible(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 20,
                    marginTop: 30,
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={require("../assets/images/google.png")}
                    style={{ width: 70, height: 70 }}
                  />
                  <Text
                    style={{
                      color: "#000",
                      fontSize: RFValue(25),
                      fontWeight: "bold",
                      marginLeft: -10,
                    }}
                  >
                    Google
                  </Text>
                  <Icon
                    type="feather"
                    name="arrow-right"
                    size={30}
                    color="#000"
                    style={{ marginRight: 0 }}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("AmazonSearch", { data: data });
                    setModalVisible(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 20,
                    marginTop: 20,
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={require("../assets/images/amazon.jpg")}
                    style={{ width: 70, height: 70, borderRadius: 50 }}
                  />
                  <Text
                    style={{
                      color: "#000",
                      fontSize: RFValue(25),
                      fontWeight: "bold",
                    }}
                  >
                    Amazon
                  </Text>
                  <Icon
                    type="feather"
                    name="arrow-right"
                    size={30}
                    color="#000"
                    style={{ marginRight: 0 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const AddProduct = () => {
  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const [quantity, setQuantity] = React.useState("");
  const [totalCost, setTotalCost] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [color, setColor] = React.useState(
    Math.floor(Math.random() * Math.floor(256)) +
      "," +
      Math.floor(Math.random() * Math.floor(256)) +
      "," +
      Math.floor(Math.random() * Math.floor(256))
  );
  const [currentDay, setCurrentDay] = React.useState(
    `${moment().format("YYYY")}-${moment().format("MM")}-${moment().format(
      "DD"
    )}`
  );
  const [selectedDay, setSelectedDay] = React.useState({
    [`${moment().format("YYYY")}-${moment().format("MM")}-${moment().format(
      "DD"
    )}`]: {
      selected: true,
      selectedColor: "#2E66E7",
    },
  });
  // animated toast
  const [messages, setMessages] = useState([]);
  // ref
  const nameRef = useRef();
  const quantityRef = useRef();
  const costRef = useRef();

  const addProduct = () => {
    var userId = firebase.auth().currentUser.email;
    var randomNum = Math.random().toString(36).substring(7);
    var dateAdded = moment().format("YYYY-MM-DD");
    db.collection("products").add({
      product_name: productName,
      quantity: quantity,
      total_cost: totalCost,
      exp_date: currentDay,
      product_id: randomNum,
      user_id: userId,
      product_color: color,
      date_added: dateAdded,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    db.collection("notifications").add({
      id: Math.random().toString(36).substring(7),
      exp_date: currentDay,
      color: color,
      user_id: userId,
      product_name: productName,
      notification_title: "Product Added Successfully",
      notification_status: "unread",
      date_added: dateAdded,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    db.collection("activities").add({
      id: Math.random().toString(36).substring(7),
      exp_date: currentDay,
      product_color: color,
      user_id: userId,
      product_name: productName,
      title: `was added on ${dateAdded}`,
      date_added: dateAdded,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    const message = "Product Added Successfully";
    setMessages([...messages, message]);
    setQuantity("");
    setTotalCost("");
    setProductName("");
    setColor(
      Math.floor(Math.random() * Math.floor(256)) +
        "," +
        Math.floor(Math.random() * Math.floor(256)) +
        "," +
        Math.floor(Math.random() * Math.floor(256))
    );
    setCurrentDay(
      `${moment().format("YYYY")}-${moment().format("MM")}-${moment().format(
        "DD"
      )}`
    );
  };

  const daySelector = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.8)",
            }}
          >
            <View
              style={{
                height: 350,
                width: SIZES.width,
              }}
            >
              <CalendarList
                style={{
                  width: SIZES.width,
                  height: 350,
                }}
                current={currentDay}
                minDate={moment().format()}
                horizontal
                pastScrollRange={0}
                pagingEnabled
                calendarWidth={windowWidth}
                onDayPress={(day) => {
                  setSelectedDay({
                    [day.dateString]: {
                      selected: true,
                      selectedColor: "#2E66E7",
                    },
                  });
                  setCurrentDay(day.dateString);
                }}
                monthFormat="MMMM yyyy"
                hideArrows
                markingType="dot"
                theme={{
                  selectedDayBackgroundColor: "#2E66E7",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#2E66E7",
                  backgroundColor: "#eaeef7",
                  calendarBackground: "#eaeef7",
                  textDisabledColor: "gray",
                }}
                markedDates={selectedDay}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const form = () => {
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
              {
                productName !== "" && quantity !== "" && totalCost !== ""
                  ? addProduct()
                  : alert("fill the appropriate details!");
              }
            }}
          >
            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
              Add Product
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View
        style={{
          backgroundColor: COLORS.lightgray,
          height: windowHeight,
          width: windowWidth,
        }}
      >
        {/* name */}
        <View
          style={{
            marginTop: SIZES.padding * 3,
            marginHorizontal: SIZES.padding * 3,
          }}
        >
          <View style={{ marginTop: SIZES.padding * 3 }}>
            <Text style={{ color: COLORS.black, ...FONTS.body3 }}>
              Product Name
            </Text>
            <View style={{ position: "absolute", top: 40, left: 5 }}>
              <Icon
                type="feather"
                name="package"
                size={28}
                color={COLORS.black}
              />
            </View>
            <TextInput
              returnKeyType="next"
              onSubmitEditing={() => {
                quantityRef.current.focus();
              }}
              blurOnSubmit={false}
              ref={nameRef}
              value={productName}
              onChangeText={(text) => setProductName(text)}
              style={styles.textInput}
              placeholder="Enter Product Name"
              placeholderTextColor={COLORS.black}
              selectionColor={COLORS.black}
            />
          </View>
        </View>

        {/* quantity */}
        <View
          style={{
            marginTop: SIZES.padding - 20,
            marginHorizontal: SIZES.padding * 3,
          }}
        >
          <View style={{ marginTop: SIZES.padding * 3 }}>
            <Text style={{ color: COLORS.black, ...FONTS.body3 }}>
              Product Quantity
            </Text>
            <View style={{ position: "absolute", top: 40, left: 5 }}>
              <Icon
                type="font-awesome"
                name="balance-scale"
                size={23}
                color={COLORS.black}
              />
            </View>
            <TextInput
              returnKeyType="next"
              onSubmitEditing={() => {
                costRef.current.focus();
              }}
              blurOnSubmit={false}
              ref={quantityRef}
              value={quantity}
              onChangeText={(text) => setQuantity(text)}
              keyboardType={"numeric"}
              style={styles.textInput}
              placeholder="Enter Product Quantity"
              placeholderTextColor={COLORS.black}
              selectionColor={COLORS.black}
            />
          </View>
        </View>

        {/* cost */}
        <View
          style={{
            marginTop: SIZES.padding - 20,
            marginHorizontal: SIZES.padding * 3,
          }}
        >
          <View style={{ marginTop: SIZES.padding * 3 }}>
            <Text style={{ color: COLORS.black, ...FONTS.body3 }}>
              Total Cost
            </Text>
            <View style={{ position: "absolute", top: 40, left: 5 }}>
              <Icon
                type="feather"
                name="credit-card"
                size={28}
                color={COLORS.black}
              />
            </View>
            <TextInput
              ref={costRef}
              value={totalCost}
              onChangeText={(text) => setTotalCost(text)}
              keyboardType={"numeric"}
              style={styles.textInput}
              placeholder="Enter Total Cost"
              placeholderTextColor={COLORS.black}
              selectionColor={COLORS.black}
            />
          </View>
        </View>

        {/* expiry day */}
        <View
          style={{
            marginTop: SIZES.padding - 20,
            marginHorizontal: SIZES.padding * 3,
          }}
        >
          <View style={{ marginTop: SIZES.padding * 3 }}>
            <Text style={{ color: COLORS.black, ...FONTS.body3 }}>
              Expiry Date
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Icon
                type="feather"
                name="alert-circle"
                size={28}
                color={COLORS.black}
                style={{ marginLeft: 5, marginRight: 20 }}
              />
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={{ fontSize: RFValue(22), fontWeight: "bold" }}>
                  {currentDay}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>{renderButton()}</View>
      </View>
    );
  };

  return (
    <View>
      <View
        style={{
          position: "absolute",
          top: 25,
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
      {modalVisible ? daySelector() : null}
      <ScrollView>{form()}</ScrollView>
    </View>
  );
};

function AddScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Add"
      tabBarOptions={{
        activeTintColor: "#000",
        labelStyle: { fontSize: RFValue(18) },
      }}
      style={Platform.OS === "ios" ? { marginTop: 30 } : null}
    >
      <Tab.Screen
        name="Add"
        component={AddProduct}
        options={{ tabBarLabel: "Add Product" }}
      />
      <Tab.Screen
        name="Notifications"
        component={ScanProduct}
        options={{ tabBarLabel: "Scan Product" }}
      />
    </Tab.Navigator>
  );
}

export default AddScreen;

const styles = StyleSheet.create({
  textInput: {
    marginVertical: SIZES.padding,
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    height: 40,
    color: COLORS.black,
    ...FONTS.body3,
    paddingLeft: 50,
  },
});
