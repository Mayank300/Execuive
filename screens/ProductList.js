import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ToastAndroid,
} from "react-native";
import moment from "moment";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import db from "../firebase/config";
import { SearchBar } from "react-native-elements";
import * as Animated from "react-native-animatable";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";

import * as Print from "expo-print";

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      filterProductList: [],
      currentDate: `${moment().format("YYYY")}-${moment().format(
        "MM"
      )}-${moment().format("DD")}`,
      search: "",
      showModal: false,
      product_name: "",
      cost: "",
      quantity: "",
      doc_id: "",
    };
    this.productRef = null;
    this.productName = React.createRef();
    this.cost = React.createRef();
    this.quantity = React.createRef();
  }

  componentDidMount() {
    this.getProductList();
  }

  getProductList = () => {
    var email = firebase.auth().currentUser.email;
    var currentDate = moment().subtract(0, "days").format("YYYY-MM-DD");
    var today = currentDate.toString();

    console.log(today);

    this.productRef = db
      .collection("products")
      .where("user_id", "==", email)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        this.setState({
          productList: DATA,
          filterProductList: DATA,
        });
      });
  };

  searchFilterFunction = (text) => {
    if (text) {
      const newData = this.state.productList.filter(function (item) {
        const itemData = item.product_name
          ? item.product_name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        search: text,
        filterProductList: newData,
      });
    } else {
      this.setState({
        search: text,
        filterProductList: this.state.productList,
      });
    }
  };

  ItemView = ({ item }) => {
    return (
      <Text style={styles.itemStyle} onPress={() => this.getItem(item)}>
        {item.product_id}
        {"."}
        {item.product_name.toUpperCase()}
      </Text>
    );
  };

  getItem = (item) => {
    alert("Id : " + item.product_id + " Title : " + item.product_name);
  };

  deleteProduct = (id) => {
    var delete_task = db.collection("products").where("product_id", "==", id);
    delete_task.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  };

  updateProduct = () => {
    db.collection("products").doc(this.state.doc_id).update({
      total_cost: this.state.cost,
      product_name: this.state.product_name,
      quantity: this.state.quantity,
    });
    this.setState({
      total_cost: "",
      product_name: "",
      quantity: "",
      doc_id: "",
    });
  };

  showAlert = (item) => {
    return Alert.alert(`${item.product_name}`, `Expires on ${item.exp_date}`, [
      {
        text: "View",
        onPress: () => {
          this.props.navigation.navigate("ProductInfo", {
            name: item.product_name,
            exp_date: item.exp_date,
            color: item.product_color,
            id: item.product_id,
            cost: item.total_cost,
            quantity: item.quantity,
          });
        },
        style: "cancel",
      },

      {
        text: "Delete",
        onPress: () => this.deleteProduct(item.product_id),
      },
      {
        text: "Cancle",
        onPress: () => {},
        style: "cancel",
      },
    ]);
  };

  showEditModal = (item) => {
    return (
      <Modal
        // animationType="slide"
        transparent={true}
        visible={this.state.showModal}
      >
        <View
          style={[
            styles.modalContainer,
            {
              paddingTop: windowHeight / 4,
              backgroundColor: "rgba(0,0,0,0.2)",
              height: windowHeight,
            },
          ]}
        >
          <ScrollView>
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
                      onPress={() => this.setState({ showModal: false })}
                      type="feather"
                      name="x"
                      size={30}
                    />
                  </View>
                  <TextInput
                    style={[
                      styles.title,
                      { borderColor: `rgb(${item.product_color})` },
                    ]}
                    value={this.state.product_name}
                    onChangeText={(name) =>
                      this.setState({ product_name: name })
                    }
                    ref={this.productName}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.cost.current.focus();
                    }}
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
                    style={[
                      styles.title,
                      { borderColor: `rgb(${item.product_color})` },
                    ]}
                    value={this.state.cost}
                    onChangeText={(cost) => this.setState({ cost: cost })}
                    keyboardType="numeric"
                    ref={this.cost}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.quantity.current.focus();
                    }}
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
                    style={[
                      styles.title,
                      { borderColor: `rgb(${item.product_color})` },
                    ]}
                    value={this.state.quantity}
                    onChangeText={(quantity) =>
                      this.setState({ quantity: quantity })
                    }
                    keyboardType="numeric"
                    ref={this.quantity}
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
                    style={[
                      styles.title,
                      { borderColor: `rgb(${item.product_color})` },
                    ]}
                    value={item.exp_date}
                  />
                </View>

                <View
                  style={[
                    styles.modalFoot,
                    { justifyContent: "center", marginHorizontal: 20 },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.updateProduct(item.doc_id);
                      this.setState({
                        showModal: false,
                      });
                      {
                        Platform.OS === "ios"
                          ? null
                          : ToastAndroid.show(
                              "Product Updated Successfully",
                              ToastAndroid.SHORT
                            );
                      }
                    }}
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        marginRight: 5,
                        color: "#554A4C",
                        fontSize: 25,
                        fontWeight: "700",
                      }}
                    >
                      Update
                    </Text>
                    <Icon type="feather" name="check" size={35} />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  componentWillUnmount() {
    this.productRef;
  }

  keyExtractor = (item, index) => index.toString();

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#eaeef7" />

        {this.state.productList.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: RFValue(30), fontWeight: "bold" }}>
              No Product Added !
            </Text>
          </View>
        ) : (
          <View>
            <View
              style={
                Platform.OS === "ios" ? { marginTop: 40 } : { marginTop: 20 }
              }
            >
              <Animated.View animation="fadeIn" duration={1100}>
                <View
                  style={{
                    height: 50,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      position: "absolute",
                      right: 20,
                    }}
                    onPress={() => {}}
                  >
                    <Text
                      style={{
                        color: "#554A4C",
                        fontSize: 25,
                        fontWeight: "700",
                        marginRight: 10,
                      }}
                    >
                      Save As Pdf
                    </Text>
                    <Icon type="feather" name="file-text" size={30} />
                  </TouchableOpacity>
                </View>
              </Animated.View>
              <Animated.View animation="fadeIn" duration={1100}>
                <SearchBar
                  round
                  searchIcon={{ size: 24 }}
                  onChangeText={(text) => this.searchFilterFunction(text)}
                  onClear={(text) => this.searchFilterFunction("")}
                  placeholder="Search Product..."
                  value={this.state.search}
                  lightTheme={true}
                />
              </Animated.View>
            </View>

            <Animated.View animation="bounceInUp" duration={1100}>
              <View style={{ height: windowHeight, paddingBottom: 160 }}>
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.filterProductList}
                  renderItem={({ item, i }) => {
                    return (
                      <View styles={styles.container}>
                        {this.showEditModal(item)}
                        <TouchableOpacity
                          onPress={() => this.showAlert(item)}
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
                                  Product Expires on{" "}
                                  {`${moment(item.exp_date).format(
                                    "DD"
                                  )}/${moment(item.exp_date).format(
                                    "MM"
                                  )}/${moment(item.exp_date).format(
                                    "YYYY"
                                  )}`}{" "}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={{ flexDirection: "row" }}>
                            <Icon
                              type="feather"
                              name="edit"
                              size={25}
                              style={{ marginRight: 12, marginTop: 10 }}
                              onPress={() => {
                                this.setState({
                                  showModal: true,
                                  product_name: item.product_name,
                                  cost: item.total_cost,
                                  quantity: item.quantity,
                                  doc_id: item.doc_id,
                                });
                              }}
                              color={`rgb(${item.product_color})`}
                            />
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
            </Animated.View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaeef7",
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
});
