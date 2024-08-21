import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenSchedule from '../Jobseekers/ViewInterviewbook';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { useTranslation } from 'react-i18next';

const ScheduledMeetingsTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [interviews, setInterviews] = useState([]);
  

  const handleOpenPress = async (interview) => {
    setModalVisible(true);

    try {
      await AsyncStorage.setItem('selectedInterview', JSON.stringify(interview));
      console.log('Selected interview saved:', interview);
    } catch (error) {
      console.error('Failed to save selected interview to AsyncStorage', error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token from AsyncStorage
      const storedUserId = await AsyncStorage.getItem('user_id'); // Retrieve user_id from AsyncStorage

      if (token && storedUserId) {
        // Fetch the interviews
        const response = await fetch('https://recruitangle.com/api/expert/interview/getAllExpertsInterviewFeedbacks', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        const data = await response.json();

        if (data.status === 'success') {
          // Filter interviews based on user_id
          const filteredInterviews = data.allInterview.filter(interview => interview.jobseeker_id === storedUserId);
          setInterviews(filteredInterviews);

          // Optionally save filtered interviews to AsyncStorage
          try {
            await AsyncStorage.setItem('allInterviews', JSON.stringify(filteredInterviews));
            console.log('Filtered interviews saved:', filteredInterviews);
          } catch (error) {
            console.error('Failed to save filtered interviews to AsyncStorage', error);
          }
        } else {
          console.error('Failed to fetch data', data);
        }
      } else {
        console.error('Token or user_id not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Failed to load form data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [fontsLoaded] = useFonts({
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
  });
  const { t } = useTranslation();

  return (
    <View style={styles.greenBox}>
      <BlurView intensity={100} style={styles.blurBackground}>
        <Text style={styles.title}>{t('Interview Feedback')}</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            {/* Table Headers */}
            <View style={styles.cell2}>
              <Text style={{ fontWeight: '600', fontSize: 14, fontFamily: 'Roboto-Light' }}>{t('Role')}</Text>
            </View>
            <View style={styles.cell2}>
              <Text style={{ fontWeight: '600', fontSize: 14, fontFamily: 'Roboto-Light' }}>{t('Level')}</Text>
            </View>
            <View style={styles.cell2}>
              <Text style={{ fontWeight: '600', fontSize: 14, fontFamily: 'Roboto-Light' }}>{t('Company')}</Text>
            </View>
            <View style={styles.cell2}>
              <Text style={{ fontWeight: '600', fontSize: 14, fontFamily: 'Roboto-Light' }}>{t('Date')}</Text>
            </View>
            <View style={styles.cell2}>
              <Text style={{ fontWeight: '600', fontSize: 14, fontFamily: 'Roboto-Light' }}>{t('Time')}</Text>
            </View>
            <View style={styles.cell2}>
              <Text style={{ fontWeight: '600', fontSize: 14, fontFamily: 'Roboto-Light' }}>{t('Score')}</Text>
            </View>
            <TouchableOpacity style={styles.cell2}>
              <Text style={styles.cellText}> </Text>
            </TouchableOpacity>
          </View>

          {/* Table Rows */}
          {interviews.map((interview, index) => (
            <View style={styles.row} key={index}>
               <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                <Text style={styles.cellText}>{interview.role}</Text>
              </View>
               <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                <Text style={styles.cellText}>{interview.level}</Text>
              </View>
               <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                <Text style={styles.cellText}>{interview.company}</Text>
              </View>
               <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                <Text style={styles.cellText}>{new Date(interview.date).toLocaleDateString()}</Text>
              </View>
               <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                <Text style={styles.cellText}>{new Date(interview.time).toLocaleTimeString()}</Text>
              </View>
               <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                <Text style={styles.cellText}>{interview.score}</Text>
              </View>
              <TouchableOpacity onPress={handleOpenPress}>
                 <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                <Text style={styles.open}>{t('View')}</Text>
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
            <OpenSchedule onClose={() => handleCloseModal()} />
          </View>
        </Modal>
      </BlurView>
    </View>
  );
};

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
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'flex-start',
  },
  table: {
    marginRight: 200,
    marginTop: 20,
    marginBottom: 20,
    alignContent: 'center',
    justifyContent: 'space-around',
    marginLeft: 50,
    marginRight: 50,
  },
  open: {
    color: 'black',
    fontSize: 14,
    borderColor: '#63EC55',
    borderWidth: 2,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    fontFamily: 'Roboto-Light',
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
    justifyContent: 'center', // Center vertically
    alignItems: 'flex-start',
  },
  cell2: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'center', // Center vertically
    alignItems: 'flex-start',
  },
  cellText: {
    textAlign: 'flex-start',
    fontFamily: 'Roboto-Light',
  },
  greenBox: {
    flex: 2,
    width: '90%',
    height: 550,
    marginLeft: 50,
    backgroundColor: 'rgba(225,225,212,0.3)',
    marginTop: 30,
    borderRadius: 20,
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
  },
  blurBackground: {
    flex: 1,
    borderRadius: 20,
  },
});

export default ScheduledMeetingsTable;
