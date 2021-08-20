import React, { Component } from "react";
import { Text, View } from "react-native";
import firebase from "firebase";
import db from "../firebase/config";
import moment from "moment";

export class ExpiryProductScreen extends Component {
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
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

export default ExpiryProductScreen;
