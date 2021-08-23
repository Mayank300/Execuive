import React, { Component, createRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import firebase from "firebase";
import db from "../firebase/config";

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
      selleEmail: "",
      sellerName: "",
      sellerCountryCode: "",
      sellerName: "",
      addTodoVisible: false,
      color: this.backgroundColors[0],
      sellers: [],
    };
    this.emailRef = createRef();
    this.codeRef = createRef();
    this.numberRef = createRef();
    this.sellerRef = null;
  }

  componentDidMount() {
    this.getSellers();
  }

  getSellers = () => {
    var userId = firebase.auth().currentUser.email;
    this.requestRef = db
      .collection("seller")
      .where("user_id", "==", userId)
      .onSnapshot((snapshot) => {
        var DATA = snapshot.docs.map((doc) => doc.data());
        this.setState({
          sellers: DATA,
        });
      });

    console.log(this.state.sellers);
  };

  addSeller = () => {
    var userId = firebase.auth().currentUser.email;
    var randomNum = Math.random().toString(36).substring(7);

    db.collection("seller").add({
      user_id: userId,
      seller_name: this.state.sellerName,
      seller_number: this.state.sellerNumber,
      seller_email: this.state.sellerEmail,
      seller_country_code: this.state.sellerCountryCode,
      color: this.state.color,
      id: randomNum,
    });
    this.setState({
      sellerEmail: "",
      sellerName: "",
      sellerCountryCode: "",
      sellerNumber: "",
      color: this.backgroundColors[0],
    });
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

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 30,
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
                  onPress={() => this.addSeller()}
                >
                  <Text style={{ color: COLORS.white, fontWeight: "600" }}>
                    Create!
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={{ position: "absolute", top: 64, right: 32 }}
              onPress={() => this.toggleAddSellerModal()}
            >
              <AntDesign name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </Modal>
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
});
