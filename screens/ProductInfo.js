import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import { windowHeight, windowWidth } from "../constants/Dimensions";

import db from "../firebase/config";

import firebase from "firebase";

export default class ProductInfo extends Component {
  deleteProduct = (i) => {
    var delete_task = db.collection("products").where("product_id", "==", i);
    delete_task.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  };

  render() {
    const { name, exp_date, color, id, cost, quantity } =
      this.props.route.params;

    return (
      <View style={[styles.container, { backgroundColor: `rgb(${color})` }]}>
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
                    style={[styles.title, { borderColor: `rgb(${color})` }]}
                    value={name}
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
                    Cost
                  </Text>
                  <TextInput
                    editable={false}
                    selectTextOnFocus={false}
                    style={[styles.title, { borderColor: `rgb(${color})` }]}
                    value={cost}
                  />
                </View>
                <View style={styles.sepeerator} />
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
                    editable={false}
                    selectTextOnFocus={false}
                    style={[styles.title, { borderColor: `rgb(${color})` }]}
                    value={quantity}
                  />
                </View>
                <View style={styles.sepeerator} />
                <View>
                  <Text
                    style={{
                      color: "#000",
                      fontSize: 16,
                      fontWeight: "600",
                      marginBottom: 10,
                    }}
                  >
                    Expiry Date
                  </Text>
                  <TextInput
                    editable={false}
                    selectTextOnFocus={false}
                    style={[styles.title, { borderColor: `rgb(${color})` }]}
                    value={exp_date}
                  />
                </View>

                <View style={styles.modalFoot}>
                  <TouchableOpacity
                    onPress={() => {
                      this.deleteProduct(id);
                      this.props.navigation.pop();
                    }}
                  >
                    <Icon type="feather" name="trash-2" size={35} />
                  </TouchableOpacity>
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
