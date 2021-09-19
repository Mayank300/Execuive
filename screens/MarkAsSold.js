import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import db from "../firebase/config";
import firebase from "firebase";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";

export class MarkAsSold extends Component {
  constructor(props) {
    super(props);
    this.state = {
      original_quantity: this.props.route.params.item.quantity,
      quantity: "",
      item: this.props.route.params.item,
      email: firebase.auth().currentUser.email,
    };
  }

  markAsSold = () => {
    const { item, email } = this.state;

    var originalQuantityInStr = this.state.original_quantity;
    var originalQuantityInInt = parseInt(originalQuantityInStr);

    var quantityInInt = parseInt(this.state.quantity);
    var quantityInStr = quantityInInt.toString();

    var originalMinusQuantityInt = originalQuantityInInt - quantityInInt;
    var originalMinusQuantityStr = originalMinusQuantityInt.toString();

    var originalCostStr = item.original_total_cost;
    var originalCostInt = parseInt(originalCostStr);

    var CostOfOneProductInt = originalCostInt / originalQuantityInInt;

    var CostOfRemainingProductsInProductsCollectionInt =
      originalMinusQuantityInt * CostOfOneProductInt;
    var CostOfRemainingProductsInProductsCollectionStr =
      CostOfRemainingProductsInProductsCollectionInt.toString();

    var CostOfOneProductInSoldCollectionInt =
      originalCostInt - CostOfRemainingProductsInProductsCollectionInt;
    var CostOfOneProductInSoldCollectionStr =
      CostOfOneProductInSoldCollectionInt.toString();

    if (quantityInInt <= this.state.original_quantity && quantityInInt >= 0) {
      db.collection("products").doc(item.doc_id).update({
        quantity: originalMinusQuantityStr,
        total_cost: CostOfRemainingProductsInProductsCollectionStr,
      });
      db.collection("sold").add({
        parent_product_name: item.product_name,
        parent_product_original_quantity: item.original_quantity,
        parent_product_color: item.product_color,
        parent_doc_id: item.doc_id,
        parent_total_cost: item.total_cost,
        parent_exp_date: item.exp_date,
        parent_product_id: item.product_id,
        user_id: email,
        sold_quantity: quantityInStr,
        sold_cost: CostOfOneProductInSoldCollectionStr,
      });
    } else {
      return Alert.alert(
        "Change The Value",
        `The value should be less then ${this.state.original_quantity} and more than 0`
      );
    }
  };

  render() {
    const { item } = this.state;
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: `rgb(${item.product_color})` },
        ]}
      >
        <ScrollView>
          <View style={styles.modalCardContainer}>
            <View style={styles.taskContainer}>
              <ScrollView>
                <View style={styles.ModalHead}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "#000",
                        fontSize: 16,
                        fontWeight: "600",
                        marginBottom: 10,
                      }}
                    >
                      Product Name
                    </Text>
                    <Icon
                      onPress={() => this.props.navigation.pop()}
                      type="feather"
                      name="arrow-left"
                      size={30}
                    />
                  </View>
                  <TextInput
                    editable={false}
                    selectTextOnFocus={false}
                    style={[
                      styles.title,
                      { borderColor: `rgb(${item.product_color})` },
                    ]}
                    value={item.product_name}
                  />
                </View>

                <View style={styles.notesContent} />
                <View>
                  <Text
                    style={{
                      color: "#000",
                      fontSize: 16,
                      fontWeight: "600",
                      marginBottom: 10,
                    }}
                  >
                    Quantity
                  </Text>

                  <TextInput
                    style={[
                      styles.title,
                      { borderColor: `rgb(${item.product_color})` },
                    ]}
                    value={this.state.quantity}
                    placeholder="Add Quantity"
                    keyboardType={"numeric"}
                    onChangeText={(text) => {
                      this.setState({ quantity: text });
                    }}
                  />
                </View>
                <View
                  style={{
                    margin: SIZES.padding * 3,
                    height: 400,
                    marginTop: 60,
                  }}
                >
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={["#73f5be", "#02f58f", "#73f5be"]}
                    style={{
                      backgroundColor: "#4dccc6",
                      height: 60,
                      borderRadius: SIZES.radius,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: windowWidth,
                        alignItems: "center",
                        justifyContent: "center",
                        height: 60,
                      }}
                      onPress={() => {
                        this.markAsSold();
                        this.props.navigation.pop();
                      }}
                    >
                      <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                        Mark As Sold
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>

                {/*  */}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default MarkAsSold;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCardContainer: {
    width: windowWidth,
    alignSelf: "center",
    marginTop: windowHeight / 4,
  },
  taskContainer: {
    height: windowHeight / 2,
    width: windowWidth / 1.3,
    alignSelf: "center",
    borderRadius: 20,
    shadowColor: "#2E66E7",
    backgroundColor: "#ffffff",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 0.2,
    elevation: 5,
    padding: 22,
  },
  ModalHead: {
    flexDirection: "column",
  },
  modalFoot: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  sepeerator: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#979797",
    alignSelf: "center",
    marginVertical: 20,
  },
  notesContent: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#979797",
    alignSelf: "center",
    marginVertical: 20,
  },
  title: {
    height: 25,
    borderColor: "#5DD976",
    borderLeftWidth: 3,
    paddingLeft: 13,
    fontSize: 19,
    color: "gray",
  },
});
