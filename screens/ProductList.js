import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import moment from "moment";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import db from "../firebase/config";
import { SearchBar } from "react-native-elements";
import * as Animated from "react-native-animatable";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import LottieView from "lottie-react-native";

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
    };
    this.productRef = null;
  }

  componentDidMount() {
    this.getProductList();
  }

  getProductList = () => {
    var email = firebase.auth().currentUser.email;
    this.productRef = db
      .collection("products")
      .where("user_id", "==", email)
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

  deleteTask = (product_id) => {
    var delete_task = db
      .collection("products")
      .where("product_id", "==", product_id);
    delete_task.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
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
              <Animated.View animation="fadeInLeftBig" duration={1500}>
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

            <Animated.View animation="fadeInUpBig" duration={1500}>
              <View style={{ height: windowHeight, paddingBottom: 125 }}>
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.filterProductList}
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
                                }}
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
});
