import React, { Component, createRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Alert,
  ToastAndroid,
  SafeAreaView,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/theme";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import firebase from "firebase";
import db from "../firebase/config";
import moment from "moment";
import { SearchBar } from "react-native-elements";
import * as Animated from "react-native-animatable";
import { RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";

export default class SoldScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "",
      soldProducts: [],
    };
    this.soldProductsRef = null;
  }

  componentDidMount() {
    this.getSoldProducts();
  }

  getSoldProducts = () => {
    var email = firebase.auth().currentUser.email;
    this.soldProductsRef = db
      .collection("sold")
      .where("user_id", "==", email)
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        this.setState({
          soldProducts: DATA,
        });
      });
  };

  componentWillUnmount() {
    this.soldProductsRef;
  }

  keyExtractor = (item, index) => index.toString();

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 40,
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
        <View
          style={{
            justifyContent: "center",
            marginTop: 100,
          }}
        >
          <FlatList
            data={this.state.soldProducts}
            keyExtractor={this.keyExtractor}
            renderItem={({ item, i }) => {
              return (
                <View styles={styles.container}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("SoldProductInfo", {
                        name: item.parent_product_name,
                        exp_date: item.parent_exp_date,
                        color: item.parent_product_color,
                        id: item.parent_product_id,
                        cost: item.sold_cost,
                        quantity: item.sold_quantity,
                      });
                    }}
                    key={i}
                    style={styles.productListContent}
                  >
                    <View
                      style={{
                        marginLeft: 13,
                        width: windowWidth / 2.5,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: `rgb(${item.parent_product_color})`,
                            marginRight: 8,
                          }}
                        />

                        <Text
                          style={{
                            color: "#554A4C",
                            fontSize: 20,
                            fontWeight: "700",
                          }}
                          numberOfLines={1}
                        >
                          {item.parent_product_name}
                        </Text>
                      </View>
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: 20,
                            width: 270,
                          }}
                        >
                          <Text
                            style={{
                              color: "gray",
                              fontSize: 14,
                            }}
                            numberOfLines={1}
                          >
                            Total Cost : {item.sold_cost}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/*  */}
                    <View style={{ flexDirection: "row" }}>
                      <View
                        style={{
                          height: 80,
                          width: 5,
                          backgroundColor: `rgb(${item.parent_product_color})`,
                          borderRadius: 5,
                          marginHorizontal: 10,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaeef7",
  },
  addButton: {
    backgroundColor: "#378AD9",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 32,
    left: 32,
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: COLORS.black,
    alignSelf: "center",
    marginBottom: 16,
  },
  input: {
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  create: {
    marginTop: 24,
    height: 40,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  lottie: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalFoot: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    marginTop: 27,
  },
  hideModal: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "gray",
  },
  hideModalPosition: {
    marginLeft: -40,
  },
  ModalDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewMoreIcon: {
    height: 60,
    width: 60,
    backgroundColor: "#2E66E7",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  viewMoreContainer: {
    position: "absolute",
    bottom: 60,
    right: 17,
    justifyContent: "space-between",
    alignItems: "center",
    height: 300,
  },
  CalendarStrip: {
    height: 150,
    marginTop: 40,
    width: windowWidth,
  },
  productListContent: {
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
  },
  deleteButton: {
    backgroundColor: "#ff6347",
    width: 100,
    height: 38,
    alignSelf: "center",
    marginTop: 40,
    borderRadius: 5,
    justifyContent: "center",
  },
  updateButton: {
    backgroundColor: "#2E66E7",
    width: 100,
    height: 38,
    alignSelf: "center",
    marginTop: 40,
    borderRadius: 5,
    justifyContent: "center",
    marginRight: 20,
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
  learn: {
    height: 23,
    width: 56,
    backgroundColor: "#F8D557",
    justifyContent: "center",
    borderRadius: 5,
  },
  design: {
    height: 23,
    width: 63,
    backgroundColor: "#62CCFB",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 7,
  },
  readBook: {
    height: 23,
    width: 86,
    backgroundColor: "#4CD565",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 7,
  },
  title: {
    height: 25,
    borderColor: "#5DD976",
    borderLeftWidth: 3,
    paddingLeft: 13,
    fontSize: 19,
  },
  taskContainer: {
    height: 550,
    width: 327,
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

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  // modal

  modalcontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: windowHeight,
    width: windowWidth,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalSubContainer: {
    alignItems: "center",

    height: 400,
    width: SIZES.width * 0.8,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
  },
  iconContainer: {
    height: 50,
    width: 50,
    marginBottom: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
