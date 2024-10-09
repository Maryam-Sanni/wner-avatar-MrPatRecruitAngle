import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, ScrollView, Picker } from 'react-native';
import { useFonts } from 'expo-font';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomAlert from '../components/CustomAlert'; 
import DaysTimePickerModal from "../components/TimePicker";

const MAX_GUIDES = 15;

function MyComponent({ onClose }) {

  const [fontsLoaded] = useFonts({
    'Roboto-Light': require("../assets/fonts/Roboto-Light.ttf"),
  });

  const { t } = useTranslation();

  const [role, setGrowthRole] = useState('');
  const [category, setCategory] = useState('');
  const [level, setlevel] = useState('');
  const [available_days, setavailable_days] = useState('');
  const [available_times, setavailable_times] = useState('');
  const [guides, setGuides] = useState([
    { guide: '', percentage: '' }
  ]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [rate, setRate] = useState('$0'); // Initial value includes $

  const handleRateChange = (text) => {
    // Remove non-numeric characters except for the decimal point
    const numericValue = text.replace(/[^0-9.]/g, '');

    // If the input is not empty, set the state with the `$` at the start
    if (numericValue || numericValue === '') {
      setRate(`$${numericValue}`);
    }
  };


  const handleConfirm = ({ selectedDays, startTime, endTime }) => {
    setavailable_days(selectedDays);
    setavailable_times(`${startTime.hour}:${startTime.minute} ${startTime.period} - ${endTime.hour}:${endTime.minute} ${endTime.period}`);
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (!role || !level || !rate || !available_days || !available_times) {
      setAlertMessage(t('Please fill all fields'));
      setAlertVisible(true);
      return;
    }

    try {
      const data = {
        role,
        level,
        rate,
        available_days,
        available_times,
        category,
        guides
      };

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.post(
        'https://recruitangle.com/api/expert/growthplan/create',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        await AsyncStorage.setItem('GrowthFormData', JSON.stringify(data));
        setAlertMessage(t('Growth plan profile created successfully'));
      } else {
        setAlertMessage(t('Failed to create growth plan profile'));
      }
    } catch (error) {
      console.error('Error during save:', error); // Log error for debugging
      setAlertMessage(t('Failed to create growth plan profile'));
    }
    setAlertVisible(true);
  };

  const addGuide = () => {
    if (guides.length < MAX_GUIDES) {
      setGuides([...guides, { guide: '', percentage: '' }]);
    }
  };

  const updateGuide = (index, key, value) => {
    const newGuides = [...guides];
    newGuides[index][key] = value;
    setGuides(newGuides);
  };

  const deleteGuide = (index) => {
    const newGuides = guides.filter((_, i) => i !== index);
    setGuides(newGuides);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    setIsVisible(false);
  };

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F8F8", alignItems: 'center' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, maxHeight: 500 }}>
        <View style={styles.greenBox}>
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1f2d38e99b0016f2bd167d2cfd38ff0d43c9f94a93c84b4e04a02d32658fb401?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
              style={styles.logo}
            />
            <Text style={styles.headerText}>{t("Create Growth Plan Guide")}</Text>

          </View>

          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <View style={styles.buttonDue}>
              <Text style={styles.buttonTextDue}>Please fill all fields</Text>
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto-Light" }}>{t("Category")}</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  placeholder="Junior Platform Developer"
                  placeholderTextColor="grey"
                  style={styles.input}
                  editable={false}
                  value={role}
                  onChangeText={text => setGrowthRole(text)}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto-Light" }}>{t("Specialization")}</Text>
              </View>
              <View style={styles.cell}>
                <Picker
                  selectedValue={category}
                  style={styles.picker}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                >
                  <Picker.Item label={t('SAP')} value="SAP" />
                  <Picker.Item label={t('Microsoft')} value="Microsoft" />
                  <Picker.Item label={t('Scrum')} value="Scrum" />
                  <Picker.Item label={t('Business Analysis')} value="Business Analysis" />
                </Picker>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto-Light" }}>{t("Candidate Level")}</Text>
              </View>
              <View style={styles.cell}>
                <Picker
                  selectedValue={level}
                  style={styles.picker}
                  onValueChange={(itemValue) => setlevel(itemValue)}
                >
                  <Picker.Item label={t('Beginner')} value="Beginner" />
                  <Picker.Item label={t('Intermediate')} value="Intermediate" />
                  <Picker.Item label={t('Advanced')} value="Advanced" />
                </Picker>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto-Light" }}>{t("Rate")}</Text>
              </View>
              <View style={styles.cell}>
                <TextInput
                  style={styles.input}
                  value={rate}
                  onChangeText={handleRateChange}
                  keyboardType="numeric" 
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto-Light" }}>{t("Availability")}</Text>
              </View>
              <View style={styles.cell}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <TextInput
                    placeholder="What day and time are you available?"
                    placeholderTextColor="green"
                    style={styles.input}
                    editable={false}
                    pointerEvents="none" 
                  />
                </TouchableOpacity>
              </View>
            </View>
            </View>

          <View style={[styles.container, { marginTop: 50 }]}>
            <DaysTimePickerModal
              isVisible={isModalVisible}
              onConfirm={handleConfirm}
              onCancel={() => setModalVisible(false)}
            />
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto-Light" }}>{t("Day (s)")}</Text>
              </View>
              <View style={styles.cell}>
                  <TextInput
                    placeholder="Mon,Tue,Wed...,Sun"
                    placeholderTextColor="grey"
                    style={styles.input}
                    value={available_days}
                    editable={false} // Prevent manual input
                    pointerEvents="none" // Ensure it behaves like a button
                  />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={{ fontWeight: 'bold', fontFamily: "Roboto-Light" }}>{t("Time")}</Text>
              </View>
              <View style={styles.cell}>
                  <TextInput
                    placeholder="12PM-1PM"
                    placeholderTextColor="grey"
                    style={styles.input}
                    value={available_times}
                    editable={false}
                    pointerEvents="none" 
                  />
              </View>
            </View>
          </View>

            <View style={{ flexDirection: 'row', marginTop: 30 }}>
              <Text style={{ marginLeft: 50, fontWeight: 'bold', marginTop: 20,}}>{t("My Scoring Guide")}</Text>

            
          </View>

          <View style={{ flexDirection: 'row'}}>
          <Text style={{ marginLeft: 50, fontWeight: '600', marginTop: 5, fontFamily: "Roboto-Light", fontStyle: "italic" }}>{t("Make use of the guide to jot down questions and notes, helping you facilitate the session more effectively")}</Text>

          <TouchableOpacity 
            style={[styles.buttonplus, guides.length >= MAX_GUIDES && styles.buttonplusDisabled, isPressed && styles.buttonplusPressed]} 
            onPress={addGuide}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={guides.length >= MAX_GUIDES}
          >
            <Text style={styles.buttonTextplus}>+</Text>
          </TouchableOpacity>
          </View>

          <View style={styles.container}>
            {guides.map((guide, index) => (
              <View key={index} style={styles.row}>
                <View style={[styles.cell, { flex: 1 }]}>
                  <Text style={{ fontWeight: 'bold', fontFamily: "Roboto-Light" }}>{t(`Guide`)} {index + 1}</Text>
                </View>
                <View style={[styles.cell, { flex: 5 }]}>
                  <TextInput
                    placeholder={t("Guide description")}
                    placeholderTextColor="grey"
                    style={styles.input}
                    value={guide.guide}
                    onChangeText={text => updateGuide(index, 'guide', text)}
                  />
                </View>
                <View style={[styles.cell, { flex: 1 }]}>
                  <Picker
                    selectedValue={guide.percentage}
                    style={styles.picker}
                    onValueChange={(itemValue) => updateGuide(index, 'percentage', itemValue)}
                  >
                    <Picker.Item label="10%" value="10" />
                    <Picker.Item label="20%" value="20" />
                    <Picker.Item label="30%" value="30" />
                    <Picker.Item label="40%" value="40" />
                    <Picker.Item label="50%" value="50" />
                    <Picker.Item label="60%" value="60" />
                    <Picker.Item label="70%" value="70" />
                    <Picker.Item label="80%" value="80" />
                    <Picker.Item label="90%" value="90" />
                    <Picker.Item label="100%" value="100" />
                  </Picker>
                </View>
                <TouchableOpacity onPress={() => deleteGuide(index)} style={styles.deleteButton}>
                  <Text style={{color: 'grey', fontSize: 18, fontWeight: 600}}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          
          
          <TouchableOpacity onPress={handleSave} style={styles.buttonsave}>
            <Text style={styles.buttonTextsave}>{t("Save")}</Text>
          </TouchableOpacity>
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
    marginTop: 10, 
    marginLeft: 50,
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
  buttonDue: {
    borderWidth: 2,
    borderColor: 'coral',
    padding: 10,
    marginLeft: 50,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  buttonTextDue: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
    fontFamily:"Roboto-Light"
  },
  buttonAcc: {
    borderWidth: 2,
    borderColor: '#CCC',
    padding: 10,
    marginTop: 15,
    marginLeft: 30, 
    paddingHorizontal: 20,
  },
  buttonTextAcc: {
    color: 'grey',
    fontSize: 14,
    textAlign: 'center',
    fontFamily:"Roboto-Light"
  },
  buttonNew: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'coral',
    padding: 5,
    marginLeft: 50, 
    width: 100,
    paddingHorizontal: 20,
    marginTop: 10
  },
  buttonTextNew: {
    color: 'coral',
    fontSize: 14,
    textAlign: 'center',
    fontFamily:"Roboto-Light"
  },
  buttonplus: {
    backgroundColor: 'grey', 
    padding: 5,
    marginLeft: 90, 
    width: 70,
    paddingHorizontal: 20,
  },
  buttonplusPressed: {
    backgroundColor: 'green',
  },
  buttonplusDisabled: {
    backgroundColor: 'red',
  },
  buttonTextplus: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonsave: {
    backgroundColor: 'coral',
    padding: 5,
    marginLeft: 750, 
    width: 100,
    paddingHorizontal: 20,
    marginTop: 100,
    marginBottom: 50
  },
  buttonTextsave: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily:"Roboto-Light"
  },
  greenBox: {
    width: 920,
    backgroundColor: 'white',
  },
  input: {
    outline: 'black',
    borderWidth: 1,
    borderColor: 'black',
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
    marginBottom: 20
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  picker: {
    height: 20,
    width: '100%',
    backgroundColor: '#F8F8F8',
    borderColor: 'black',
    borderWidth: 1, 
    color:'grey',
    fontSize: 14,
    paddingLeft: 2
  },
});

export default MyComponent;
