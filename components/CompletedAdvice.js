import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Modal, Image } from 'react-native';
import OpenSchedule from '../Experts/Viewcompletedadvice';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const POLLING_INTERVAL = 5000;

const ScheduledMeetingsTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastExpertLink, setLastExpertLink] = useState(null);
  const [meetings, setMeetings] = useState([]);
   const [selectedMeeting, setSelectedMeeting] = useState(null);

  const { t } = useTranslation();
  const [fontsLoaded] = useFonts({
    'Roboto-Light': require("../assets/fonts/Roboto-Light.ttf"),
  });

  const handleOpenPress = async (meeting) => {
    try {
      // Save the selected meeting data to AsyncStorage
      await AsyncStorage.setItem('selectedMeeting', JSON.stringify(meeting));
      console.log('Selected meeting saved:', meeting);

      // Set the selected meeting in state to pass it to the modal
      setSelectedMeeting(meeting);
      setModalVisible(true);
    } catch (error) {
      console.error('Failed to save selected meeting to AsyncStorage', error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedExpertId = await AsyncStorage.getItem('user_id');

        if (!token || !storedExpertId) {
          console.error('No token or user ID found');
          return;
        }

        const response = await axios.get('https://recruitangle.com/api/expert/skillAnalysis/getAllExpertsSkillAnalysisFeedbacks', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          const data = response.data.skillAnalysis;

          // Filter meetings based on expert_id
          const filteredMeetings = data.filter(meeting => meeting.user_id === storedExpertId);
          setMeetings(filteredMeetings);

         // Save all growth plans to AsyncStorage
          try {
            await AsyncStorage.setItem('allExpertsskillanalysis', JSON.stringify(data));
            console.log('All expert skill analysis saved:', data);
          } catch (error) {
            console.error('Failed to save all expert skill analysis to AsyncStorage', error);
          }
        } else {
          console.error('Failed to fetch data', response);
        }
      } catch (error) {
        console.error('Failed to load form data', error);
      }
    };

    // Initial data load
    loadFormData();

    // Polling function
    const pollFeedbacks = () => {
      const fetchFeedbacks = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const storedExpertId = await AsyncStorage.getItem('user_id');

          if (!token || !storedExpertId) {
            console.error('No token or user ID found');
            return;
          }

          const response = await axios.get('https://recruitangle.com/api/expert/skillAnalysis/getAllExpertsSkillAnalysisFeedbacks', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.status === 200) {
            const data = response.data.skillAnalysis;
            const filteredMeetings = data.filter(meeting => meeting.user_id === storedExpertId);

            // Only update if new data is different from current meetings
            if (JSON.stringify(filteredMeetings) !== JSON.stringify(meetings)) {
              setMeetings(filteredMeetings);

              // Save updated data to AsyncStorage
              try {
                await AsyncStorage.setItem('allExpertsskillanalysis', JSON.stringify(data));
                console.log('Updated expert skill analysis saved:', data);
              } catch (error) {
                console.error('Failed to save updated expert skill analysis to AsyncStorage', error);
              }
            }
          } else {
            console.error('Failed to fetch data', response);
          }
        } catch (error) {
          console.error('Failed to fetch feedbacks', error);
        }
      };

      fetchFeedbacks();
    };

    // Set up polling
    const intervalId = setInterval(pollFeedbacks, POLLING_INTERVAL);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [meetings]);

  useEffect(() => {
    const fetchLastCreatedMeeting = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedExpertId = await AsyncStorage.getItem('user_id');

        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('https://recruitangle.com/api/jobseeker/meetings/get?type=advice', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
          const meetings = Object.values(data.meetings);

          // Filter meetings where expert_id matches storedExpertId
          const matchingMeetings = meetings.filter(
            meeting => meeting.expert_id === storedExpertId
          );

          if (matchingMeetings.length > 0) {
            // Sort the filtered meetings by created_at in descending order
            const sortedMeetings = matchingMeetings.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            // Set the lastExpertLink to the expert_link of the latest meeting
            setLastExpertLink(sortedMeetings[0].expert_link);
            console.log('Last expert link:', sortedMeetings[0].expert_link); // Debugging
          } else {
            console.error('No matching meetings found for this expert ID');
          }
        } else {
          console.error('Failed to fetch meetings:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      }
    };

    fetchLastCreatedMeeting();
  }, []);

  const handleJoinPress = () => {
    if (lastExpertLink) {
      Linking.openURL(lastExpertLink);
    } else {
      console.error('No expert link found');
    }
  };

  const formatDateTime = (dateTimeString) => {
    try {
      const dateTime = new Date(dateTimeString);
      if (isNaN(dateTime.getTime())) { // Check if date is invalid
        throw new Error('Invalid date');
      }
      const date = dateTime.toLocaleDateString();
      const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      return `${date} ${time}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <View style={styles.greenBox}>
      <BlurView intensity={100} style={styles.blurBackground}>
        <Text style={styles.title}>{t("Completed Skill Analysis Sessions")}</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.cell2}>
              <Text style={styles.headerText}>{t("Name")}</Text>
            </View>
            <View style={styles.cell2}>
              <Text style={styles.headerText}>{t("Role")}</Text>
            </View>
            <View style={styles.cell2}>
              <Text style={styles.headerText}>{t("Account Type")}</Text>
            </View>
            <View style={styles.cell2}>
              <Text style={styles.headerText}>{t("Completed")}</Text>
            </View>
            <TouchableOpacity>
              <View style={styles.cell2}>
              <Text style={{color: 'white'}}>Open</Text>
               </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.cell2}>
              <Text style={{color: 'white'}}>Start Meeting</Text>
               </View>
            </TouchableOpacity>
          </View>

          {meetings.map((meeting, index) => {
            const dateTime = new Date(meeting.updated_at);
            const date = dateTime.toLocaleDateString();
            const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <View key={index} style={styles.row}>
                 <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../assets/useravatar.jpg')} style={styles.image} />
                    <Text style={styles.cellText}>{meeting.expert}</Text>
                  </View>
                </View>
                 <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                  <Text style={styles.cellText}>{meeting.role}</Text>
                </View>
                 <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                  <Text style={styles.cellText}>{t("Individual Account")}</Text>
                </View>
                 <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                  <Text style={styles.cellText}>{formatDateTime(meeting.date)}</Text>
                </View>
                <TouchableOpacity onPress={() => handleOpenPress(meeting)}>
                   <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                  <Text style={styles.linkText}>{t("Open")}</Text>
                   </View>
                </TouchableOpacity>
                <TouchableOpacity >
                  <View style={index % 2 === 0 ? styles.cell : styles.cell2}>
                  <Text style={{color: 'transparent'}}>{t("Start Meeting")}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContent}>
             <OpenSchedule onClose={handleCloseModal} meeting={selectedMeeting} />
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