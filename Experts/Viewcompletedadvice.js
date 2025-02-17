import { useFonts } from 'expo-font';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomAlert from '../components/CustomAlert';
import { MaterialIcons } from '@expo/vector-icons';

function MyComponent({ onClose }) {
  const [topics, setTopics] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [remark, setRemark] = useState('');
  const [rating, setRating] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('')     
  const [isVisible, setIsVisible] = useState(true); 
  const [data, setData] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [rated, setRated] = useState(0);

  const getRatingText = (rated) => {
    switch (rated) {
      case 0: return 'No Rating Yet';
      case 1: return 'Very Dissatisfied';
      case 2: return 'Dissatisfied';
      case 3: return 'Somewhat Dissatisfied';
      case 4: return 'Slightly Dissatisfied';
      case 5: return 'Neutral';
      case 6: return 'Somewhat Satisfied';
      case 7: return 'Satisfied';
      case 8: return 'Very Satisfied';
      case 9: return 'Extremely Satisfied';
      case 10: return 'Completely Satisfied';
      default: return 'No Rating Yet';
    }
  };

  const apiUrl = process.env.REACT_APP_API_URL;
  
  const [fontsLoaded]=useFonts({
    "Roboto-Light":require("../assets/fonts/Roboto-Light.ttf"),
        })
        const {t}=useTranslation()

  const handlePress = () => {

    onClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const retrievedData = await AsyncStorage.getItem('selectedMeeting');
        if (retrievedData) {
          const parsedData = JSON.parse(retrievedData);
          setData(parsedData); 
          setRated(parseInt(parsedData.rating_figure, 10));// Update the state with the retrieved data
        } else {
          console.log('No data found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Failed to retrieve data from AsyncStorage', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await axios.get(`${apiUrl}/api/expert/skillAnalysis/get`, {
          headers: { Authorization: `Bearer ${token}` }
        });

    if (response.status === 200) {
                const data = response.data.SkillAnalysis; // Access the SkillAnalysis property
              setTopics(data.topics || []);
            } else {
                console.error('Failed to fetch data', response);
            }
        } catch (error) {
            console.error('Failed to load form data', error);
        }
    };

  const retrieveExpertName = async () => {
  try {
    const storedFirstName = await AsyncStorage.getItem('first_name');
    const storedLastName = await AsyncStorage.getItem('last_name');
    if (storedFirstName && storedLastName) {
      setFirstName(storedFirstName);
      setLastName(storedLastName);
    }
  } catch (error) {
    console.error('Error retrieving data from AsyncStorage:', error);
  }
  };

  loadFormData();
  retrieveExpertName();
  }, []);


  const handleTopicChange = (index, field, value) => {
    const newTopics = [...topics];
    newTopics[index] = { ...newTopics[index], [field]: value };
    setTopics(newTopics);
  };

  const handleMarkAsCompleted = async () => {
  if (!remark || !topics || !rating ) {
    setAlertMessage(t('Please fill all fields'));
    setAlertVisible(true);
    return;
  }

    setIsChecked(!isChecked);

  try {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const payload = {
     jobseeker_id: String(37), // Convert jobseeker_id to a string
    remark: remark,
    expert_name: `${firstName} ${lastName}`,
    rating: rating,
      role: data?.role,
    types: data?.type,
    starting_level: data?.starting_level,
    target_level: data?.target_level,
    date: data?.date_time,
    expert: data?.expert_name,
    descriptions: topics.map(topic => ({
      description: topic.topic,
      percentage: topic.percentage,
    })),
  };

  const response = await axios.post(`${apiUrl}/api/expert/feedback-skillAnalysis`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 201 && response.data.status === 'success') {
    console.log('Marked as completed successfully');
    setAlertMessage(t('Remark updated successfully'));
  } else {
    console.error('Failed to mark as completed', response);
    setAlertMessage(t('Remark failed to update'));
  }
  } catch (error) {
  console.error('Error marking as completed', error);
  }
  setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  if (!isVisible) {
    return null; // Return null to unmount the parent component
  }



  return (
    <View style={{ flex: 1, backgroundColor: "#F8F8F8", marginTop: 40, alignItems: 'center'  }}>
       <ScrollView contentContainerStyle={{ flexGrow: 1, maxHeight: 500 }}>
<View style={styles.greenBox}>
<View style={styles.header}>
          <Image
            source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1f2d38e99b0016f2bd167d2cfd38ff0d43c9f94a93c84b4e04a02d32658fb401?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }} // replace with your logo URL
            style={styles.logo}
          />
          <Text style={styles.headerText}>{t("Completed Skill Analysis Sessions")}</Text>

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={{ fontSize: 18, color: '#3F5637', fontWeight: 'bold',fontFamily:"Roboto-Light"}}>
            ✕
          </Text>
        </TouchableOpacity>
        </View> 
   <Text style={{marginLeft: 730, marginTop: 20, marginBottom: -15, width: 200, fontWeight: '600'}}>{t("Uneditable Section")}</Text>
 <View style={styles.container}>
 <View style={styles.row}>
        <View style={styles.cell}>
          <Text style = {{fontWeight: 'bold',fontFamily:"Roboto-Light"}}>{t("Full Name")}</Text>
        </View>
        <View style={styles.cell}>
           <Text style={{color: 'grey',fontFamily:"Roboto-Light"}}>{data?.expert}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style = {{fontWeight: 'bold',fontFamily:"Roboto-Light"}}>{t("Role")}</Text>
        </View>
        <View style={styles.cell}>
           <Text style={{color: 'grey',fontFamily:"Roboto-Light"}}>{data?.role}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style = {{fontWeight: 'bold',fontFamily:"Roboto-Light"}}>{t("Level")}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={{color: 'grey',fontFamily:"Roboto-Light"}}>{data?.starting_level}</Text>
        </View>
      </View>




    </View>


  
  <Text style={{ marginTop: 30, fontWeight: 'bold', color: 'black', marginLeft: 50  }}> {t("Overall Feedback/Remark")}</Text>
                <View style={{ marginLeft: 50, marginRight: 70, marginTop: 5 }}>
                  <TextInput
                    style={{ padding: 6, fontSize: 14, fontWeight: 'normal', color: 'black', borderWidth: 1, outline: 'black', borderColor: 'black', height: 150  }}
                    placeholder="e.g: Your goals and its description are clear and concise. Well done for that. I am satisfied with this set goals and I am more than happy to work with you to the finish line.  See you in our one-one session where I'll share further tips on how to achieve this feat and above all meet you."
                    value={data?.remark}
                    placeholderTextColor="grey"
                     multiline={true}
                    onChangeText={text => setRemark(text)}
                  />
                  </View>

  

  <View style={styles.ratingContainer}>
    <Text style={styles.ratetitle}>{t("Rating")} </Text>
    <View style={styles.raterow}>
      <Text style={styles.ratetext}>You were rated {getRatingText(rated)} by {data?.expert} </Text>
    </View>
  </View>



    </View>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        title={t("Alert")}
        message={alertMessage}
        onConfirm={hideAlert}
      />
