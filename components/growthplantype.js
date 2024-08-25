import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import OpenSchedule from '../Jobseekers/OpenGrowth';
import OpenSchedule2 from '../Jobseekers/OpenGrowth';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScheduledMeetingsTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selectedGrowthPlan, setSelectedGrowthPlan] = useState(null);
  const [growthPlans, setGrowthPlans] = useState([]);


  const loadFormData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get('https://recruitangle.com/api/jobseeker/get-jobseeker-growthplan', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        const data = response.data.growthPlan || [];
        setGrowthPlans(data);

        // Save all growth plans to AsyncStorage
        try {
          await AsyncStorage.setItem('allGrowthPlans', JSON.stringify(data));
          console.log('All growth plans saved:', data);
        } catch (error) {
          console.error('Failed to save all growth plans to AsyncStorage', error);
        }
      } else {
        console.error('Failed to fetch data', response);
      }
    } catch (error) {
      console.error('Failed to load form data', error);
    }
  };

  useEffect(() => {
    loadFormData(); // Initial data load

    // Set up polling
    const intervalId = setInterval(loadFormData, 5000); // Poll every 30 seconds

    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    };
  }, []);

  const handleOpenPress2 = async (growthPlan) => {
    setSelectedGrowthPlan(growthPlan);
    setModalVisible(true);

    try {
      await AsyncStorage.setItem('selectedGrowthPlan', JSON.stringify(growthPlan));
      console.log('Selected growth plan saved:', growthPlan);
    } catch (error) {
      console.error('Failed to save selected growth plan to AsyncStorage', error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedGrowthPlan(null);
  };

  const handleOpenPress = async (growthPlan) => {
    setSelectedGrowthPlan(growthPlan);
    setModalVisible(true);

    try {
      await AsyncStorage.setItem('selectedGrowthPlan', JSON.stringify(growthPlan));
      console.log('Selected growth plan saved:', growthPlan);
    } catch (error) {
      console.error('Failed to save selected growth plan to AsyncStorage', error);
    }
  };

  const handleCloseModal2 = () => {
    setModalVisible2(false);
    setSelectedGrowthPlan(null);
  };

  const [fontsLoaded] = useFonts({
    'Roboto-Light': require("../assets/fonts/Roboto-Light.ttf"),
  });

  const { t } = useTranslation();

  return (
    <View style={styles.greenBox}>
      <BlurView intensity={100} style={styles.blurBackground}>
        <Text style={styles.title}>{t("Growth Plan Sessions in Review")}</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.cell2}><Text style={styles.headerText }>{t("Expert")}</Text></View>
            <View style={styles.cell2}><Text style={styles.headerText}>{t("Type")}</Text></View>
            <View style={styles.cell2}><Text style={styles.headerText}>{t("Title")}</Text></View>
            <View style={styles.cell2}><Text style={styles.headerText}>{t("Role")}</Text></View>
            <View style={styles.cell2}><Text style={styles.headerText}>{t("Starting Level")}</Text></View>
            <TouchableOpacity>
              <View style={styles.cell2}>
              <Text style={{color: 'white'}}>Update</Text>
               </View>
            </TouchableOpacity>
          </View>
          
          {growthPlans.map((growthPlan, index) => (
      
            <View key={index} style={styles.row}>
               <View style={index % 2 === 0 ? styles.cell : styles.cell2}><Text style={styles.cellText}>{growthPlan.coach}</Text></View>
               <View style={index % 2 === 0 ? styles.cell : styles.cell2}><Text style={styles.cellText}>{growthPlan.type}</Text></View>
               <View style={index % 2 === 0 ? styles.cell : styles.cell2}><Text style={styles.cellText}>{growthPlan.title}</Text></View>
               <View style={index % 2 === 0 ? styles.cell : styles.cell2}><Text style={styles.cellText}>{growthPlan.role}</Text></View>
               <View style={index % 2 === 0 ? styles.cell : styles.cell2}><Text style={styles.cellText}>{growthPlan.starting_level}</Text></View>
              <TouchableOpacity onPress={() => handleOpenPress (growthPlan)}>
                <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                <Text style={styles.linkText}>{t("Update")}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContent}>
            <OpenSchedule growthPlan={selectedGrowthPlan} onClose={handleCloseModal} />
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={handleCloseModal2}
        >
          <View style={styles.modalContent}>
            <OpenSchedule2 growthPlan={selectedGrowthPlan} onClose={handleCloseModal2} />
          </View>
        </Modal>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    marginTop: 30,
    marginLeft: 50,
    color: "black",
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'flex-start',
  },
  table: {
    flex: 1,
    marginRight: 200,
    marginTop: 20,
    marginBottom: 30,
    alignContent: 'center',
    justifyContent: 'space-around',
    marginLeft: 50, marginRight: 50
  },
  greenBox: {
    width: "90%",
    marginBottom: 20,
    marginLeft: 50,
    backgroundColor: 'rgba(225,225,212,0.3)',
    marginTop: 30,
    borderRadius: 20,
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(225,225,212,0.3)',
  },
  cell: {
    flex: 1,
    backgroundColor: 'none',
    padding: 10,
    alignItems: 'flex-start',
  },
  cell2: {
    flex: 1,
    backgroundColor: 'white', 
    padding: 10,
    alignItems: 'flex-start',
  },
  cellText: {
    textAlign: 'flex-start',
    fontFamily: "Roboto-Light"
  },
  headerText: {
    fontWeight: '600',
    fontSize: 14,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginTop: -5,
    borderRadius: 25
  },
  blurBackground: {
    flex: 1,
    borderRadius: 20,
  },
  linkText: {
    color: "#206C00",
    fontSize: 14,
    fontFamily: "Roboto-Light"
  }
});

export default ScheduledMeetingsTable;
