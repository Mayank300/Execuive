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
} from "react-native";
import moment from "moment";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import db from "../firebase/config";
import { SearchBar } from "react-native-elements";
import * as Animated from "react-native-animatable";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
export default class MyActivities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      selectedDate: "week",
      currentDate: `${moment().format("YYYY")}-${moment().format(
        "MM"
      )}-${moment().format("DD")}`,
    };
    this.productRef = null;
  }

  componentDidMount() {
    if (this.state.selectedDate == "week") {
      this.getWeekProductList1();
    }
  }

  getTodayProductList = () => {
    var email = firebase.auth().currentUser.email;
    var currentDate = moment().subtract(0, "days").format("YYYY-MM-DD");

    this.productRef = db
      .collection("activities")
      .where("user_id", "==", email)
      .where("date_added", "==", currentDate)
      // .orderBy("timestamp", "desc")
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

  getWeekProductList1 = () => {
    var email = firebase.auth().currentUser.email;
    var currentDate = moment().subtract(0, "days").format("YYYY-MM-DD");

    this.productRef = db
      .collection("activities")
      .where("user_id", "==", email)
      .where("date_added", "==", currentDate)
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
    this.getWeekProductList2();
  };

  getWeekProductList2 = () => {
    var email = firebase.auth().currentUser.email;
    var currentDate_minus_one = moment()
      .subtract(1, "days")
      .format("YYYY-MM-DD");

    this.productRef = db
      .collection("activities")
      .where("user_id", "==", email)
      .where("date_added", "==", currentDate_minus_one)
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        this.setState({
          productList: this.state.productList.concat(DATA),
        });
      });
    this.getWeekProductList3();
  };

  getWeekProductList3 = () => {
    var email = firebase.auth().currentUser.email;
    var currentDate_minus_two = moment()
      .subtract(2, "days")
      .format("YYYY-MM-DD");

    this.productRef = db
      .collection("activities")
      .where("user_id", "==", email)
      .where("date_added", "==", currentDate_minus_two)
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        this.setState({
          productList: this.state.productList.concat(DATA),
        });
      });
    this.getWeekProductList4();
  };

  getWeekProductList4 = () => {
    var email = firebase.auth().currentUser.email;
    var currentDate_minus_three = moment()
      .subtract(3, "days")
      .format("YYYY-MM-DD");

    this.productRef = db
      .collection("activities")
      .where("user_id", "==", email)
      .where("date_added", "==", currentDate_minus_three)
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        this.setState({
          productList: this.state.productList.concat(DATA),
        });
      });
    this.getWeekProductList5();
  };

  getWeekProductList5 = () => {
    var email = firebase.auth().currentUser.email;
    var currentDate_minus_four = moment()
      .subtract(4, "days")
      .format("YYYY-MM-DD");

    this.productRef = db
      .collection("activities")
      .where("user_id", "==", email)
      .where("date_added", "==", currentDate_minus_four)
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        this.setState({
          productList: this.state.productList.concat(DATA),
        });
      });
    this.getWeekProductList6();
  };

  getWeekProductList6 = () => {
    var email = firebase.auth().currentUser.email;
    var currentDate_minus_five = moment()
      .subtract(5, "days")
      .format("YYYY-MM-DD");

    this.productRef = db
      .collection("activities")
      .where("user_id", "==", email)
      .where("date_added", "==", currentDate_minus_five)
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        this.setState({
          productList: this.state.productList.concat(DATA),
        });
      });
    this.getWeekProductList7();
  };

  getWeekProductList7 = () => {
    var email = firebase.auth().currentUser.email;
    var currentDate_minus_six = moment()
      .subtract(6, "days")
      .format("YYYY-MM-DD");

    this.productRef = db
      .collection("activities")
      .where("user_id", "==", email)
      .where("date_added", "==", currentDate_minus_six)
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        this.setState({
          productList: this.state.productList.concat(DATA),
        });
      });
    this.getWeekProductList8();
  };

  getWeekProductList8 = () => {
    var email = firebase.auth().currentUser.email;
    var currentDate_minus_seven = moment()
      .subtract(7, "days")
      .format("YYYY-MM-DD");

    this.productRef = db
      .collection("activities")
      .where("user_id", "==", email)
      .where("date_added", "==", currentDate_minus_seven)
      .onSnapshot((snapshot) => {
        var DATA = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          DATA.push(list);
        });
        this.setState({
          productList: this.state.productList.concat(DATA),
        });
      });
  };

  keyExtractor = (item, index) => index.toString();

  showActivityAlert = (title, desc, userName) => {
    return Alert.alert(`${title}`, `${desc} by ${userName}`);
  };

  componentWillUnmount() {
    this.productRef;
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

    const today = moment().format("dddd MMMM Do YYYY");
    const today_in_date = moment().subtract(0, "days").format("DD-MM-YYYY");
    const today_minus_seven = moment().subtract(7, "days").format("DD-MM-YYYY");

    return (
      <Animatable.View animation={fadeIn} style={styles.animatableView}>
        <View style={styles.animatableViewButton}>
          {/* week */}
          {this.state.selectedDate === "week" ? (
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Week</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                this.setState({ selectedDate: "week", productList: [] });
                this.getWeekProductList1();
              }}
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
              onPress={() => {
                this.setState({ selectedDate: "day", productList: [] });
                this.getTodayProductList();
              }}
              style={styles.notSelectButton}
            >
              <Text style={styles.notSelectButtonText}>Day</Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          {this.state.selectedDate === "day" ? (
            <Text
              style={{
                color: "#554A4C",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              {today}
            </Text>
          ) : null}
          {this.state.selectedDate === "week" ? (
            <Text
              style={{
                color: "#554A4C",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              From {today_in_date} To {today_minus_seven}
            </Text>
          ) : null}
        </View>
      </Animatable.View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#eaeef7" />

        {this.state.productList.length === 0 ? (
          <View>
            <View
              style={
                Platform.OS === "ios" ? { marginTop: 40 } : { marginTop: 20 }
              }
            >
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
                    marginLeft: 5,
                  }}
                >
                  Go Back
                </Text>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                {this.renderSelectionButton()}
              </View>
            </View>
            <View
              style={{
                marginTop: windowHeight / 2.8,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: RFValue(30), fontWeight: "bold" }}>
                No Activities Found !
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={
              Platform.OS === "ios" ? { marginTop: 40 } : { marginTop: 20 }
            }
          >
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
            <View style={styles.buttonContainer}>
              {this.renderSelectionButton()}
            </View>
            <Animated.View animation="bounceInUp" duration={1100}>
              <View style={{ height: windowHeight, paddingBottom: 200 }}>
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.productList}
                  renderItem={({ item, i }) => {
                    return (
                      <View styles={styles.container}>
                        <TouchableOpacity
                          onPress={() => {
                            this.showActivityAlert(
                              item.product_name,
                              item.title,
                              item.user_id
                            );
                          }}
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
                                {item.product_name} {item.title}
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
