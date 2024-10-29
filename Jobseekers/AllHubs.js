import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    Switch,
    Linking,
    TouchableOpacity,
    Modal, FlatList,
ActivityIndicator,
    ImageBackground,
} from "react-native";
import Topbar from "../components/topbar";
import Sidebar from "../components/sidebar";
import PastSessions from "../components/PastSessions";
import HubsAssignments from "../components/HubsAssignments";
import OpenModal from "../Jobseekers/Pickyourhub";
import { useNavigate } from 'react-router-dom';
import { useFonts } from "expo-font";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import CustomAlert from '../components/CustomAlert'; 

function MyComponent() {
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [hubs, setHubs] = useState([]);
    const [selectedHub, setSelectedHub] = useState(null);
    const [isAttending, setIsAttending] = useState(false);
      const [isModalVisible, setisModalVisible] = useState(false);
     const [meetingsData, setMeetingsData] = useState([]);
    const [loading, setLoading] = useState(false);
      const [alertMessage, setAlertMessage] = useState('');
      const [alertVisible, setAlertVisible] = useState(false);

     const apiUrl = process.env.REACT_APP_API_URL;
    
    const toggleAttendance = () =>
        setIsAttending((previousState) => !previousState);

    const handleOpenPress = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handlejoinPress = () => {
        Linking.openURL("https://meet.anglequest.com");
    };

    const handleHubPress = async () => {
      try {
        await AsyncStorage.setItem('hub_name', selectedHub.coaching_hub_name); // Save the coaching hub name
        setisModalVisible(true); // Show the modal to fetch meeting data
        fetchMeetingsData(selectedHub.coaching_hub_name); // Fetch meetings data based on selected hub name
      } catch (error) {
        console.error("Error saving hub name:", error);
      }
    };

    const fetchMeetingsData = async (hubName) => {
      setLoading(true);
      try {
        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('token'); // Replace 'token' with your key
        const response = await axios.get(`${apiUrl}/api/expert/hubs/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { AllHubs } = response.data;

        if (hubName) {
          // Filter using coaching_hub_name
          const filteredHubs = AllHubs.filter(hub => hub.coaching_hub_name === hubName);
          setMeetingsData(filteredHubs);
        }
      } catch (error) {
        console.error("Error fetching meeting data:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleJoinMeeting = async (meeting, hubId, expertId) => {
      try {
        // Retrieve necessary information from AsyncStorage
        const firstName = await AsyncStorage.getItem('first_name');
        const lastName = await AsyncStorage.getItem('last_name');
        const jobseekerId = await AsyncStorage.getItem('user_id');
        const token = await AsyncStorage.getItem('token'); // Get token for authorization

        const jobseekerName = `${firstName} ${lastName}`;

        // Prepare meeting details for the API call
        const meetingDetails = {
          meeting_topic: "Your Meeting Topic", // Adjust this to reflect actual meeting topic if available
          candidate_link: meeting.candidate_link,
          expert_link: meeting.expert_link,
          description: meeting.description,
          meeting_date: meeting.date,
          hub_id: String(hubId), // Use the passed hubId
          expert_id: expertId, // Use the passed expertId
          jobseeker_name: jobseekerName,
          jobseeker_id: jobseekerId,
        };

        // POST to join the meeting
        const joinMeetingResponse = await axios.post(
          `${apiUrl}/api/expert/join-meeting`,
          meetingDetails,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token for authorization
            },
          }
        );

        // Check if joining the meeting was successful
        if (joinMeetingResponse.status === 201) {
          setAlertMessage('You have successfully joined the meeting');
        } else {
          setAlertMessage('An error occurred while joining the meeting.');
        }
      } catch (error) {
        console.error(error);
        setAlertMessage('An error occurred while processing your request.');
      } finally {
        setAlertVisible(true); // Always show alert, whether success or error
      }
    };



      const handleJoinlink = (link) => {
        Linking.openURL(link); // Open the meeting link
      };

      const handleRegister = () => {
        // Implement your registration logic here
        console.log("Registration for meeting initiated.");
      };
    
    useEffect(() => {
        const fetchHubs = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token not found');
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/api/jobseeker/get-all-jobseeker-hubs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (data.status === 'success' && data.AllJoinedHubs.length > 0) {
                    setHubs(data.AllJoinedHubs);
                    setSelectedHub(data.AllJoinedHubs[0]);
                } else {
                    setHubs([]);
                    setSelectedHub(null);
                    // Redirect to Coaching Hubs page if no hubs are available
                    navigate('/coaching-hub-new'); // Make sure 'CoachingHubsPage' matches your route name
                }
            } catch (error) {
                console.error('Error fetching hubs:', error);
                setHubs([]);
                setSelectedHub(null);
                // Redirect to Coaching Hubs page on error as well
                navigate('/coaching-hub-new'); // Make sure 'CoachingHubsPage' matches your route name
            }
        };

        fetchHubs();
    }, [navigate]);

    const [fontsLoaded] = useFonts({
        "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
    });
    const { t } = useTranslation();

      const hideAlert = () => {
        setAlertVisible(false);
        setIsVisible(false);
        onClose();
      };
    
    if (!selectedHub) {
        return null; // Or you can navigate to another screen here if necessary
    }

    return (
        <ImageBackground
            source={require("../assets/backgroundimg2.png")}
            style={{ height: "100%", width: "100%", flex: 1 }}
        >
            <View style={{ flex: 1 }}>
                <Topbar />
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <Sidebar />
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, maxHeight: 500 }}
                    >
                        <View style={{ marginLeft: 270 }}>
                            <View style={styles.header}>
                                <Image
                                    source={{
                                        uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/925cfbb55e82458868f5e0c8cafbdc90d47bec0907e65b77fb918a7ac0dbcfe0?apiKey=7b9918e68d9b487793009b3aea5b1a32&",
                                    }}
                                    style={styles.image}
                                />
                                <Text
                                    style={{
                                        color: "#666",
                                        fontWeight: "600",
                                        marginLeft: 10,
                                        fontSize: 14,
                                        marginTop: 5,
                                        marginRight: 20,
                                    }}
                                >
                                    {t("All Joined Hubs")}:
                                </Text>
                                {hubs.map((hub, index) => {
                                    const isSelected =
                                        hub.id === selectedHub?.id;

                                    return (
                                        <TouchableOpacity
                                            key={hub.id}
                                            onPress={() => setSelectedHub(hub)}
                                        >
                                            <View
                                                style={[
                                                    styles.item,
                                                    isSelected
                                                        ? styles.selectedItem
                                                        : styles.unselectedItem,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.hubText,
                                                        isSelected
                                                            ? styles.selectedText
                                                            : styles.unselectedText,
                                                    ]}
                                                >
                                                     {hub.coaching_hub_name || 'No hub yet'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <TouchableOpacity onPress={handleOpenPress}>
                                <View
                                    style={{
                                        justifyContent: "flex-start",
                                        paddingHorizontal: 10,
                                        paddingVertical: 10,
                                        borderRadius: 5,
                                        borderColor: "#f7fff4",
                                        backgroundColor:
                                            "rgba(211,249,216,0.3)",
                                        width: 150,
                                        alignItems: "center",
                                        marginTop: 20,
                                        marginLeft: 50,
                                        borderWidth: 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: "#f7fff4",
                                            alignText: "center",
                                            fontWeight: "bold",
                                            fontFamily: "Roboto-Light",
                                        }}
                                    >
                                        + {t("New")}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.container}>
                                <View style={styles.box}>
                                    <View
                                        style={{
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                color: "black",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {t("Live Sessions")}
                                        </Text>
                                
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: "grey",
                                                textAlign: 'center',
                                                marginTop: 5,
                                                fontWeight: "500",
                                                fontFamily: "Roboto-Light",
                                            }}
                                        >
                                            {selectedHub.coaching_hub_name|| 'No Hub Yet'}
                                        </Text>
                                        <TouchableOpacity
                                            style={{
                                              padding: 8,
                                              paddingHorizontal: 10,
                                              marginTop: 10,
                                              borderRadius: 5,
                                              marginLeft: 10,
                                              marginRight: 10,
                                              borderWidth: 2,
                                              borderColor: "#206C00",
                                            }}
                                            onPress={handleHubPress}
                                          >
                                            <Text style={{ color: "#206C00", fontWeight: "600" }}>View Meetings</Text>
                                          </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.box}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: "black",
                                            fontWeight: "bold",
                                            marginTop: 5,
                                            marginBottom: 10,
                                            fontFamily: "Roboto-Light",
                                        }}
                                    >
                                        {selectedHub.category || 'No Hub Yet'}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            marginTop: 5,
                                            color: "black",
                                            fontFamily: "Roboto-Light",
                                        }}
                                    >
                                        {selectedHub.coaching_hub_description || 'No description available'}
                                    </Text>
                                </View>

                                <View style={styles.box}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: "black",
                                            marginBottom: 10,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {t("Confirm Attendance")}
                                    </Text>
                                    <View style={styles.switchrow}>
                                        <Switch
                                            trackColor={{
                                                false: "#767577",
                                                true: "#63EC55",
                                            }}
                                            thumbColor={
                                                isAttending
                                                    ? "#206C00"
                                                    : "#f4f3f4"
                                            }
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleAttendance}
                                            value={isAttending}
                                        />
                                        <Text style={styles.switchLabel}>
                                            {isAttending
                                                ? t("Yes, I will attend")
                                                : t("No, I will not attend")}
                                        </Text>
                                        <Image
                                            source={require("../assets/teamicon.jpg")}
                                            style={styles.boximage}
                                        />
                                    </View>
                                </View>
                                <View style={styles.box}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: "black",
                                            fontWeight: "bold",
                                            marginTop: 5,
                                            marginBottom: 5,
                                            fontFamily: "Roboto-Light",
                                        }}
                                    >
                                        {t("Coach")}
                                    </Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: "bold",
                                                marginTop: 5,
                                                color: "#206C00",
                                                fontFamily: "Roboto-Light",
                                            }}
                                        >
                                            {selectedHub.expert_name || 'No hub yet'}
                                        </Text>
                                    </View>
                                   
                                </View>
                            </View>

                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={handleCloseModal}
                            >
                                <View style={styles.modalContent}>
                                    <OpenModal
                                        onClose={() => handleCloseModal()}
                                    />
                                </View>
                            </Modal>
                            <PastSessions />
                           
                            <HubsAssignments />
                          
                        </View>
                    </ScrollView>
                </View>
            </View>
            {/* Modal to show meetings */}
            <Modal
              visible={isModalVisible}
              transparent={true}
              onRequestClose={() => setisModalVisible(false)}
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ width: '80%', height: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>All Sessions</Text>

                  {loading ? (
                    <ActivityIndicator size="large" color="#206C00" />
                  ) : meetingsData.length > 0 ? (
                    <ScrollView style={{ flex: 1 }}>
                      {meetingsData.map((hub, index) => (
                        <View key={index} style={{ marginBottom: 20 }}>
                          <Text style={{ fontWeight: "600", fontSize: 16 }}>{hub.coaching_hub_name}</Text>

                          {hub.meeting && Object.values(hub.meeting).length > 0 ? (
                            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginTop: 10 }}>
                              {/* Table Header */}
                              <View style={{ flexDirection: 'row', backgroundColor: '#f2f2f2', padding: 10 }}>
                                <Text style={{ flex: 1, fontWeight: "bold" }}>Description</Text>
                                <Text style={{ flex: 1, fontWeight: "bold" }}>Date</Text>
                                <Text style={{ flex: 1, fontWeight: "bold" }}>Time</Text>
                                <Text style={{ flex: 1, fontWeight: "bold" }}>Actions</Text>
                              </View>

                              {/* Table Rows */}
                              {Object.values(hub.meeting).map((meeting, idx) => (
                                <View key={idx} style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                                  <Text style={{ flex: 1 }}>{meeting.description}</Text>
                                  <Text style={{ flex: 1 }}>{new Date(meeting.date).toLocaleDateString()}</Text>
                                  <Text style={{ flex: 1 }}>{meeting.time}</Text>

                                  {/* Actions */}
                                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {meeting.candidate_link && (
                                      <TouchableOpacity
                                        onPress={() => handleJoinlink(meeting.candidate_link)}
                                        style={{
                                          backgroundColor: "#206C00",
                                          padding: 5,
                                          borderRadius: 5,
                                            width: 100
                                        }}
                                      >
                                        <Text style={{ color: "white", textAlign: "center", fontSize: 12 }}>Join</Text>
                                      </TouchableOpacity>
                                    )}

                                      <TouchableOpacity
                                          onPress={() => handleJoinMeeting(meeting, hub.id, hub.user_id)} // Pass hub.id and hub.user_id
                                          style={{
                                            backgroundColor: "coral",
                                            padding: 5,
                                            borderRadius: 5,
                                              width: 100
                                          }}
                                        >
                                          <Text style={{ color: "white", textAlign: "center", fontSize: 12 }}>Register</Text>
                                        </TouchableOpacity>
                                  </View>
                                </View>
                              ))}
                            </View>
                          ) : (
                            <Text>No meetings available</Text>
                          )}
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text>No meetings available</Text>
                  )}

                  <TouchableOpacity onPress={() => setisModalVisible(false)} style={{ marginTop: 20, alignSelf: 'center' }}>
                    <Text style={{ color: 'green' }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

             <CustomAlert
              visible={alertVisible}
              title={t("Alert")}
              message={alertMessage}
              onConfirm={hideAlert}
            />

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        marginLeft: -60,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(225,225,212,0.3)",
        backgroundColor: "#f7fff4",
    },
    item: {
        marginBottom: 10, // space between items
    },
    selectedItem: {
        backgroundColor: "#135837",
        borderColor: "#135837",
        borderWidth: 2,
        borderRadius: 5,
        marginRight: 20,
    },
    unselectedItem: {
        backgroundColor: "#fff",
        borderColor: "#135837",
        borderWidth: 2,
        borderRadius: 5,
        marginRight: 20,
    },
    hubText: {
        padding: 5,
        paddingHorizontal: 15,
        fontFamily: "Roboto-Light",
    },
    selectedText: {
        color: "#fff", // white text
    },
    unselectedText: {
        color: "#206C00", // green text
    },
    hubName: {
        color: "#206C00",
        borderColor: "#63EC55",
        borderWidth: 2,
        padding: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        fontFamily: "Roboto-Light",
        fontSize: 16,
        marginLeft: 10,
        marginTop: 5,
    },
    newHubButton: {
        justifyContent: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
        borderColor: "#f7fff4",
        backgroundColor: "rgba(211,249,216,0.3)",
        width: 150,
        alignItems: "center",
        marginTop: 20,
        marginLeft: 50,
        borderWidth: 1,
    },
    newHubText: {
        fontSize: 13,
        color: "#f7fff4",
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "Roboto-Light",
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 50,
        maxWidth: "90%",
        marginLeft: 50,
    },
    box: {
        backgroundColor: "#f7fff4",
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        width: "22%",
        height: 150,
        borderWidth: 2,
        borderColor: "rgba(225,225,212,0.3)",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    nextMeetingTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#206C00",
        fontFamily: "Roboto-Light",
    },
    meetingDetail: {
        fontSize: 14,
        color: "#206C00",
        fontFamily: "Roboto-Light",
    },
    joinButton: {
        marginTop: 10,
        backgroundColor: "#206C00",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    joinText: {
        color: "#f7fff4",
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "Roboto-Light",
    },
    hubDescriptionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#206C00",
        marginBottom: 10,
        fontFamily: "Roboto-Light",
    },
    hubDescription: {
        fontSize: 14,
        color: "#206C00",
        textAlign: "center",
        fontFamily: "Roboto-Light",
    },
    modalContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    confirmationTitle: {
        fontSize: 14,
        color: "black",
        fontWeight: "bold",
        fontFamily: "Roboto-Light",
    },
    attendanceConfirmation: {
        fontSize: 12,
        marginRight: 10,
        fontWeight: "600",
        fontFamily: "Roboto-Light",
    },
    boximage: {
        width: 30,
        height: 30,
        marginTop: -10,
        marginLeft: 10,
    },
    attendantTitle: {
        fontSize: 14,
        color: "black",
        fontWeight: "bold",
        marginTop: 10,
        fontFamily: "Roboto-Light",
    },
    confirmedCount: {
        fontSize: 16,
        marginRight: 10,
        fontWeight: "bold",
        color: "#206C00",
        fontFamily: "Roboto-Light",
    },
    unconfirmedTitle: {
        fontSize: 14,
        color: "black",
        fontWeight: "bold",
        marginTop: 10,
        fontFamily: "Roboto-Light",
    },
    unconfirmedCount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "red",
        marginTop: 5,
        fontFamily: "Roboto-Light",
    },
    image: {
        width: 20,
        height: 20,
        marginTop: 5,
        tintColor: "#666",
        marginLeft: 100,
    },
    switchrow: {
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
    },
    switchLabel: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 10,
        color: "#206C00",
        fontFamily: "Roboto-Light",
    },
});

export default MyComponent;