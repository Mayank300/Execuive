import React from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";

import { Icon } from "react-native-elements";
import { windowHeight, windowWidth } from "./Dimensions";

export default class ModalView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: this.props.productName,
      //   notesText: "",
      isModalVisible: this.props.status,
    };
  }

  handleModalVisible = () => {
    const { isModalVisible } = this.state;
    this.setState({
      isModalVisible: !isModalVisible,
    });
  };

  render() {
    {
      this.state.isModalVisible ? (
        <View>
          <Modal
            transparent={true}
            animationType="fade"
            visible={this.state.isModalVisible}
          >
            <View style={styles.modalCardContainer}>
              <View style={styles.taskContainer}>
                <View style={styles.ModalDetails}>
                  <View style={styles.ModalHead}>
                    <Text
                      style={{
                        color: "#9CAAC4",
                        fontSize: 16,
                        fontWeight: "600",
                        marginBottom: 10,
                      }}
                    >
                      Title
                    </Text>
                    <TextInput
                      editable={false}
                      selectTextOnFocus={false}
                      style={[
                        styles.title,
                        // { borderColor: `rgb(${selectedTask.task_color})` },
                      ]}
                      //   value={selectedTask.task_title}
                    />
                  </View>
                  <View style={styles.hideModalPosition}>
                    <TouchableOpacity
                      onPress={() => this.handleModalVisible()}
                      style={styles.hideModal}
                    >
                      <Icon type="feather" name="x" size={28} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#BDC6D8",
                    marginVertical: 10,
                  }}
                >
                  Suggestion
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.readBook}>
                    <Text style={{ textAlign: "center", fontSize: 14 }}>
                      Read book
                    </Text>
                  </View>
                  <View style={styles.design}>
                    <Text style={{ textAlign: "center", fontSize: 14 }}>
                      Design
                    </Text>
                  </View>
                  <View style={styles.learn}>
                    <Text style={{ textAlign: "center", fontSize: 14 }}>
                      Learn
                    </Text>
                  </View>
                </View>
                <View style={styles.notesContent} />
                <View>
                  <Text
                    style={{
                      color: "#9CAAC4",
                      fontSize: 16,
                      fontWeight: "600",
                      marginBottom: 10,
                    }}
                  >
                    Notes
                  </Text>
                  <TextInput
                    editable={false}
                    selectTextOnFocus={false}
                    style={[
                      styles.title,
                      //   { borderColor: `rgb(${selectedTask.task_color})` },
                    ]}
                    // value={selectedTask.task_notes}
                  />
                </View>
                <View style={styles.sepeerator} />
                <View>
                  <Text
                    style={{
                      color: "#9CAAC4",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Time
                  </Text>

                  <TextInput
                    editable={false}
                    selectTextOnFocus={false}
                    style={[
                      styles.title,
                      //   { borderColor: `rgb(${selectedTask.task_color})` },
                    ]}
                    // value={selectedTask.task_time}
                  />
                </View>
                <View style={styles.sepeerator} />
                <View>
                  <Text
                    style={{
                      color: "#9CAAC4",
                      fontSize: 16,
                      fontWeight: "600",
                      marginBottom: 10,
                    }}
                  >
                    Date
                  </Text>
                  <TextInput
                    editable={false}
                    selectTextOnFocus={false}
                    style={[
                      styles.title,
                      //   { borderColor: `rgb(${selectedTask.task_color})` },
                    ]}
                    // onChangeText={(text) => {
                    //   const prevSelectedTask = { ...selectedTask };
                    //   prevSelectedTask.task_date = text;
                    //   this.setState({
                    //     selectedTask: prevSelectedTask,
                    //   });
                    // }}
                    // value={selectedTask.task_date}
                    placeholder="Enter date."
                  />
                </View>

                <View style={styles.modalFoot}>
                  <TouchableOpacity
                    onPress={() => {
                      //   this.handleDeleteNotification(selectedTask.task_title);
                      //   this.deleteTask(selectedTask.id);
                      this.setState({
                        isModalVisible: false,
                      });
                    }}
                  >
                    <Icon type="feather" name="trash-2" size={35} />
                  </TouchableOpacity>
                </View>

                {/*  */}
              </View>
            </View>
          </Modal>
        </View>
      ) : null;
    }
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
  taskListContent: {
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