</View>

);
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#CCC',
    marginRight: 70, 
    marginTop: 30, 
    marginLeft: 50 
  },
  checkcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginLeft: 40
  },
    text: {
      fontSize: 16,
      color: 'gray',
    },
    textChecked: {
      color: 'green',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 5,
  },
  picker: {
    height: 20,
    width: '100%',
    backgroundColor: '#F8F8F8',
    borderColor: '#F8F8F8',
    color:'grey',
    fontSize: 14,
    outline: 'black',
    borderWidth: 1,
    borderColor: 'black'
  },
  buttonAcc: {
     backgroundColor: 'coral',
      padding: 10,
      marginTop: 30,
      marginLeft: 500, 
      marginRight: 70,
      width: 150,
      paddingHorizontal: 5,
      marginBottom: 20,
      borderRadius: 5
    },
    buttoncomplete: {
     backgroundColor: 'darkgreen',
      padding: 10,
      marginTop: 30,
      marginLeft: 50, 
      paddingHorizontal: 5,
      marginBottom: 20,
      borderRadius: 5,
       width: 150,
    },
  buttonTextplus: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily:"Roboto-Light"
  },
  greenBox: {
    width: 920,
    height:850,
    backgroundColor: '#F8F8F8',
  },
  input: {
    outline: 'none',
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
    marginBottom: 20
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F5637',
    fontFamily:"Roboto-Light"
  },
  ratingContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 50,
    marginTop: 300
  },
  ratetitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
    color: '#206C00'
  },
  raterow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratetext: {
    color: 'black',
    fontFamily: "Roboto-Light",
    fontSize: 16
  },

});

export default MyComponent; 