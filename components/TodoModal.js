import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import db from "../firebase/config";
import firebase from "firebase";

export default class TodoModal extends Component {
  state = {
    newTodo: "",
    docId: this.props.docId,
  };

  toggleTodoComplete = (index) => {
    let list = this.props.list;
    db.collection("tasks")
      .doc(this.state.docId)
      .update({
        todos: {
          index: { completed: true },
        },
      });
    // list.todos[index].completed = !list.todos[index].completed;
    // this.props.updateList(list);

    // db.collection("todos")
    //   .doc(this.state.docId)
    //   .update(
    //     { todos: [{completed: true }] },
    //     { merge: true }
    //   );
  };

  addTodo = () => {
    db.collection("todos")
      .doc(this.state.docId)
      .update({
        todos: firebase.firestore.FieldValue.arrayUnion({
          title: this.state.newTodo,
          completed: false,
        }),
      });
    this.setState({ newTodo: "" });
    Keyboard.dismiss();
  };

  renderTodos = (todo, index) => {
    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={() => this.toggleTodoComplete(index)}>
          <Ionicons
            name={todo.completed ? "ios-square" : "ios-square-outline"}
            size={24}
            color={COLORS.todoGray}
            style={{ width: 32 }}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.todo,
            {
              color: todo.completed ? COLORS.todoGray : COLORS.black,
              textDecorationLine: todo.completed ? "line-through" : "none",
            },
          ]}
        >
          {todo.title}
        </Text>
      </View>
    );
  };

  render() {
    const list = this.props.list;
    const taskCount = list.todos.length;
    const completedCount = list.todos.filter((todo) => todo.completed).length;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            style={{ position: "absolute", top: 64, right: 32, zIndex: 10 }}
            onPress={this.props.closeModal}
          >
            <AntDesign name="close" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <View
            style={[
              styles.section,
              styles.header,
              { borderBottomColor: list.color },
            ]}
          >
            <Text style={styles.title}>{list.name}</Text>
            <Text style={styles.taskCount}>
              {completedCount} of {taskCount}
            </Text>
          </View>
          <View style={[styles.section, { flex: 3 }]}>
            <FlatList
              data={list.todos}
              renderItem={({ item, index }) => this.renderTodos(item, index)}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={{
                paddingHorizontal: 32,
                paddingVertical: 64,
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={[styles.section, styles.footer]}>
            <TextInput
              style={[styles.input, , { borderColor: list.color }]}
              onChangeText={(text) => this.setState({ newTodo: text })}
              value={this.state.newTodo}
            />
            <TouchableOpacity
              style={[styles.addTodo, { backgroundColor: list.color }]}
              onPress={() => this.addTodo()}
            >
              <AntDesign name="plus" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    flex: 1,
    alignSelf: "stretch",
  },
  header: {
    justifyContent: "center",
    marginLeft: 64,
    borderBottomWidth: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.black,
  },
  taskCount: {
    color: COLORS.todoGray,
    marginTop: 4,
    fontWeight: "600",
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  todoContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  todo: {
    color: COLORS.black,
    fontWeight: "700",
    fontSize: 16,
  },
});
