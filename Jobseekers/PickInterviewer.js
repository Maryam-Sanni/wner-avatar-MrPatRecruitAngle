import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Animated, TouchableOpacity, StyleSheet, Modal, Picker, TextInput } from 'react-native';
import OpenSchedule2 from '../components/JProfile';
import OpenModal from '../Jobseekers/NewInterview';
import {useFonts} from "expo-font"
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


function MyComponent({ onClose }) {
  const [scaleAnimations] = useState([...Array(12)].map(() => new Animated.Value(1)));
  const [modalVisible2, setModalVisible2] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [isDropdown, setIsDropdown] = useState(false);
  const [mainModalVisible, setMainModalVisible] = useState(true);
  const [formModalVisible, setformModalVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false); 
  const [cardData, setCardData] = useState({ combinedData: [] });
   const [selectedCategory, setSelectedCategory] = useState('');
  const [recommendedExpert, setRecommendedExpert] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0); 

  const handleOpenPress = () => {
    setMainModalVisible(false);
    setformModalVisible(true);
  };

  const handleCloseformModal = () => {
    setformModalVisible(false);
    onClose();
  };

  const toggleMode = () => {
    setIsDropdown(!isDropdown);
    setSelectedValue('');
    setSearch('');
  };

  const handleOpenPress2 = () => {
    setModalVisible2(true);
  };

  const handleCloseModal2 = () => {
    setModalVisible2(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get('https://recruitangle.com/api/expert/growthplan/getAllExpertsInterview', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log('Fetched data:', response.data); // Check the response structure
          setCardData(response.data);
        } else {
          console.error('Error fetching data:', response.statusText);
        }
        
    // Fetch recommended expert data
        const responseRecommended = await axios.get('https://recruitangle.com/api/jobseeker/get-chosen-expert-skill-analysis', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (responseRecommended.status === 200) {
          setRecommendedExpert(responseRecommended.data.GetChosenSkillAnalysis);
        } else {
          console.error('Error fetching recommended expert data:', responseRecommended.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
      }
    };

    fetchData();
  }, []);

  const renderRecommendedExpertCard = () => {
    if (!recommendedExpert) {
      return null; // Or a loading indicator if you prefer
    }

    const isSelected = selectedIndex === 0; 

    return (
      <Animated.View
        style={{
          width: '25%',
          paddingHorizontal: 5,
          marginBottom: 20,
          transform: [{ scale: scaleAnimations[0] }],
        }}
      >
        <TouchableOpacity
          onPress={() => handleCardPress(0)}
          style={{
            width: '100%',
            height: 320,
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            backgroundColor: "#d3f9d8",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              width: '90%',
              height: 100,
              borderRadius: 5,
              backgroundColor: "#F0FFF9",
              marginHorizontal: 10,
              marginTop: 20,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#206C00',
            }}
          >
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/96214782d7fee94659d7d6b5a7efe737b14e6f05a42e18dc902e7cdc60b0a37b' }}
            style={{ width: 50, height: 50, marginTop: 10 }}
          />
          <Text style={{ fontSize: 14, color: "black", fontWeight: 'bold' }}>
            {recommendedExpert.first_name}
          </Text>
          <Text style={{ fontSize: 12, color: "#206C00", marginBottom: 10 }}>
            {recommendedExpert.category}
          </Text>
          </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 18 }}>
          <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center', justifyContent: "center" }}>
            <Image
              source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6bba7edcb3f010b92084265108234b625f6a1e57053bb656b44878ce3a0ec09a?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
              style={{ width: 10, height: 10, marginTop: 5 }}
            />
            <Text style={{ fontSize: 10, color: '#206C00', marginLeft: 4, marginTop: 2 }}>Location</Text>
          </View>
          </View>
          </View>
          <Text style={{ fontSize: 14, textAlign: 'center', color: "black", marginTop: 20 }}>
            Available: {recommendedExpert.available_days.join(', ')}
          </Text>
          <Text style={{ fontSize: 14, color: "black", textAlign: 'center' }}>
            Time: {recommendedExpert.available_times}
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginTop: -60 }}>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: '#206C00',
                borderRadius: 5,
                backgroundColor: '#F0FFF9',
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginLeft: 10,
                alignSelf: "center",
                justifyContent: 'center',
              }}
            >
          <Text style={{ color: "#206C00", textAlign: 'center', fontSize: 12 }}>
            {t("Interview")}
          </Text>
          </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => handleCardPress(0)}  >
          <View style={{ marginRight: 10, marginLeft: 70, marginTop: 10 }}>
            <View style={styles.circle}>
          {isSelected && <View style={styles.filledCircle2} />}
            </View>
          </View>
             </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };
  
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

  const handleTogglePress = () => {
    setIsPressed(!isPressed); // Toggle the pressed state
  };


  const handleCardPress = async (index) => {
      setSelectedIndex(index); // Set the selected index

      try {
          let selectedUser;

          // If index is 0, it means the recommended expert is selected
          if (index === 0) {
              selectedUser = recommendedExpert;
          } else {
              selectedUser = cardData.combinedData[index - 1]; // Subtract 1 to match the combinedData index
          }

          // Check if selectedUser is available
          if (selectedUser) {
              const fullName = `${selectedUser.first_name} ${selectedUser.last_name}`;
              const expertid = `${selectedUser.user_id}`;
              const availabledays = selectedUser.available_days.join(', '); // Convert array to string
              const availabletimes = selectedUser.available_times;
             const category = `${selectedUser.category}`;

              // Save the selected user's data to AsyncStorage
              await AsyncStorage.setItem('selectedUserFirstName', selectedUser.first_name);
              await AsyncStorage.setItem('selectedUserLastName', selectedUser.last_name || ' ');
              await AsyncStorage.setItem('selectedUserExpertid', expertid);
              await AsyncStorage.setItem('selectedUserDays', availabledays);
              await AsyncStorage.setItem('selectedUserTimes', availabletimes);
             await AsyncStorage.setItem('selectedUserCategory', category);
          } else {
              console.error('Selected user is not available');
          }
      } catch (error) {
          console.error('Error saving data to AsyncStorage:', error);
      }
  };


    // Check the renderCards function to ensure it's correctly filtering based on `search`
    const renderCards = () => {
      const filteredData = cardData.combinedData.filter((data) => {
        const fullName = `${data.first_name} ${data.last_name}`.toLowerCase();
        const category = data.category.toLowerCase();
        const searchTerm = search.toLowerCase(); // search term should be lowercased for comparison

        return (
          (fullName.includes(searchTerm) || category.includes(searchTerm)) &&
          (selectedCategory === '' || category.includes(selectedCategory.toLowerCase()))
        );
      });

    if (filteredData.length === 0) {
      return (
        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, color: 'gray' }}>{t('No results found')}</Text>
        </View>
      );
    }

    return filteredData.map((data, index) => (
        <Animated.View
          key={index}
          style={{
            width: '25%',
            paddingHorizontal: 5,
            marginBottom: 20,
            transform: [{ scale: scaleAnimations[index + 1] }], 
          }}
          onMouseEnter={() => handleCardAnimation(index + 1, 1.05)} 
          onMouseLeave={() => handleCardAnimation(index + 1, 1)}
        >
        {/* Card content */}
        <TouchableOpacity 
          onPress={() => handleCardPress(index + 1)} // +1 
          style={{
            width: '100%',
            height: 320,
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
          <TouchableOpacity onPress={handleOpenPress2} onPressIn={handleTogglePress} onPressOut={handleTogglePress}>
            <View style={{ justifyContent: "center", width: '90%', height: 100, borderRadius: 5, backgroundColor: "#F0FFF9", marginRight: 15, marginLeft: 10, marginTop: 20, alignItems: 'center', borderWidth: 1, borderColor: '#206C00' }}>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Image
                  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/96214782d7fee94659d7d6b5a7efe737b14e6f05a42e18dc902e7cdc60b0a37b' }}
                  style={{ width: 50, height: 50, aspectRatio: 1, marginTop: 10, }}
                />
                <Text style={{ fontSize: 14, color: "black", fontWeight: 'bold', }}>
                   {data.first_name} {data.last_name} 
                </Text>
                <Text style={{ fontSize: 12, color: "#206C00", marginBottom: 10 }}>
                  {data.category}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 18, }}>
            <View style={{ flex: 1, }}>
              <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center', justifyContent: "center" }}>
                <Image
                  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6bba7edcb3f010b92084265108234b625f6a1e57053bb656b44878ce3a0ec09a?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
                  style={{ width: 10, height: 10, aspectRatio: 1, marginTop: 5, }}
                />
                <Text style={{ fontSize: 10, color: '#206C00', marginLeft: 4, marginTop: 2, }}>location</Text>
              </View>
            </View>
          </View>
          <Text style={{ fontSize: 14, textAlign: 'center', color: "black", marginTop: 20,fontFamily:"Roboto-Light"  }}> Available: {data.available_days.join(', ')}</Text>
          <Text style={{ fontSize: 14, color: "black", textAlign: 'center', fontFamily:"Roboto-Light" }}>
             Time: {data.available_times}
          </Text>
          <Text style={{ fontSize: 14, height: 40, color: "#d3f9d8", textAlign: 'center', fontFamily:"Roboto-Light" }}>
             {data.user_id}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#206C00',
                  borderRadius: 5,
                  backgroundColor: '#F0FFF9',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  marginLeft: 10,
                  alignSelf: "center",
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: "#206C00", alignText: 'center', fontSize: 12 }}>
                  {t("Interview")}
                </Text>
              </TouchableOpacity>
              
            </View>
            <View style={{ marginRight: 10, marginLeft: 70, marginTop: 10 }}>
                <View style={styles.circleContainer}>
                  <View style={[styles.circle, selectedIndex === index + 1 && styles.filledCircle ]} />
                </View>
              </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    ));
  };
  const [fontsLoaded]=useFonts({
    'Roboto-Light':require("../assets/fonts/Roboto-Light.ttf"),
  })
  const {t}=useTranslation()

  return (
        <View style={{ flex: 1, backgroundColor: "#F8F8F8", alignItems: 'center', marginTop: 40, }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.greenBox}>
              <View style={styles.header}>
                <Image
                  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1f2d38e99b0016f2bd167d2cfd38ff0d43c9f94a93c84b4e04a02d32658fb401?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }} // replace with your logo URL
                  style={styles.logo}
                />
                <Text style={styles.headerText}>{t("Interview Experts")}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={{ fontSize: 18, color: '#3F5637', fontWeight: 'bold',fontFamily:"Roboto-Light" }}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'flex-start', marginLeft: 40 }}>
                <Text style={{ fontSize: 16, color: "black", fontWeight: 'bold', marginTop: 5,fontFamily:"Roboto-Light" }}>{t("Pick an Expert to Interview you")}</Text>
                <Text style={{ fontSize: 14, color: "black", marginBottom: 10,fontFamily:"Roboto-Light" }}>{t("Use the search or the dropdown to filter")}</Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Picker
                    selectedValue={selectedCategory}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                  >
                    <Picker.Item label="All Categories" value="" />
                    <Picker.Item label="SAP" value="SAP" />
                    <Picker.Item label="Microsoft" value="Microsoft" />
                    <Picker.Item label="Salesforce" value="Salesforce" />
                    <Picker.Item label="Frontend Development" value="Frontend Development" />
                    <Picker.Item label="Backend Development" value="Backend Development" />
                    <Picker.Item label="UI/UX" value="UI/UX" />
                    <Picker.Item label="Data Analysis" value="Data Analysis" />
                    <Picker.Item label="Cloud Computing" value="Cloud Computing" />
                    <Picker.Item label="Management" value="Management" />
                  </Picker>
                  <TextInput
                    placeholder={t("Search")}
                    style={styles.input}
                    value={search} // Add this line to bind the TextInput value to the state
                    onChangeText={(text) => setSearch(text)} // This updates the search state
                  />
                </View>
              </View>
              <Text style={{ fontSize: 15, color: "black", marginBottom: 10, marginTop: 30, marginLeft: 40, fontWeight: 'bold' }}>
                {t("Recommended for you")}  <Text style={{ fontSize: 15, color: '#000' }}>↓</Text>
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginLeft: 30, marginRight: 30 }}>
                {renderRecommendedExpertCard()}
                {renderCards()}
              </View>
              <TouchableOpacity onPress={handleOpenPress} style={styles.buttonplus}>
                <Text style={styles.buttonTextplus}>{t("Continue")}</Text>
              </TouchableOpacity>
            </View>
       


      <Modal
        animationType="slide"
        transparent={true}
        visible={formModalVisible}
        onRequestClose={handleCloseformModal}
      >
        <View style={styles.modalContent}>
          <OpenModal onClose={handleCloseformModal} />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={handleCloseModal2}
      >
        <View style={styles.modalContent}>
          <OpenSchedule2 onClose={() => handleCloseModal2()} />
        </View>
      </Modal>
          </ScrollView>
          </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  greenBox: {
    width: 920,
    height: '100%',
    backgroundColor: '#F8F8F8',
  },
  buttonplus: {
    backgroundColor: 'coral',
    borderRadius: 5,
    padding: 5,
    alignSelf: 'flex-end',
    width: 150,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    marginRight: 30,
  },
  buttonTextplus: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily:"Roboto-Light"
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F5637',
    fontFamily:"Roboto-Light"
  },
  dropcontainer: {
    justifyContent: 'center',
    width: 400,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 500,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: 'white',
    fontSize: 16,
  },
  picker: {
    width: 630,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 20,
  },
  iconContainer: {
    padding: 8,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#206C00',
    backgroundColor: 'transparent',
  },
  filledCircle: {
    backgroundColor: 'black',
  },
  filledCircle2: {
    width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: '#206C00',
      marginTop: -3,
    marginLeft: -3,
    backgroundColor: 'black',
  },
});


export default MyComponent;

