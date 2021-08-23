import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import firebase from "firebase";
import db from "../firebase/config";
import moment from "moment";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { windowWidth } from "../constants/Dimensions";

export class ExpiredProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
    };
  }

  componentDidMount() {
    this.getProductList();
  }

  getProductList = () => {
    var email = firebase.auth().currentUser.email;
    var currentDate = moment().subtract(0, "days").format("YYYY-MM-DD");

    this.productRef = db
      .collection("products")
      .where("user_id", "==", email)
      //   .orderBy("exp_date", "==", currentDate)
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        this.setState({
          productList: DATA,
        });
      });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 30,
            left: 32,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => this.props.navigation.pop()}
        >
          <Feather name="arrow-left" size={30} color={COLORS.black} />
          <Text
            style={{
              color: "#554A4C",
              fontSize: 20,
              fontWeight: "700",
              width: windowWidth / 1.5,
              marginLeft: 10,
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
        <Text> ExpiredProductScreen </Text>
      </View>
    );
  }
}

export default ExpiredProductScreen;
