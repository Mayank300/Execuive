import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Alert,
} from "react-native";
import firebase from "firebase";
import db from "../firebase/config";
import ShelfCard from "./ShelfCard";
import { COLORS, SIZES } from "../constants";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native";
import moment from "moment";
import { ActivityIndicator } from "react-native";
import { ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import { RFValue } from "react-native-responsive-fontsize";
import Blink from "../components/Blink";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import { Icon } from "react-native-elements/dist/icons/Icon";
// import CodePush from "react-native-code-push";
// import RNRestart from "react-native-restart";
export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
      expiryList: [],
      selectedDate: "week",
      cost: [],
      expDate: [],
      refreshing: false,
      expiredProducts: [],
      soldProducts: 0,
    };
    this.productRf = null;
  }

  componentDidMount() {
    this.getExpiryProducts();
    this.getExpiredProductList();
    this.getSoldProducts();
    this.getQuantity();
  }

  getQuantity = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("products")
      .where("user_id", "==", email)
      .onSnapshot((snapshot) => {
        var QUNATITY = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          var quantity = doc.data().quantity;
          list["doc_id"] = doc.id;
          QUNATITY.push(quantity);
        });
        this.quantityConverter(QUNATITY);
      });
  };

  quantityConverter = (QUANTITY) => {
    var productQuantityString = QUANTITY;
    var productQuantityInteger = productQuantityString.map((i) => Number(i));
    var totalProductQuantity = 0;
    for (var i = 0; i < productQuantityInteger.length; i++) {
      totalProductQuantity += productQuantityInteger[i];
    }
    totalProductQuantity = totalProductQuantity.toString();
    var lastThree = totalProductQuantity.substring(
      totalProductQuantity.length - 3
    );
    var otherNumbers = totalProductQuantity.substring(
      0,
      totalProductQuantity.length - 3
    );
    if (otherNumbers != "") lastThree = "," + lastThree;
    var finalQuantity =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    this.setState({ quantity: finalQuantity });
  };

  getExpiryProducts = () => {
    var email = firebase.auth().currentUser.email;
    this.productRef = db
      .collection("products")
      .where("user_id", "==", email)
      .onSnapshot((snapshot) => {
        var DATA = [];
        var COST = [];
        var EXPIRY = [];

        // compare dates
        var date = moment("2013-03-24");
        var now = moment();

        if (now > date) {
          console.log("past");
        } else {
          console.log("future");
        }

        // compare dates

        snapshot.docs.map((doc) => {
          var list = doc.data();
          var cost = doc.data().total_cost;
          var expiry = doc.data().exp_date;
          list["doc_id"] = doc.id;
          DATA.push(list);
          COST.push(cost);
          EXPIRY.push(expiry);
        });
        this.setState({
          expiryList: DATA,
          totalCost: DATA.total_cost,
          cost: COST,
          expDate: EXPIRY,
        });
      });
  };

  timing() {
    setInterval(() => {
      this.setState({
        refreshing: false,
      });
      // CodePush.restartApp();
      // RNRestart.Restart();
    }, 2000);
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.timing();
  }

  renderSelectionButton = () => {
    const fadeIn = {
      from: {
        opacity: 0.001,
      },
      to: {
        opacity: 1,
      },
    };

    return (
      <Animatable.View
        animation={fadeIn}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 50,
          margin: 10,

          width: windowWidth - 80,
        }}
      >
        {/* month */}
        {this.state.selectedDate === "month" ? (
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Month</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => this.setState({ selectedDate: "month" })}
            style={styles.notSelectButton}
          >
            <Text style={styles.notSelectButtonText}>Month</Text>
          </TouchableOpacity>
        )}

        {/* week */}
        {this.state.selectedDate === "week" ? (
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Week</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => this.setState({ selectedDate: "week" })}
            style={styles.notSelectButton}
          >
            <Text style={styles.notSelectButtonText}>Week</Text>
          </TouchableOpacity>
        )}

        {/* day */}
        {this.state.selectedDate === "day" ? (
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Day</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => this.setState({ selectedDate: "day" })}
            style={styles.notSelectButton}
          >
            <Text style={styles.notSelectButtonText}>Day</Text>
          </TouchableOpacity>
        )}
      </Animatable.View>
    );
  };

  deleteProduct = (id) => {
    var delete_task = db.collection("products").where("product_id", "==", id);
    delete_task.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  };

  showAlert = (selectedProduct) => {
    return Alert.alert(
      `${selectedProduct.product_name}`,
      `Expires on ${selectedProduct.exp_date}`,
      [
        {
          text: "Delete",
          onPress: () => this.deleteProduct(selectedProduct.product_id),
        },
        {
          text: "Cancle",
          onPress: () => {},
          style: "cancel",
        },
      ]
    );
  };

  renderPromos = () => {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => this.showAlert(item)}
        style={{
          height: 100,
          width: 327,
          alignSelf: "center",
          borderRadius: 10,
          shadowColor: "#2E66E7",
          backgroundColor: "#ffffff",
          marginTop: 10,
          marginBottom: 10,
          shadowOffset: {
            width: 3,
            height: 3,
          },
          shadowRadius: 5,
          shadowOpacity: 0.2,
          elevation: 3,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {this.state.selectedDate === "month" ? (
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: COLORS.yellow,
                marginHorizontal: 20,
              }}
            />
          ) : null}
          {this.state.selectedDate === "week" ? (
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: "rgb(255,0,0)",
                marginHorizontal: 20,
              }}
            />
          ) : null}
          {this.state.selectedDate === "day" ? (
            <Blink duration={400}>
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: "rgb(255,0,0)",
                  marginHorizontal: 20,
                }}
              />
            </Blink>
          ) : null}

          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                color: "#554A4C",
                fontSize: RFValue(19),
                fontWeight: "700",
              }}
            >
              {item.product_name}
            </Text>
            {/* for a month */}
            {this.state.selectedDate === "month" ? (
              <Text numberOfLines={1} style={styles.itemDes}>
                A month before expires{" "}
                {moment(item.exp_date)
                  .subtract(1, "months")
                  .format("DD-MM-YYYY")}
              </Text>
            ) : null}
            {/* for a week */}
            {this.state.selectedDate === "week" ? (
              <Text numberOfLines={1} style={styles.itemDes}>
                A week before expires{" "}
                {moment(item.exp_date).subtract(7, "d").format("DD-MM-YYYY")}
              </Text>
            ) : null}
            {/* for a day */}
            {this.state.selectedDate === "day" ? (
              <Text numberOfLines={1} style={styles.itemDes}>
                A day before expires{" "}
                {moment(item.exp_date).subtract(1, "d").format("DD-MM-YYYY")}
              </Text>
            ) : null}
          </View>
        </View>

        {this.state.selectedDate === "month" ? (
          <View
            style={{
              height: 80,
              width: 5,
              backgroundColor: COLORS.yellow,
              borderRadius: 5,
              marginHorizontal: 10,
            }}
          />
        ) : null}
        {this.state.selectedDate === "week" ? (
          <View
            style={{
              height: 80,
              width: 5,
              backgroundColor: "rgb(255,0,0)",
              borderRadius: 5,
              marginHorizontal: 10,
            }}
          />
        ) : null}

        {this.state.selectedDate === "day" ? (
          <View
            style={{
              height: 80,
              width: 5,
              backgroundColor: "rgb(255,0,0)",
              borderRadius: 5,
              marginHorizontal: 10,
            }}
          />
        ) : null}
      </TouchableOpacity>
    );

    if (this.state.expiryList.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.green} />
        </View>
      );
    } else {
      return (
        <FlatList
          data={this.state.expiryList}
          keyExtractor={(item) => `${item.product_id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ marginBottom: 80 }}></View>}
        />
      );
    }
  };

  getSoldProducts = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("sold")
      .where("user_id", "==", email)
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list.quantity);
        });
        this.soldConverter(DATA);
      });
  };

  soldConverter = (QUANTITY) => {
    var productQuantityString = QUANTITY;
    var productQuantityInteger = productQuantityString.map((i) => Number(i));
    var totalProductQuantity = 0;
    for (var i = 0; i < productQuantityInteger.length; i++) {
      totalProductQuantity += productQuantityInteger[i];
    }
    totalProductQuantity = totalProductQuantity.toString();
    var lastThree = totalProductQuantity.substring(
      totalProductQuantity.length - 3
    );
    var otherNumbers = totalProductQuantity.substring(
      0,
      totalProductQuantity.length - 3
    );
    if (otherNumbers != "") lastThree = "," + lastThree;
    var finalQuantity =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    this.setState({ soldProducts: finalQuantity });
  };

  getExpiredProductList = () => {
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
        this.setState({ expiredProducts: expiredProducts.length });
      });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        >
          <View
            style={{
              paddingHorizontal: SIZES.padding * 3,
              paddingBottom: SIZES.padding * 3,
            }}
          >
            {this.props.renderHeader}
            <View style={{ height: 400 }}>
              <ShelfCard
                totalProducts={this.state.quantity}
                totalCost={this.state.cost}
                totalExpiry={this.state.expiredProducts}
                totalProductSold={this.state.soldProducts}
              />
            </View>
            {this.props.renderFeatures}
            {this.state.expiryList.length === 0
              ? null
              : this.renderSelectionButton()}
          </View>
          {this.state.expiryList.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: RFValue(20), fontWeight: "bold" }}>
                No Product Added !
              </Text>
            </View>
          ) : (
            this.renderPromos()
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  selectButton: {
    backgroundColor: "#000",
    height: 40,
    width: 90,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notSelectButton: {
    backgroundColor: "#fff",
    height: 40,
    width: 90,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  notSelectButtonText: {
    color: "#000",
    fontSize: 16,
  },
  itemDes: {
    color: "gray",
    fontSize: 14,
    marginLeft: 10,
    width: 220,
  },
});
