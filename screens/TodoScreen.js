import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../constants/theme";
import { AntDesign, Feather } from "@expo/vector-icons";
import TodoList from "../components/TodoList";
import AddListModal from "../components/AddListModal";
import db from "../firebase/config";
import firebase from "firebase";
import { windowWidth } from "../constants/Dimensions";
export class TodoScreen extends Component {
  state = { addTodoVisible: false, lists: [], user: {}, loading: true };

  componentDidMount() {
    this.getUserDetails();
    this.getTodo();
  }

  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("users")
      .where("email_id", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            user: data,
          });
        });
      });
  };

  getTodo = () => {
    var email = firebase.auth().currentUser.email;

    let ref = db
      .collection("todos")
      .where("user_id", "==", email)
      .onSnapshot((snapshot) => {
        var list = [];
        snapshot.docs.map((doc) => {
          var todo = doc.data();
          todo["doc_id"] = doc.id;
          list.push(todo);
        });
        this.setState({ lists: list, loading: false });
      });
  };

  toggleAddTodoModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  }

  renderList = (list) => {
    return <TodoList list={list} />;
  };

  addList = (list) => {
    var randomNum = Math.random().toString(36).substring(7);
    this.setState({
      lists: [...this.state.lists, { ...list, id: randomNum, todos: [] }],
    });
    this.addListToDatabase();
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator color={COLORS.blue} size="large" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          visible={this.state.addTodoVisible}
          onRequestClose={() => this.toggleAddTodoModal()}
        >
          <AddListModal closeModal={() => this.toggleAddTodoModal()} />
        </Modal>
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
        <View style={{ flexDirection: "row" }}>
          <View style={styles.divider} />
          <Text style={styles.title}>
            Todo{" "}
            <Text style={{ fontWeight: "300", color: COLORS.blue }}>Lists</Text>
          </Text>
          <View style={styles.divider} />
        </View>
        <View style={{ marginVertical: 48 }}>
          <TouchableOpacity
            style={styles.addList}
            onPress={() => this.toggleAddTodoModal()}
          >
            <AntDesign name="plus" size={16} color={COLORS.blue} />
          </TouchableOpacity>
          <Text style={styles.add}>Add List</Text>
        </View>

        <View style={{ height: 275, paddingLeft: 32 }}>
          <FlatList
            data={this.state.lists}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => this.renderList(item)}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    );
  }
}

export default TodoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  divider: {
    backgroundColor: COLORS.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.blackTodo,
    paddingHorizontal: 64,
  },
  addList: {
    borderWidth: 2,
    borderColor: COLORS.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: COLORS.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
});
