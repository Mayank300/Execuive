import moment from "moment";
import * as React from "react";
import {
  StatusBar,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
const { width } = Dimensions.get("screen");
import {
  FlingGestureHandler,
  Directions,
  State,
} from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { windowWidth } from "../constants/Dimensions";

const DATA = [
  {
    id: "1",
    title: "Total Products",
    subTitle: "Total Products In\nThe Inventory",
    poster:
      "https://images.pexels.com/photos/279618/pexels-photo-279618.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "2",
    title: "Total Cost",
    subTitle: "Total Cost Of\nInventory",
    poster:
      "https://images.unsplash.com/photo-1572734389279-e4fa423ca9db?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=631&q=80",
  },
  {
    id: "3",
    title: "Product Expired",
    subTitle: "Total Product\nExpired",
    poster:
      "https://images.unsplash.com/photo-1573584355722-20b870da775f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=359&q=80",
  },
  {
    id: "4",
    title: "Product Consumed",
    subTitle: "Total Product\nSold",
    poster:
      "https://images.unsplash.com/photo-1515542706656-8e6ef17a1521?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
  },
];

const OVERFLOW_HEIGHT = 70;
const SPACING = 10;
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH - 20;
const VISIBLE_ITEMS = 3;

const OverflowItems = ({ data, scrollXAnimated }) => {
  const inputRange = [-1, 0, 1];
  const translateY = scrollXAnimated.interpolate({
    inputRange,
    outputRange: [OVERFLOW_HEIGHT, 0, -OVERFLOW_HEIGHT],
  });
  return (
    <View style={styles.overflowContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {data.map((item, index) => {
          return (
            <View key={index} style={styles.itemContainer}>
              <Text style={[styles.title]} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
};

const ShelfCard = ({
  navigation,
  totalProducts,
  totalCost,
  totalExpiry,
  totalProductSold,
}) => {
  const [data, setData] = React.useState(DATA);
  const scrollXIndex = React.useRef(new Animated.Value(0)).current;
  const scrollXAnimated = React.useRef(new Animated.Value(0)).current;
  const [index, setIndex] = React.useState(0);
  const [cost, setCost] = React.useState(0);
  const [sold, setSold] = React.useState([]);
  const [expiredProductList, setExpiredProductList] = React.useState([]);

  const setActiveIndex = React.useCallback((activeIndex) => {
    scrollXIndex.setValue(activeIndex);
    setIndex(activeIndex);
  });

  React.useEffect(() => {
    if (index === data.length - VISIBLE_ITEMS - 1) {
      const newData = [...data, ...data];
      setData(newData);
    }
  });

  React.useEffect(() => {
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
    }).start();
  });

  React.useEffect(() => {
    var productCostString = totalCost;
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
  });

  const navFunction = () => {
    console.log("pressed");
  };

  return (
    <FlingGestureHandler
      key="left"
      direction={Directions.LEFT}
      onHandlerStateChange={(ev) => {
        if (ev.nativeEvent.state === State.END) {
          if (index === data.length - 1) {
            return;
          }
          setActiveIndex(index + 1);
        }
      }}
    >
      <FlingGestureHandler
        key="right"
        direction={Directions.RIGHT}
        onHandlerStateChange={(ev) => {
          if (ev.nativeEvent.state === State.END) {
            if (index === 0) {
              return;
            }
            setActiveIndex(index - 1);
          }
        }}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar hidden />
          <OverflowItems data={data} scrollXAnimated={scrollXAnimated} />
          <FlatList
            data={data}
            keyExtractor={(_, index) => String(index)}
            horizontal
            inverted
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
            }}
            scrollEnabled={false}
            removeClippedSubviews={false}
            CellRendererComponent={({
              item,
              index,
              children,
              style,
              ...props
            }) => {
              const newStyle = [style, { zIndex: data.length - index }];
              return (
                <View style={newStyle} index={index} {...props}>
                  {children}
                </View>
              );
            }}
            renderItem={({ item, index }) => {
              const inputRange = [index - 1, index, index + 1];
              const translateX = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [50, 0, -100],
              });
              const scale = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [0.8, 1, 1.3],
              });
              const opacity = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
              });

              return (
                <TouchableOpacity onPress={() => navFunction()}>
                  <Animated.View
                    style={{
                      position: "absolute",
                      left: -ITEM_WIDTH / 2,
                      opacity,
                      transform: [
                        {
                          translateX,
                        },
                        { scale },
                      ],
                    }}
                  >
                    <Image
                      source={{ uri: item.poster }}
                      style={{
                        width: ITEM_WIDTH,
                        height: ITEM_HEIGHT,
                        borderRadius: 14,
                      }}
                    />

                    {item.id === "1" ? (
                      <View style={styles.imageText}>
                        <Text style={styles.subText}>{totalProducts}</Text>
                      </View>
                    ) : null}

                    {item.id === "2" ? (
                      <View style={styles.imageText2}>
                        <Text numberOfLines={1} style={styles.subText}>
                          {cost}
                        </Text>
                      </View>
                    ) : null}

                    {item.id === "3" ? (
                      <View style={[styles.imageText, { borderColor: "#000" }]}>
                        <Text style={[styles.subText, { color: "#000" }]}>
                          {totalExpiry}
                        </Text>
                      </View>
                    ) : null}

                    {item.id === "4" ? (
                      <View style={styles.imageText}>
                        <Text style={styles.subText}>{totalProductSold}</Text>
                      </View>
                    ) : null}

                    <Text style={styles.imageSubText}>{item.subTitle}</Text>
                  </Animated.View>
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
};

export default ShelfCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -1,
  },
  itemContainer: {
    height: OVERFLOW_HEIGHT,
    marginLeft: SPACING * 1.4,
  },
  itemContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overflowContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: "hidden",
  },
  imageText: {
    position: "absolute",
    top: 30,
    right: 30,
    borderWidth: 1,
    borderRadius: 20,
    width: 40,
    height: 40,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  imageText2: {
    position: "absolute",
    top: 30,
    right: 20,
    height: 40,
    width: windowWidth / 1.5,
    height: 40,
    justifyContent: "center",
  },
  imageSubText: {
    position: "absolute",
    top: 180,
    left: 20,
    color: "#fff",
    fontWeight: "bold",
    fontSize: RFValue(23),
  },
  subText: {
    textAlign: "right",
    color: "#fff",
    fontWeight: "bold",
    fontSize: RFValue(23),
  },
});
