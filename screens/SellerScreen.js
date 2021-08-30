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
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import firebase from "firebase";
import db from "../firebase/config";
import call from "react-native-phone-call";

import moment from "moment";
import { SearchBar } from "react-native-elements";
import * as Animated from "react-native-animatable";
import { RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";

export default class SellerScreen extends Component {
  backgroundColors = [
    "#5CD859",
    "#24A6D9",
    "#595BD9",
    "#8022D9",
    "#D159D8",
    "#D85963",
    "#D88559",
  ];

  constructor(props) {
    super(props);
    this.state = {
      sellerEmail: "",
      sellerName: "",
      sellerCountryCode: "",
      sellerNumber: "",
      addTodoVisible: false,
      color: this.backgroundColors[0],
      sellers: [],
      showEditModal: false,
      doc_id: "",
    };
    this.emailRef = createRef();
    this.codeRef = createRef();
    this.numberRef = createRef();
    this.sellerRef = null;
  }

  componentDidMount() {
    this.getSellers();
  }

  triggerCall = (item) => {
    if (item.seller_number.length != 10) {
      Alert.alert("Cross Check", "Please insert correct contact number");
      return;
    }
    const args = {
      number: item.seller_number,
      prompt: true,
    };
    call(args).catch(console.error);
  };

  getSellers = () => {
    var email = firebase.auth().currentUser.email;
    this.sellerRef = db
      .collection("seller")
      .where("user_id", "==", email)
      // .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        this.setState({
          sellers: DATA,
        });
      });
  };

  componentWillUnmount() {
    this.sellerRef;
  }

  addSeller = () => {
    var userId = firebase.auth().currentUser.email;
    var randomNum = Math.random().toString(36).substring(7);

    {
      this.state.sellerName !== "" &&
      this.state.sellerNumber.length === 10 &&
      this.state.sellerEmail !== "" &&
      this.state.sellerCountryCode.length === 3
        ? db
            .collection("seller")
            .add({
              user_id: userId,
              seller_name: this.state.sellerName,
              seller_number: this.state.sellerNumber,
              seller_email: this.state.sellerEmail,
              seller_country_code: this.state.sellerCountryCode,
              color: this.state.color,
              id: randomNum,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              this.setState({
                sellerEmail: "",
                sellerName: "",
                sellerCountryCode: "",
                sellerNumber: "",
                color: this.backgroundColors[0],
              });
            })
        : Alert.alert("Cross Check", "Please Check the data filled");
    }
  };

  toggleAddSellerModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  }

  renderColors() {
    return this.backgroundColors.map((color) => {
      return (
        <TouchableOpacity
          key={color}
          style={[styles.colorSelect, { backgroundColor: color }]}
          onPress={() => this.setState({ color })}
        />
      );
    });
  }

  updateSeller = (id) => {
    db.collection("seller").doc(id).update({
      seller_name: this.state.sellerName,
      seller_email: this.state.sellerEmail,
      seller_number: this.state.sellerNumber,
      seller_country_code: this.state.sellerCountryCode,
    });
    this.setState({
      sellerName: "",
      sellerEmail: "",
      sellerNumber: "",
      sellerCountryCode: "",
      doc_id: "",
    });
  };

  showEditModal = (item) => {
    return (
      <Modal
        // animationType="slide"
        transparent={true}
        visible={this.state.showEditModal}
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
                      Seller Name
                    </Text>
                    <Icon
                      onPress={() => this.setState({ showEditModal: false })}
                      type="feather"
                      name="x"
                      size={30}
                    />
                  </View>
                  <TextInput
                    style={[styles.title, { borderColor: item.color }]}
                    value={this.state.sellerName}
                    onChangeText={(name) => this.setState({ sellerName: name })}
                    // ref={this.productName}
                    // blurOnSubmit={false}
                    // returnKeyType="next"
                    // onSubmitEditing={() => {
                    //   this.cost.current.focus();
                    // }}
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
                    Email
                  </Text>
                  <TextInput
                    style={[styles.title, { borderColor: item.color }]}
                    value={this.state.sellerEmail}
                    onChangeText={(text) =>
                      this.setState({ sellerEmail: text })
                    }
                    // ref={this.cost}
                    // blurOnSubmit={false}
                    // returnKeyType="next"
                    // onSubmitEditing={() => {
                    //   this.quantity.current.focus();
                    // }}
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
                    Country Code
                  </Text>

                  <TextInput
                    style={[styles.title, { borderColor: item.color }]}
                    value={this.state.sellerCountryCode}
                    onChangeText={(text) =>
                      this.setState({ sellerCountryCode: text })
                    }
                    keyboardType="numeric"
                    // ref={this.quantity}
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
                    Number
                  </Text>

                  <TextInput
                    style={[styles.title, { borderColor: item.color }]}
                    value={this.state.sellerNumber}
                    onChangeText={(text) =>
                      this.setState({ sellerNumber: text })
                    }
                    keyboardType="numeric"
                    // ref={this.quantity}
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
                      this.updateSeller(item.doc_id);
                      this.setState({
                        showEditModal: false,
                        color: this.backgroundColors[0],
                      });
                      {
                        Platform.OS === "ios"
                          ? Alert.alert(
                              "Updated",
                              'Seller Details Updated Successfully"'
                            )
                          : ToastAndroid.show(
                              "Seller Details Updated Successfully",
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

  deleteSeller = (id) => {
    var delete_seller = db.collection("seller").where("id", "==", id);
    delete_seller.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  };

  showAlert = (item) => {
    return Alert.alert(`${item.seller_name}`, `${item.seller_email}`, [
      // {
      //   text: "View",
      //   onPress: () => {
      //     this.props.navigation.navigate("ProductInfo", {
      //       name: item.product_name,
      //       exp_date: item.exp_date,
      //       color: item.product_color,
      //       id: item.product_id,
      //       cost: item.total_cost,
      //       quantity: item.quantity,
      //     });
      //   },
      //   style: "cancel",
      // },

      {
        text: "Delete",
        onPress: () => this.deleteSeller(item.id),
      },
      {
        text: "Cancle",
        onPress: () => {},
        style: "cancel",
      },
    ]);
  };

  showCallAlert = (item) => {
    return Alert.alert(
      `${item.seller_name}`,
      "Are You sure you want to call ?",
      [
        {
          text: "Cancle",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Call",
          onPress: () => {
            this.triggerCall(item);
          },
          style: "cancel",
        },
      ]
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

        <Modal
          animationType="slide"
          visible={this.state.addTodoVisible}
          onRequestClose={() => this.toggleAddSellerModal()}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ScrollView
              style={{
                alignSelf: "stretch",
                marginHorizontal: 32,
                marginVertical: 32,
              }}
            >
              <View style={{ marginTop: windowHeight / 6 }}>
                <Text style={styles.title}>Add Seller</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 20,
                  }}
                >
                  {this.renderColors()}
                </View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: this.state.color,
                      borderWidth: StyleSheet.hairlineWidth + 0.7,
                    },
                  ]}
                  placeholder={"Seller Name"}
                  onChangeText={(name) => {
                    this.setState({ sellerName: name });
                  }}
                  value={this.state.sellerName}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.emailRef.current.focus();
                  }}
                  blurOnSubmit={false}
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: this.state.color,
                      borderWidth: StyleSheet.hairlineWidth + 0.7,
                    },
                  ]}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.codeRef.current.focus();
                  }}
                  blurOnSubmit={false}
                  ref={this.emailRef}
                  placeholder={"Seller Email"}
                  onChangeText={(name) => {
                    this.setState({ sellerEmail: name });
                  }}
                  value={this.state.sellerEmail}
                  keyboardType="email-address"
                />
                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: this.state.color,
                        borderBottomWidth: StyleSheet.hairlineWidth + 0.7,
                        width: 70,
                        marginRight: 10,
                      },
                    ]}
                    ref={this.codeRef}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.numberRef.current.focus();
                    }}
                    blurOnSubmit={false}
                    placeholder={"+91"}
                    keyboardType="phone-pad"
                    onChangeText={(name) => {
                      this.setState({ sellerCountryCode: name });
                    }}
                    value={this.state.sellerCountryCode}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: this.state.color,
                        borderWidth: StyleSheet.hairlineWidth + 0.7,
                        width: windowWidth / 1.68,
                      },
                    ]}
                    ref={this.numberRef}
                    placeholder={"Contact Number"}
                    keyboardType="phone-pad"
                    onChangeText={(name) => {
                      this.setState({ sellerNumber: name });
                    }}
                    value={this.state.sellerNumber}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.create, { backgroundColor: this.state.color }]}
                  onPress={() => {
                    this.addSeller();
                  }}
                >
                  <Text style={{ color: COLORS.white, fontWeight: "600" }}>
                    Create!
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={{ position: "absolute", top: 64, right: 32 }}
              onPress={() => {
                this.toggleAddSellerModal();
                this.setState({
                  sellerName: "",
                  sellerEmail: "",
                  sellerNumber: "",
                  sellerCountryCode: "",
                  doc_id: "",
                });
              }}
            >
              <AntDesign name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </Modal>

        <View
          style={{
            justifyContent: "center",
            marginTop: 100,
          }}
        >
          <FlatList
            data={this.state.sellers}
            keyExtractor={this.keyExtractor}
            renderItem={({ item, i }) => {
              return (
                <View styles={styles.container}>
                  {this.showEditModal(item)}
                  <TouchableOpacity
                    onPress={() => this.showCallAlert(item)}
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
                            backgroundColor: item.color,
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
                          {item.seller_name}
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
                            {item.seller_email}
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
                            showEditModal: true,
                            sellerName: item.seller_name,
                            sellerEmail: item.seller_email,
                            sellerNumber: item.seller_number,
                            sellerCountryCode: item.seller_country_code,
                            doc_id: item.doc_id,
                          });
                        }}
                        color={item.color}
                      />
                      <View
                        style={{
                          height: 80,
                          width: 5,
                          backgroundColor: item.color,
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

        <TouchableOpacity
          onPress={() => this.toggleAddSellerModal()}
          style={styles.addButton}
        >
          <AntDesign name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
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
});
