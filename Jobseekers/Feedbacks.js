import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, ImageBackground } from 'react-native';
import Topbar from '../components/topbar';
import Sidebar from '../components/sidebar';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { useTranslation } from 'react-i18next';


function MyComponent() {
  const [scaleAnimations] = useState([...Array(8)].map(() => new Animated.Value(1)));
  const navigation = useNavigation(); // Get the navigation object

  const handleFeedbackPress = () => {
    navigation.navigate('SendFeedback'); // Navigate to the "SendFeedback" page
  };

  const handleViewFeedbackPress = () => {
    navigation.navigate('ViewFeedback'); // Navigate to the "ViewFeedback" page
  };
  
 
  // Sample data for the cards
  const cardData = [
    {
      date: "Tue. 12-07-2024",
      time: "09:30AM - 12:30PM",
      
      expert: "Emily Ray",
      job: "Data Analyst",
      fee: "$50.00"
    },
    {
    date: "Fri. 12-07-2024",
      time: "02:00PM - 03:00PM",
      
      expert: "John Smith",
      job: "UI/UX Designer",
      fee: "$30.00"
    },
     {
    date: "Mon. 12-07-2024",
      time: "09:00PM - 10:30PM",
      
      expert: "Fisayo Fosudo",
      job: "Java Engineer",
      fee: "$50.00"
    },
    {
    date: "Tue. 12-07-2024",
    time: "02:00PM - 04:00PM",
    
    expert: "John Smith",
    job: "Dev Ops",
    fee: "$40.00"
  },
   {
    date: "Wed. 12-07-2024",
    time: "02:00PM - 04:00PM",
    
    expert: "Vee Venice",
    job: "SAP FI",
    fee: "$40.00"
  },
    {
    date: "Thur. 12-07-2024",
      time: "09:00AM - 12:00PM",
      
      expert: "Will Cooper",
      job: "Backend Dev.",
      fee: "$50.00"
    },
    {
    date: "Mon. 12-07-2024",
    time: "02:00PM - 04:00PM",
    
    expert: "John Smith",
    job: "Frontend Dev.",
    fee: "$40.00"
  },
   {
    date: "Tue. 12-07-2024",
    time: "02:00PM - 04:00PM",
    
    expert: "John Smith",
    job: "Dev Ops",
    fee: "$40.00"
  },
   {
    date: "Wed. 12-07-2024",
    time: "02:00PM - 04:00PM",
    
    expert: "Vee Venice",
    job: "SAP FI",
    fee: "$40.00"
  },
  ];

  const handleCardAnimation = (index, toValue) => {
    Animated.timing(
      scaleAnimations[index],
      {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  };

  const handleJoinHub = () => {
    setModalVisible(true);
  };

  

  const renderCards = () => {
    return cardData.map((data, index) => (
      <Animated.View
        key={index}
        style={{
          width: '25%',
          paddingHorizontal: 5,
          marginBottom: 20,
          transform: [{ scale: scaleAnimations[index] }],
        }}
        onMouseEnter={() => handleCardAnimation(index, 1.05)}
        onMouseLeave={() => handleCardAnimation(index, 1)}
      >
        {/* Card content */}
        <View
          style={{
            width: '95%',
            height: 300,
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            backgroundColor: "#d3f9d8",
            
          }}
        >
          <View style={{ justifyContent: "center", width: 180, height: 100, borderRadius: 5, backgroundColor: "#F0FFF9", marginRight: 10, marginLeft: 10, marginTop: 20,  alignItems: 'flex-start', alignContent: 'center' }}>
          <View style={{ flexDirection: 'row'}}>
           <Image
              source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/96214782d7fee94659d7d6b5a7efe737b14e6f05a42e18dc902e7cdc60b0a37b' }}
              style={{ width: 50, aspectRatio: 1, marginLeft: 10, marginTop: -5  }}
            />
            <View style={{ flexDirection: 'column'}}>
 <Text style={{ fontSize: 16, color: "black", fontWeight: 'bold', marginLeft: 10, }}>
              {data.expert} 
            </Text>
            <Text style={{ fontSize: 13, color: "#206C00",  marginLeft: 10, }}>
              {data.job}
            </Text>
            </View>
</View>
</View>
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10, }}>
            <View style={{ flex: 1 , }}>
            <Text style={{ fontSize: 12, color: "#888", marginTop: 15, }}> Interview Date</Text>
              <Text style={{ fontSize: 16, color: "#206C00", fontWeight: '600', }}>{data.date}</Text>
               <Text style={{ fontSize: 12, color: "#888", marginTop: 15, }}> Interview Time</Text>
              <Text style={{ fontSize: 16, color: "#206C00", fontWeight: '600' }}>
                 {data.time}
              </Text>
            </View>
          </View>
         
            <Text style={{ fontSize: 12, color: "#888", marginTop: 15, }}>{data.description}</Text>
            
    
          <TouchableOpacity
            style={{
              backgroundColor: "coral",
              borderRadius: 5,
              paddingHorizontal: 30,
              paddingVertical: 5,
              marginTop: 20,
              alignSelf: "center",
              justifyContent: 'center',
              marginLeft: 10, marginRight: 10,
            }}
            onPress={handleViewFeedbackPress}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold", alignText: 'center', fontSize: 14}}>
             View Feedback
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    ));
  };

  const [fontsLoaded]=useFonts({
    "Roboto-Light":require("../assets/fonts/Roboto-Light.ttf"),
      })
      const {t}=useTranslation()

  return (
    <ImageBackground
    source={require ('../assets/Background.png') }
  style={{ height: '150%', width: '100%',flex: 1}}
>
<BlurView intensity={100} style={{flex:1}}>
    <View style={{ flex: 1 }}>
      <Topbar />
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Sidebar />
        <ScrollView contentContainerStyle={{ flexGrow: 1, maxHeight: 500 }}>
          <View style={{ flex: 1, paddingHorizontal: 8, paddingTop: 8, paddingBottom: 20, marginLeft: 300, marginRight: 130, marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 10, marginTop: 20 }}>
              <View style={{ justifyContent: "flex-end", paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5, backgroundColor: "#d3f9d8", borderWidth: 1, borderColor: '#206C00' }}>
                <Text style={{ fontWeight: "bold", fontSize: 14, color: "#206C00",fontFamily:"Roboto-Light" }}>{t("Received")}</Text>
                </View>
                <Text style={{ fontSize: 14, marginLeft: 25, marginTop: 5, color:'#d3f9d8', fontWeight: 'bold',fontFamily:"Roboto-Light" }}>{t("Sent")}</Text>
              </View>
              <TouchableOpacity style={{ marginTop: 7, marginRight: 20, justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 4, fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF', backgroundColor: 'coral', borderRadius: 3 }}
              onPress={handleFeedbackPress } >
                <Text style={{ fontSize: 14, color: "white", fontFamily:"Roboto-Light" }}>{t("Give Feedback")}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
              {renderCards()}
            </View>
          </View>
        </ScrollView>
      </View>
      
    </View>
    </BlurView>
    </ImageBackground>
  );
}

export default MyComponent;
