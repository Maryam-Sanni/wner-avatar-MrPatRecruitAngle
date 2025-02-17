import { View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

import MainButtons from "../LandingPage/MainButton";
import Title from "./Title";

const SmallCards = ({
  top,
  left,
  right,
  title,
  icon,
  onPress,
  front,
  desc,
}) => {
  return (
    <View
      style={{
        width: 300,
        height: front ? 300 : 350,
        paddingHorizontal: 30,
        paddingVertical: 20,
        backgroundColor: front ? "transparent" : "#37754F",
        zIndex: front ? 2 : 1,
        position: "absolute",
        top: top,
        left: left,
        right: right,
      }}
    >
      <View
        style={{
          backgroundColor: "#F5F5F5",
          padding: 16,
          gap: 16,
          borderRadius: 4,
          shadowColor: "#135837",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 10,
        }}
      >
        <View style={{ gap: 16, alignItems: "center" }}>
          {icon ? (
            icon
          ) : (
            <AntDesign name="arrowright" size={20} color="#135837" />
          )}
          <Title
            title={title}
            textSize={16}
            fontWeight={600}
            center
          />
          <Title
            title={desc}
            textSize={14}
            center
          />
        </View>
        <View
          style={{
            backgroundColor: "#ccc",
            height: 1,
            width: "100%",
          }}
        />
        <MainButtons
          title={"Start Now"}
          bgColor={"#F5F5F5"}
          width={"100%"}
          onPress={onPress}
          textColor={"#135837"}
          style={{ padding: 8 }}
          icon={<AntDesign name="arrowright" size={14} color="#135837" />}
        />
      </View>
    </View>
  );
};

export default SmallCards;