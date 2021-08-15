import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

export class BillScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: "week",
    };
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

    return (
      <Animatable.View animation={fadeIn} style={styles.animatableView}>
        {/* month */}
        {this.state.selectedDate === "month" ? (
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Month</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => this.setState({ selectedDate: "month" })}
            style={styles.notSelectButton}
          >
            <Text style={styles.notSelectButtonText}>Month</Text>
          </TouchableOpacity>
        )}

        {/* week */}
        {this.state.selectedDate === "week" ? (
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Week</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => this.setState({ selectedDate: "week" })}
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
            onPress={() => this.setState({ selectedDate: "day" })}
            style={styles.notSelectButton}
          >
            <Text style={styles.notSelectButtonText}>Day</Text>
          </TouchableOpacity>
        )}
      </Animatable.View>
    );
  };

  graphView = () => {
    return (
      <View style={{ alignSelf: "center", marginTop: 30 }}>
        {/* <BarChart
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [20, 45, 28, 80, 99, 43],
              },
            ],
          }}
          width={windowWidth - 60}
          height={220}
          yAxisLabel={"Rs"}
          chartConfig={{
            backgroundColor: "#1cc910",
            backgroundGradientFrom: "#eff3ff",
            backgroundGradientTo: "#efefef",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        /> */}
        <LineChart
          data={{
            labels: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Suday",
            ],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
              },
            ],
          }}
          width={windowWidth - 50} // from react-native
          height={220}
          yAxisLabel="₹ "
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          {this.renderSelectionButton()}
        </View>
        <View style={styles.graphContainer}>
          <ScrollView>{this.graphView()}</ScrollView>
        </View>
      </View>
    );
  }
}

export default BillScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: "center",
    marginTop: Platform.OS === "ios" ? 50 : 10,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  animatableView: {
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
