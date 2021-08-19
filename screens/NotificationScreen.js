import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { windowHeight, windowWidth } from "../components/Dimensions";
import firebase from "firebase";
import db from "../firebase/config";
import { SwipeListView } from "react-native-swipe-list-view";
import { FONTS } from "../constants";

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      allNotifications: [],
    };
    this.notificationRef = null;
  }

  componentDidMount() {
    this.getNotifications();
  }

  getNotifications = () => {
    this.notificationRef = db
      .collection("notifications")
      .where("notification_status", "==", "unread")
      .where("user_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification["doc_id"] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({
          allNotifications: allNotifications,
        });
      });
  };

  updateMarkAsRead = (notification) => {
    db.collection("notifications").doc(notification.doc_id).update({
      notification_status: "read",
    });
  };

  onSwipeValueChange = (swipeData) => {
    var allNotifications = this.state.allNotifications;
    const { key, value } = swipeData;
    if (value < -Dimensions.get("window").width) {
      const newData = [allNotifications];
      this.updateMarkAsRead(allNotifications[key]);
      newData.splice(key, 1);
      this.setState({ allNotifications: newData });
    }
  };

  renderItem = (data) => (
    <Animated.View>
      <StatusBar hidden />

      <ListItem>
        <View>
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
                  backgroundColor: `rgb(${data.item.color})`,
                  marginRight: 8,
                }}
              />

              <ListItem.Title
                style={{
                  color: "#554A4C",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              >
                {data.item.notification_title}
              </ListItem.Title>
            </View>
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <ListItem.Subtitle
                style={{
                  color: "gray",
                  fontSize: 17,
                  marginLeft: 50,
                }}
              >
                {data.item.product_name} expires on {data.item.exp_date}
              </ListItem.Subtitle>
            </View>
          </View>
        </View>
      </ListItem>
    </Animated.View>
  );

  renderHiddenItem = (data) => (
    <View
      style={[styles.rowBack, { backgroundColor: `rgb(${data.item.color})` }]}
    >
      <View
        style={[
          styles.backRightBtn,
          styles.backRightBtnRight,
          { backgroundColor: `rgb(${data.item.color})` },
        ]}
      >
        <Text style={styles.backTextWhite}>Mark as read</Text>
      </View>
    </View>
  );

  componentWillUnmount() {
    this.notificationRef();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9, width: windowWidth }}>
          {this.state.allNotifications.length === 0 ? (
            <View>
              <View style={styles.goBackArrow}>
                <Icon
                  onPress={() => {
                    this.props.navigation.pop();
                  }}
                  style={{
                    marginLeft: 20,
                  }}
                  type="feather"
                  name="arrow-left"
                  size={30}
                  color="#000"
                />
              </View>
              <Text style={{ ...FONTS.h1, textAlign: "center", marginTop: 20 }}>
                No Notifications !
              </Text>
            </View>
          ) : (
            <View style={styles.container_2}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.pop();
                }}
                style={[
                  styles.goBackArrow,
                  {
                    marginLeft: 30,
                    marginTop: 0,
                    marginBottom: 30,
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
              >
                <Icon type="feather" name="arrow-left" size={30} color="#000" />
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
              <SwipeListView
                disableRightSwipe
                data={this.state.allNotifications}
                renderItem={this.renderItem}
                renderHiddenItem={this.renderHiddenItem}
                rightOpenValue={-Dimensions.get("window").width}
                previewRowKey={"0"}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onSwipeValueChange={this.onSwipeValueChange}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight,
    justifyContent: "center",
    alignItems: "center",
  },

  container_2: {
    flex: 1,
  },
  goBackArrow: {
    alignItems: "flex-start",
    margin: 10,
  },

  // for renderHiddenItem
  backTextWhite: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    alignSelf: "flex-start",
    marginRight: 10,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#05b2f7",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 100,
  },
  backRightBtnRight: {
    backgroundColor: "#05b2f7",
    right: 0,
    borderRadius: 10,
  },
});
