import React, { useState, useEffect, PropTypes } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import firebase from "firebase";
import db from "../firebase/config";
import { Icon, Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { RFValue } from "react-native-responsive-fontsize";
import { Title, Caption, Text, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native";
import { sendEmail } from "../mail/sendEmail";
// import { useIsFocused } from "@react-navigation/native";

const SettingsScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [area, setArea] = useState([]);
  const [image, setImage] = useState("#");
  const [expiryList, setExpiryList] = useState([]);
  const [cost, setCost] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [activity, setActivity] = React.useState([]);

  // const isFocused = useIsFocused();

  const userEmail = firebase.auth().currentUser.email;

  useEffect(() => {
    getUserDetails();
    getExpiryProducts();
    getAllActivities();
    var email = firebase.auth().currentUser.email;
    fetchImage(email);
    const MINUTE_MS = 5000;
    const interval = setInterval(() => {
      fetchImage(email);
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Name: ${name}\nEmail ID: ${email}\nContact: ${
          area.callingCode + " " + contact
        }\nTotal Products: ${
          expiryList.length
        }\nTotal Stock Price: ${cost}\nCountry: ${area.name}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const getAllActivities = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("activities")
      .where("user_id", "==", email)
      .onSnapshot((snapshot) => {
        var activityNumber = [];
        snapshot.docs.map((doc) => {
          var sold = doc.data();
          activityNumber.push(sold);
        });
        setActivity(activityNumber);
      });
  };

  const selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!cancelled) {
      uploadImage(uri, userEmail);
    }
  };

  const uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      fetchImage(imageName);
    });
  };

  const fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    storageRef
      .getDownloadURL()
      .then((url) => {
        setImage(url);
      })
      .catch((error) => {
        setImage("#");
      });
  };

  const costConverter = (COST) => {
    var productCostString = COST;
    var productCostInteger = productCostString.map((i) => Number(i));
    var totalProductCost = 0;
    for (var i = 0; i < productCostInteger.length; i++) {
      totalProductCost += productCostInteger[i];
    }
    totalProductCost = totalProductCost.toString();
    var lastThree = totalProductCost.substring(totalProductCost.length - 3);
    var otherNumbers = totalProductCost.substring(
      0,
      totalProductCost.length - 3
    );
    if (otherNumbers != "") lastThree = "," + lastThree;
    var finalCost =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    setCost(finalCost);
  };

  const quantityConverter = (QUANTITY) => {
    var productQuantityString = QUANTITY;
    var productQuantityInteger = productQuantityString.map((i) => Number(i));
    var totalProductQuantity = 0;
    for (var i = 0; i < productQuantityInteger.length; i++) {
      totalProductQuantity += productQuantityInteger[i];
    }
    totalProductQuantity = totalProductQuantity.toString();
    var lastThree = totalProductQuantity.substring(totalProductQuantity.length - 3);
    var otherNumbers = totalProductQuantity.substring(
      0,
      totalProductQuantity.length - 3
    );
    if (otherNumbers != "") lastThree = "," + lastThree;
    var finalQuantity =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    setQuantity(finalQuantity);
  };

  const getExpiryProducts = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("products")
      .where("user_id", "==", email)
      .onSnapshot((snapshot) => {
        var DATA = [];
        var COST = [];
        var QUNATITY = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          var cost = doc.data().total_cost;
          var quantity = doc.data().quantity;
          list["doc_id"] = doc.id;
          DATA.push(list);
          COST.push(cost);
          QUNATITY.push(quantity);
        });
        setExpiryList(DATA);
        costConverter(COST);
        quantityConverter(QUNATITY);
      });
  };

  function getUserDetails() {
    db.collection("users")
      .where("email_id", "==", userEmail)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          setName(data.user_name);
          setEmail(data.email_id);
          setContact(data.contact);
          setArea(data.selected_area);
        });
      });
  }

  const showLogoutAlert = () => {
    return Alert.alert("Are You sure", "you want to logout?", [
      {
        text: "Yes",
        onPress: () => {
          firebase.auth().signOut();
          navigation.replace("Login");
        },
      },
      { text: "Cancel", onPress: () => {} },
    ]);
  };

  const showDeleteUserDataAlert = () => {
    return Alert.alert(
      "ARE YOU SURE",
      "you want to delete your data forever?",
      [
        {
          text: "Yes",
          onPress: () => {
            deleteDataOfUser(userEmail);
          },
        },
        { text: "Cancel", onPress: () => {} },
      ]
    );
  };

  const deleteDataOfUser = (id) => {
    var delete_task = db.collection("products").where("user_id", "==", id);
    delete_task.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  };

  const sendPasswordReset = (email) => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        firebase.auth().signOut();
        navigation.replace("Login");
        return alert("Check registered email and change password ");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
      });
  };

  const passwordResetAlert = () => {
    return Alert.alert("ARE YOU SURE", "You want ot change your password?", [
      {
        text: "Yes",
        onPress: () => {
          sendPasswordReset(userEmail);
        },
      },
      { text: "Cancel", onPress: () => {} },
    ]);
  };

  const sendMail = () => {
    sendEmail("mratre300@gmail.com", "My feedback for your app!", "...").then(
      () => {
        alert("Your message was successfully sent!");
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {image === "#" ? (
              <Avatar
                rounded
                source={require("../assets/images/edit.png")}
                size="large"
                onPress={() => selectPicture()}
              />
            ) : (
              <Avatar
                rounded
                source={{
                  uri: image,
                }}
                size="large"
                onPress={() => selectPicture()}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                Alert.alert(`${name}`, `${email}`);
              }}
            >
              <View style={{ marginLeft: 20, width: windowWidth / 1.8 }}>
                <Title
                  numberOfLines={1}
                  style={[
                    styles.title,
                    {
                      marginTop: 15,
                      marginBottom: 5,
                    },
                  ]}
                >
                  {name}
                </Title>

                <Caption numberOfLines={1} style={styles.caption}>
                  {email}
                </Caption>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: -50 }}>
            <Icon type="font-awesome" name="share" onPress={() => onShare()} />
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="map-pin" type="feather" color="#777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20, marginRight: 10 }}>
            {area.name}
          </Text>
          <Image
            source={{ uri: area.flag }}
            style={{ width: 30, marginTop: -5 }}
          />
        </View>
        <View style={styles.row}>
          <Icon name="phone" type="feather" color="#777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {area.callingCode} {contact}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="mail" type="feather" color="#777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>{email}</Text>
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Cost", `₹ ${cost}`);
          }}
          style={[
            styles.infoBox,
            {
              borderRightColor: "#dddddd",
              borderRightWidth: 1,
            },
          ]}
        >
          <Title numberOfLines={1} style={{ marginHorizontal: 20 }}>
            ₹ {cost}
          </Title>
          <Caption>Total Stock Price</Caption>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.infoBox}
          onPress={() => {
            navigation.navigate("ProductList");
          }}
        >
          <Title>{quantity}</Title>
          <Caption>
            {quantity.length === 1 ? "Total Product" : "Total Products"}
          </Caption>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ marginBottom: 50 }}>
        <View style={styles.menuWrapper}>
          <TouchableRipple
            onPress={() => {
              navigation.navigate("EditProfileScreen");
            }}
          >
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: COLORS.lightpurple,
                  },
                ]}
              >
                <Image
                  source={icons.user}
                  resizeMode="contain"
                  style={[
                    styles.icon,
                    {
                      tintColor: COLORS.purple,
                    },
                  ]}
                />
              </View>
              <Text style={styles.menuItemText}>Account</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => {
              passwordResetAlert();
            }}
          >
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: COLORS.lightRed,
                  },
                ]}
              >
                <Icon
                  type="feather"
                  name="lock"
                  color="#FF4134"
                  style={{
                    height: 30,
                    width: 30,
                  }}
                />
              </View>
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => {
              navigation.navigate("MyActivities");
            }}
          >
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: COLORS.lightGreen,
                  },
                ]}
              >
                <View
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -1,
                    height: 21,
                    width: 21,
                    backgroundColor: COLORS.red,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 10, color: "#fff" }}>
                    {activity.length}
                  </Text>
                </View>
                <Icon
                  type="feather"
                  name="activity"
                  color="#66D59A"
                  size={30}
                />
              </View>
              <Text style={styles.menuItemText}>My Activities</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => {
              showLogoutAlert();
            }}
          >
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: COLORS.lightpurple,
                  },
                ]}
              >
                <Icon
                  type="feather"
                  name="arrow-right"
                  color="#6B3CE9"
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
              </View>
              <Text style={styles.menuItemText}>Logout</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => {
              sendMail();
            }}
          >
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: COLORS.lightyellow,
                  },
                ]}
              >
                <Icon
                  type="font-awesome"
                  name="share"
                  color="#FFC664"
                  style={{
                    height: 30,
                    width: 30,
                    marginTop: 5,
                    marginLeft: 5,
                  }}
                />
              </View>
              <Text style={styles.menuItemText}>Send Feedback</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => {
              showDeleteUserDataAlert();
            }}
          >
            <View style={styles.menuItem}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: COLORS.lightRed,
                  },
                ]}
              >
                <Icon
                  type="feather"
                  name="x-square"
                  color="#FF4134"
                  style={{
                    height: 30,
                    width: 30,
                  }}
                />
              </View>
              <Text style={[styles.menuItemText, { marginBottom: 10 }]}>
                Delete Inventory Data
              </Text>
            </View>
          </TouchableRipple>
        </View>
      </ScrollView>
    </SafeAreaView>
    //   {/* </ImageBackground> */}
    // // </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
  iconContainer: {
    height: 50,
    width: 50,
    marginBottom: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 22,
    width: 22,
  },
  modal: {
    height: 200,
    width: SIZES.width * 0.8,
    backgroundColor: COLORS.green,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
  },
  passinput: {
    marginVertical: SIZES.padding,
    borderColor: COLORS.white,
    borderWidth: 1,
    height: 50,
    color: COLORS.white,
    paddingLeft: 20,
    width: windowWidth / 1.5,
    borderRadius: SIZES.radius,
  },
});
