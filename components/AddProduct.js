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
import { COLORS, FONTS, SIZES } from "../constants";
import { RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import moment from "moment";
import { CalendarList } from "react-native-calendars";
import firebase from "firebase";
import db from "../firebase/config";
import ToastAnimation from "../components/ToastAnimation";

const AddProduct = ({ navigation }) => {
  const [quantity, setQuantity] = React.useState("");
  const [totalCost, setTotalCost] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [productUniqueId, setProductUniqueId] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);

  const [messages, setMessages] = useState([]);

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
  const nameRef = useRef();
  const quantityRef = useRef();
  const costRef = useRef();

  const addProduct = () => {
    var userId = firebase.auth().currentUser.email;
    var dateAdded = moment().format("YYYY-MM-DD");
    db.collection("products").add({
      product_name: productName,
      original_quantity: quantity,
      quantity: quantity,
      original_total_cost: totalCost,
      total_cost: totalCost,
      exp_date: currentDay,
      product_id: Math.random().toString(36).substring(7),
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

  const renderButton = () => {
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
          <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Add Product</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const form = () => {
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

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const message = "Bar code scanned successfully !";
    setMessages([...messages, message]);
    setData(data);
  };

  return (
    <View style={{ flex: 1 }}>
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

export default AddProduct;

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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
  },
});
