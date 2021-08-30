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
      today: 0,
    };
  }

  graphView = () => {
    return (
      <View style={{ alignSelf: "center", marginTop: 30 }}>
        <LineChart
          data={{
            labels: ["1", "2", "3", "4", "5", "6", "7"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
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
          width={windowWidth - 50}
          height={220}
          yAxisLabel="₹ "
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2,
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
          <Text>Bar Graph</Text>
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
