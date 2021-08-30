import * as Animated from "react-native-animatable";
import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import firebase from "firebase";
import db from "../firebase/config";
import moment from "moment";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { windowHeight, windowWidth } from "../constants/Dimensions";

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
    var DATA = [];
    var expiredProducts = [];

    this.productRef = db
      .collection("products")
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
        this.setState({
          productList: expiredProducts,
        });
      });
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    return (
      <View style={{ flex: 1, marginTop: Platform.OS === "ios" ? 40 : 20 }}>
        <TouchableOpacity
          style={{
            marginLeft: 30,
            marginTop: 0,
            marginBottom: 30,
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

        <Animated.View animation="bounceInUp" duration={1100}>
          <View
            style={{
              height: windowHeight,
              paddingBottom: 200,
            }}
          >
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.productList}
              renderItem={({ item, i }) => {
                return (
                  <View styles={styles.container}>
                    <TouchableOpacity
                      onPress={() => {}}
                      key={i}
                      style={styles.productListContent}
                    >
                      <View
                        style={{
                          marginLeft: 13,
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
                              width: windowWidth / 1.5,
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
                              Product Expired on{" "}
                              {`${moment(item.exp_date).format("DD")}/${moment(
                                item.exp_date
                              ).format("MM")}/${moment(item.exp_date).format(
                                "YYYY"
                              )}`}{" "}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          height: 80,
                          width: 5,
                          backgroundColor: `rgb(${item.product_color})`,
                          borderRadius: 5,
                          marginHorizontal: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default ExpiredProductScreen;

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
  ModalHead: {
    flexDirection: "column",
  },
  modalCardContainer: {
    flex: 1,
    width: windowWidth,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  viewMoreVert: {
    position: "absolute",
    bottom: 60,
    right: 17,
    height: 60,
    width: 60,
    backgroundColor: "#2E66E7",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E66E7",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 5,
    zIndex: 999,
  },
  viewMoreIcon: {
    height: 60,
    width: 60,
    backgroundColor: "#2E66E7",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E66E7",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
  buttonContainer: {
    alignSelf: "center",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  animatableView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: 100,
    margin: 10,
    width: windowWidth - 80,
  },
  animatableViewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    margin: 10,
    width: windowWidth - 80,
  },
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
  graphContainer: {
    width: windowWidth,
    height: windowHeight,
    alignSelf: "center",
  },
});
