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
      sellerEmail: "",
      sellerName: "",
      sellerCountryCode: "",
      sellerNumber: "",
      color: "",
      soldProducts: [],
      doc_id: "",
      QuantityCount: 0,
      quantityModalVisible: false,
      originalProductQuantity: 0,
      prevCount: 0,
    };
    this.emailRef = createRef();
    this.codeRef = createRef();
    this.numberRef = createRef();
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

  updateSoldProducts = (id, quantity, originalDocId) => {
    db.collection("sold")
      .doc(id)
      .update({
        quantity: this.state.prevCount + quantity,
        original_product_quantity:
          this.state.originalProductQuantity - quantity,
      });
    db.collection("products")
      .doc(originalDocId)
      .update({
        quantity: this.state.originalProductQuantity - quantity,
      });
  };

  deleteSoldProducts = (id) => {
    var deleteProduct = db.collection("sold").where("product_id", "==", id);
    deleteProduct.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  };

  showSoldInput = (item) => {
    var fixedQuantityString = item.quantity;
    var fixedQuantityInteger = parseInt(fixedQuantityString);
    const { QuantityCount, originalProductQuantity } = this.state;
    var quantity = parseInt(QuantityCount);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.quantityModalVisible}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContainer}>
              <View style={styles.modalSubContainer}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    height: 80,
                    width: windowWidth / 1.8,
                    marginTop: 40,
                  }}
                >
                  {quantity === 0 ? null : (
                    <TouchableOpacity
                      onPress={() => {
                        quantity = quantity - 1;
                        this.setState({
                          QuantityCount: quantity,
                        });
                      }}
                      style={[
                        styles.iconContainer,
                        { backgroundColor: COLORS.lime },
                      ]}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 60,
                          marginTop: -10,
                          textAlign: "center",
                        }}
                      >
                        -
                      </Text>
                    </TouchableOpacity>
                  )}
                  <Text
                    style={{
                      color: "#000",
                      fontSize: RFValue(50),
                      marginTop: -10,
                    }}
                  >
                    {quantity}
                  </Text>

                  {quantity >= originalProductQuantity ? null : (
                    <TouchableOpacity
                      onPress={() => {
                        quantity = quantity + 1;
                        this.setState({
                          QuantityCount: quantity,
                        });
                      }}
                      style={[
                        styles.iconContainer,
                        { backgroundColor: COLORS.lime },
                      ]}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 40,
                          marginTop: -5,
                        }}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        quantityModalVisible: false,
                      });
                      this.updateSoldProducts(
                        item.doc_id,
                        quantity,
                        item.original_doc_id
                      );
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 20,
                      marginTop: 30,
                      width: windowWidth / 1.65,
                      height: 60,
                      borderRadius: 20,
                      backgroundColor: COLORS.lightGreen,
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      type="feather"
                      name="trending-up"
                      color="#66D59A"
                      size={25}
                    />
                    <Text
                      style={{
                        color: "#66D59A",
                        fontSize: RFValue(25),
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      Update
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.deleteSoldProducts(item.product_id);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 20,
                      marginTop: 30,
                      width: windowWidth / 1.65,
                      height: 60,
                      borderRadius: 20,
                      backgroundColor: COLORS.lightRed,
                      justifyContent: "center",
                    }}
                  >
                    <Icon type="feather" name="x" color="#FF4134" size={25} />
                    <Text
                      style={{
                        color: "#FF4134",
                        fontSize: RFValue(25),
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        quantityModalVisible: false,
                      });
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 20,
                      marginTop: 30,
                      width: windowWidth / 1.65,
                      height: 60,
                      borderRadius: 20,
                      backgroundColor: COLORS.lightyellow,
                      justifyContent: "center",
                    }}
                  >
                    <Icon type="feather" name="x" color="#FFC664" size={25} />
                    <Text
                      style={{
                        color: "#FFC664",
                        fontSize: RFValue(25),
                        fontWeight: "bold",
                        marginLeft: 10,
                      }}
                    >
                      Cancle
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  };

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
                  {this.showSoldInput(item)}

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        quantityModalVisible: true,
                      });
                      this.setState({
                        QuantityCount: item.original_product_quantity,
                        originalProductQuantity: item.original_product_quantity,
                        prevCount: item.quantity,
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
                            backgroundColor: `rgb(${item.product_color})`,
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
                          {item.product_name}
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
                            ....
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
                          backgroundColor: `rgb(${item.product_color})`,
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
