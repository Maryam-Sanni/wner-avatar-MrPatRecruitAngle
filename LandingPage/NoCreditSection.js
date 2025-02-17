import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Button,
  TouchableOpacity,
} from "react-native";
import Title from "../components/Title";
import Row from "../components/Row";

const NoCreditSection = () => {
  return (
    <ImageBackground
      source={require("../assets/noCreditImage.png")}
      style={styles.imageBackground}
    >
      <View style={styles.footerContainer}>
        <Row style={{ marginTop: 35, marginBottom: 7 }}>
          <Title
            textSize={24}
            textColor={"#F5F5F5"}
             textWeight={"400"}
            title={"Back your employees to success with "}
          />
          <Text
            style={{
              textDecorationLine: "underline",
              fontSize: 24,
              color: "lightgreen",
            }}
          >
            anglequest.com
          </Text>
        </Row>
        <Title
          textColor={"#CCC"}
          center
          textWeight={"400"}
          textSize={18}
          title={"No credit card needed, pay as you use."}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: "100%",
    height: 500,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  footerContainer: {
    marginTop: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    color: "white",
    fontSize: 30,
    marginTop: 220,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});

export default NoCreditSection;
