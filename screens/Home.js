import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import { Icon, Avatar } from "react-native-elements";
import firebase from "firebase";
import db from "../firebase/config";
import { LinearGradient } from "expo-linear-gradient";
import { windowHeight, windowWidth } from "../constants/Dimensions";
import * as ImagePicker from "expo-image-picker";
import ShelfCard from "./ShelfCard";

const Home = ({ navigation }) => {
  const specialPromoData = [
    {
      id: 1,
      img: images.promoBanner,
      title: "Bonus Cashback1",
      description: "Don't miss it. Grab it now!",
    },
    {
      id: 2,
      img: images.promoBanner,
      title: "Bonus Cashback2",
      description: "Don't miss it. Grab it now!",
    },
    {
      id: 3,
      img: images.promoBanner,
      title: "Bonus Cashback3",
      description: "Don't miss it. Grab it now!",
    },
    {
      id: 4,
      img: images.promoBanner,
      title: "Bonus Cashback4",
      description: "Don't miss it. Grab it now!",
    },
  ];

  const [specialPromos, setSpecialPromos] = React.useState(specialPromoData);
  const [name, setName] = React.useState("");
  const [image, setImage] = React.useState("#");

  useEffect(() => {
    getUserDetails();
    var email = firebase.auth().currentUser.email;
    fetchImage(email);
  }, []);

  const selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    var user_Id = firebase.auth().currentUser.email;
    if (!cancelled) {
      uploadImage(uri, user_Id);
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

  const getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("users")
      .where("email_id", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          setName(data.user_name);
        });
      });
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginVertical: SIZES.padding * 3,
        }}
      >
        <StatusBar hidden />
        <View style={{ flex: 1 }}>
          <Text style={{ ...FONTS.h1 }}>Hello!</Text>
          <Text style={{ ...FONTS.body2, color: COLORS.gray, marginLeft: 12 }}>
            {name === "" ? "Loading..." : <Text>{name}</Text>}
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => console.log("notification")}
            style={{
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon type="feather" name="bell" size={30} />
            <View
              style={{
                position: "absolute",
                top: -1,
                right: 1,
                height: 18,
                width: 18,
                backgroundColor: COLORS.red,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 10, color: "#fff" }}>99</Text>
            </View>
          </TouchableOpacity>
          <View style={{ marginLeft: 20 }}>
            {image === "#" ? (
              <Avatar
                rounded
                source={require("../assets/images/edit.png")}
                size="medium"
                onPress={() => selectPicture()}
                containerStyle={{
                  imageContainer: {
                    flex: 0.75,
                    marginTop: 50,
                    borderRadius: 20,
                    marginBottom: -80,
                  },
                }}
              />
            ) : (
              <Avatar
                rounded
                source={{
                  uri: image,
                }}
                size="medium"
                onPress={() => selectPicture()}
                containerStyle={{
                  imageContainer: {
                    flex: 0.75,
                    marginTop: 50,
                    borderRadius: 20,
                    marginBottom: -80,
                  },
                }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderBanner = () => {
    return (
      <View
        style={{
          height: 120,
          borderRadius: 20,
        }}
      >
        <Image
          source={images.banner}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
          }}
        />
      </View>
    );
  };

  const renderFeatures = () => {
    return (
      <View style={{ flexDirection: "column" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* AddScreen */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("AddScreen")}
          >
            <View
              style={{
                height: 50,
                width: 50,
                marginBottom: 5,
                borderRadius: 20,
                backgroundColor: COLORS.lightpurple,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon type="feather" name="plus" color="#6B3CE9" size={30} />
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Add
            </Text>
          </TouchableOpacity>
          {/* wallet */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => console.log("wallet")}
          >
            <View
              style={{
                height: 50,
                width: 50,
                marginBottom: 5,
                borderRadius: 20,
                backgroundColor: COLORS.lightyellow,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={icons.wallet}
                resizeMode="contain"
                style={{
                  height: 20,
                  width: 20,
                  tintColor: COLORS.yellow,
                }}
              />
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
                <Text style={{ fontSize: 10, color: "#fff" }}>99</Text>
              </View>
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Wallet
            </Text>
          </TouchableOpacity>
          {/* shelf */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => console.log("shelf")}
          >
            <View
              style={{
                height: 50,
                width: 50,
                marginBottom: 5,
                borderRadius: 20,
                backgroundColor: COLORS.lightGreen,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={icons.shelf}
                resizeMode="contain"
                style={{
                  height: 22,
                  width: 22,
                  tintColor: COLORS.green,
                }}
              />
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Shelves
            </Text>
          </TouchableOpacity>
          {/* graph */}
          <TouchableOpacity
            style={{
              marginBottom: SIZES.padding * 2,
              width: 60,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("Graph")}
          >
            <View
              style={{
                height: 50,
                width: 50,
                marginBottom: 5,
                borderRadius: 20,
                backgroundColor: COLORS.lightRed,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                type="feather"
                name="bar-chart-2"
                color="#FF4134"
                style={{
                  height: 20,
                  width: 20,
                }}
              />
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
                <Text style={{ fontSize: 10, color: "#fff" }}>99</Text>
              </View>
            </View>
            <Text
              style={{ textAlign: "center", flexWrap: "wrap", ...FONTS.body4 }}
            >
              Graph
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPromos = () => {
    const HeaderComponent = () => (
      <View>
        {renderHeader()}
        <View style={{ height: 400 }}>
          <ShelfCard />
        </View>
        {renderFeatures()}
      </View>
    );

    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{
          marginVertical: SIZES.base,
          width: SIZES.width / 2.5,
        }}
        onPress={() => console.log(item.title)}
      >
        <View
          style={{
            height: 80,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: COLORS.primary,
          }}
        >
          <Image
            source={images.promoBanner}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          />
        </View>

        <View
          style={{
            padding: SIZES.padding,
            backgroundColor: COLORS.lightGray,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <Text style={{ ...FONTS.h4 }}>{item.title}</Text>
          <Text style={{ ...FONTS.body4 }}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        ListHeaderComponent={HeaderComponent}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding * 3 }}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        data={specialPromos}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ marginBottom: 80 }}></View>}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      {renderPromos()}
    </SafeAreaView>
  );
};

export default Home;
