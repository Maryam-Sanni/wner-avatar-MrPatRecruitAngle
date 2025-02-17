import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router-dom';

const ScheduledMeetingsTable = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllMeetings, setShowAllMeetings] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Function to generate Google Calendar URL
  const generateGoogleCalendarUrl = (meeting) => {
    const startDate = moment(meeting.date).utc().format('YYYYMMDDTHHmmss') + 'Z';
    const endDate = moment(meeting.end_time).utc().format('YYYYMMDDTHHmmss') + 'Z';
    const eventTitle = encodeURIComponent(meeting.meeting_topic);
    const eventDetails = encodeURIComponent(meeting.meeting_description);
    const eventLocation = encodeURIComponent(meeting.meeting_location || 'Online'); // Default location if none provided

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDate}/${endDate}&details=${eventDetails}&location=${eventLocation}`;
  };

  // Button click handler to open Google Calendar link
  const handleAddToCalendar = (meeting) => {
    const googleCalendarUrl = generateGoogleCalendarUrl(meeting);
    Linking.openURL(googleCalendarUrl).catch(err => console.error('Failed to open URL:', err));
  };
  
  const fetchHubMeetings = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const hubId = await AsyncStorage.getItem('hub_id');

      if (!token || !hubId) {
        console.error('Token or hub ID not found');
        return;
      }

      const response = await axios.get(`${apiUrl}/api/expert/hubs/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const { NewHub } = response.data;

        // Find the hub by hub_id
        const selectedHub = NewHub.find(hub => hub.id === parseInt(hubId));

        if (selectedHub && selectedHub.meeting && selectedHub.meeting.length > 0) {
          // Sort meetings by date in ascending order
          const sortedMeetings = selectedHub.meeting.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );

          setMeetings(sortedMeetings);
          setLoading(false);
        } else {
          console.error('No meetings found for the selected hub');
          setMeetings([]);
          setLoading(false);
        }
      } else {
        console.error('Failed to fetch hub data');
      }
    } catch (error) {
      console.error('Error fetching hub meetings:', error);
    }
  };



  const handleJoinLink = async (meeting) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const firstName = await AsyncStorage.getItem('first_name');
      const lastName = await AsyncStorage.getItem('last_name');
      const candidateName = `${firstName} ${lastName}`;

      if (!token || !candidateName) {
        console.error("Token or candidate name missing.");
        return;
      }

      const meeting_id = String(meeting.meeting_id);

      const response = await axios.post(
        `${apiUrl}/api/expert/join-candidate`,
        { meeting_id, candidate_name: candidateName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success" && response.data.candidate_link) {
        const { candidate_link } = response.data;
        Linking.openURL(candidate_link);
      } else {
        alert('Failed to retrieve the meeting link.');
      }
    } catch (error) {
      console.error("Error joining meeting:", error);
      alert('Failed to join the meeting. Please try again.');
    }
  };

  useEffect(() => {
    fetchHubMeetings();
  }, []);

  if (error) return <Text>{error}</Text>;
  
  return (
    <View>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        
        <View style={{flexDirection: 'row', marginBottom: 30}}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 10, marginRight: 20, padding: 5 }}>
              All Upcoming
            </Text>
        </View>
        {(showAllMeetings ? meetings : meetings.slice(0, 2)).map((meeting) => (
          <View key={meeting.id} style={styles.meetingContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=100&id=42287&format=png&color=000000",
                }}
                style={{width: 150, height: 150, marginTop: 30, marginBottom: 30, marginLeft: 50}}
              />
              <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <Text style={styles.meetingTime}>Live Session . </Text>
                  <Text style={styles.meetingTime}>Online . </Text>
                  <Text style={styles.meetingTime}>Get Started</Text>
                </View>
                <Text style={styles.hubName}>{meeting.meeting_topic}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  {moment(meeting.time)
                    .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                    .format('MMMM Do YYYY, h:mm A [( ' + Intl.DateTimeFormat().resolvedOptions().timeZone + ')]')}
                </Text>
                <Text style={styles.meetingDescription}>{meeting.meeting_description}</Text>
                <View style={{flexDirection: 'row', marginTop: 20, alignSelf: 'flex-end'}}>
                  <TouchableOpacity onPress={() => handleAddToCalendar(meeting)} style={styles.joinButton2}>
                    <Text style={styles.buttonText2}>Add To Calendar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleJoinLink(meeting)} style={styles.joinButton}>
                    <Text style={styles.buttonText}>Launch Meeting</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
        {!showAllMeetings && meetings.length > 2 && (
          <TouchableOpacity onPress={() => setShowAllMeetings(true)} style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 20,
  },
  meetingContainer: {
    marginBottom: 20,
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  hubName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  meetingDescription: {
    fontSize: 16,
    width: 700,
    marginBottom: 4,
  },
  meetingTime: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  joinButton: {
    backgroundColor: '#206C00',
    padding: 15,
    borderRadius: 5,
  },
  joinButton2: {
    borderColor: '#206C00',
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    marginRight: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  viewAllButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    width: 100,
    alignSelf: 'center',
  },
  viewAllButtonText: {
    color: '#206C00',
    fontWeight: 'bold',
  },
  buttonText2: {
    color: "#206C00",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ScheduledMeetingsTable;
