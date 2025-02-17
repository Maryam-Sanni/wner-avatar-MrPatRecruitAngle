import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground, ScrollView, Picker, Modal, Image } from 'react-native';
import { Button } from 'react-native-paper';
import Topbar from '../components/expertstopbar';
import Sidebar from '../components/expertssidebar';
import OpenModal from '../Experts/TicketsResponse';
import OpenModal2 from '../Experts/TicketsResponse2';
import OpenModal3 from '../Experts/TicketsResponse3';
import OpenModal4 from '../Experts/RequestGuideEdit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to calculate the difference in days
const getRemainingDays = (deadline) => {
  const currentDate = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - currentDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Returns the remaining days
};

const TicketsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isPressed, setIsPressed] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
   const [currentTicketTitle, setCurrentTicketTitle] = useState('');
   const [requests, setRequests] = useState([]);
   const [activeRequests, setActiveRequests] = useState([]); 
   const [acceptedRequests, setAcceptedRequests] = useState([]);   const [completedRequests, setCompletedRequests] = useState([]);

   const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch requests from API
  const fetchRequests = async () => {
    const url = `${apiUrl}/api/expert/get-pending-reqs`;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        const transformedRequests = result.data.map((item) => ({
          id: item.id,
          user_id: item.user_id,
          name: item.name || 'NIL',
          service: item.title,
          category: item.specialization,
          deadline: item.deadline,
          description: item.description,
          status: 'New Request',
          deadlineStatus: 'On Time State',
          preference: item.prefmode,
          attachment: item.attachment,
        }));

        setRequests(transformedRequests);
        setActiveRequests(transformedRequests);
      } else {
        throw new Error(result.message || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error.message);
    }
  };

  const fetchAcceptedRequests = async () => {
    const url = `${apiUrl}/api/expert/accepted-request`;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        const transformedRequests = result.data.map((item) => ({
          id: item.id,
          user_id: item.user_id,
          name: item.name || 'NIL',
          service: item.title,
          category: item.specialization,
          deadline: item.deadline,
          description: item.description,
          status: 'New Request',
          deadlineStatus: 'On Time State',
          preference: item.prefmode,
          attachment: item.attachment,
        }));
        
        setAcceptedRequests(transformedRequests);
      } else {
        throw new Error(result.message || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error.message);
    }
  };
  
  const handleAccept = async (requestId) => {
    const request = activeRequests.find((req) => req.id === requestId);
    if (!request) {
      console.error(`Request with ID ${requestId} not found.`);
      return;
    }

    const { user_id } = request; // Extract user_id from the request object
    const url = `${apiUrl}/api/expert/accept-request/${requestId}`;

    try {
      // Retrieve token and expert name from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      const firstName = await AsyncStorage.getItem('first_name');
      const lastName = await AsyncStorage.getItem('last_name');
      const expert_name = `${firstName || ''} ${lastName || ''}`.trim();

      if (!token) throw new Error('No authentication token found');

      const payload = {
        status: 'accepted',
        user_id, 
        expert_name,
        request_id: requestId,
      };

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const acceptedRequest = activeRequests.find((request) => request.id === requestId);
        setAcceptedRequests((prevState) => [...prevState, acceptedRequest]);
        setActiveRequests((prevState) =>
          prevState.filter((request) => request.id !== requestId)
        );
      }
    } catch (error) {
      console.error('Error accepting request:', error.response?.data?.message || error.message);
    }
    window.location.reload();
  };


  // Handle decline logic
  const handleDecline = async (requestId) => {
    const url = `${apiUrl}/api/expert/decline-request/${requestId}`;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.post(
        url,
        { status: 'declined' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setActiveRequests((prevState) =>
          prevState.filter((request) => request.id !== requestId)
        );
      }
    } catch (error) {
      console.error('Error declining request:', error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchAcceptedRequests();
  }, []);

 
   // Filter the activeRequests based on selectedCategory
   const filteredRequests = selectedCategory
     ? activeRequests.filter((request) => request.category === selectedCategory)
     : activeRequests;
  

  const getColorByPreference = (preference) => {
    switch (preference) {
      case 'text':
        return '#FFDBBB';
      case 'voice':
        return '#c1e1c1';
      case 'video':
        return '#B6D0E2';
      default:
        return '#B6D0E2';
    }
  };
  
  const handleSaveRequest = async (key, request) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(request));
      console.log('Request saved successfully:', request);
    } catch (error) {
      console.error('Error saving request:', error);
    }
  };

  const handleOpenPress = async (request) => {
    console.log('Opening request:', request); // Log the request being passed to handleSaveRequest
    await handleSaveRequest('selectedRequest', request);
    setModalVisible(true);
  };

  const handleOpenPress4 = () => {
    setModalVisible4(true);
  };

  const handleCloseModal4 = () => {
    setModalVisible4(false);
  };
  
  useEffect(() => {
    const fetchCompletedRequests = async () => {
      try {
        // Get the token from AsyncStorage
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          console.error("Token not found in AsyncStorage.");
          setError("Authentication token is missing.");
          setLoading(false);
          return;
        }

        // Fetch completed requests
        const response = await axios.get(`${apiUrl}/api/expert/completed-request`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
          // Set completed requests
          setCompletedRequests(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Failed to fetch completed requests.");
        }
      } catch (error) {
        console.error("Error fetching completed requests:", error);
        setError("An error occurred while fetching completed requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedRequests();
  }, []); 
  
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOpenPress2 = async (request) => {
    await handleSaveRequest('selectedRequest', request);
    setModalVisible2(true);
  };

  const handleCloseModal2 = () => {
    setModalVisible2(false);
  };
  
  const handleOpenPress3 = async (request) => {
    await handleSaveRequest('selectedRequest', request);
    setModalVisible3(true);
  };

  const handleCloseModal3 = () => {
    setModalVisible3(false);
  };

  return (
    <ImageBackground
    source={require ('../assets/backgroundimg2.png') }
    style={{ height: '100%', width: '100%',flex: 1}}
    >
      <View style={{ flex: 1 }}>
        <Topbar />
        <View style={styles.mainContainer}>
          <Sidebar />
          <View style={styles.content}>
            <View style={styles.header}>
              <Button mode="text" 
                textColor="#000000"
                style={styles.button} 
                onPress={handleOpenPress4}
                icon={() => (
                  <Image
                    source={{
                      uri: 'https://img.icons8.com/?size=100&id=Da9Xe1TFL49g&format=png&color=000000',
                    }}
                    style={{ width: 20, height: 20 }}
                  />
                )}>Edit Guide</Button>

              <Picker
                selectedValue={selectedCategory}
                style={styles.picker}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <Picker.Item label="All Category" value="" />
              <Picker.Item label="SAP FI" value="SAP FI" />
              <Picker.Item label="SAP MM" value="SAP MM" />
              <Picker.Item label="SAP SD" value="SAP SD" />
              <Picker.Item label="SAP PP" value="SAP PP" />
              <Picker.Item label="Microsoft Dynamics Sales" value="Microsoft Dynamics Sales" />
              <Picker.Item label="Microsoft Dynamics Customer Service" value="Microsoft Dynamics Customer Service" />
              <Picker.Item label="Microsoft Dynamics Field Service" value="Microsoft Dynamics Field Service" />
              <Picker.Item label="Microsoft Dynamics CRM Developer" value="Microsoft Dynamics CRM Developer" />
              <Picker.Item label="Microsoft Business Central" value="Microsoft Business Central" />
              <Picker.Item label="Microsoft Power Platform Developer" value="Microsoft Power Platform Developer" />
              <Picker.Item label="Microsoft Dynamics F&O" value="Microsoft Dynamics F&O" />
              </Picker>
              
            </View>
            
            <View style={styles.progressBar}>
              <View style={styles.progressStep}>
                <Text style={styles.stepText}>New Request</Text>
              </View>
               <View style={styles.progressStep}>
                <Text style={styles.stepText}>* To do</Text>
              </View>
               <View style={styles.progressStep}>
                <Text style={styles.stepText}>* To do status</Text>
              </View>
               <View style={styles.progressStep}>
                <Text style={styles.stepText}>Ratings</Text>
              </View>
            </View>
            <ScrollView contentContainerStyle={styles.ticketContainer}>
              <View style={{flexDirection: 'column', maxWidth: '100%'}}>
                <View style={{flexDirection: 'row', maxWidth: '100%'}}>
                  <View style={{ flexDirection: 'column', width: '24%', marginRight: 5, marginLeft: 5 }}>
                    {filteredRequests.map((request) => (
                      <View key={request.id}>
                        <View style={styles.smallstep0}>
                          <View style={{ flexDirection: 'row' }}>
                            <Image
                              source={{
                                uri: "https://img.icons8.com/?size=100&id=JfOkE4KGyx7r&format=png&color=000000",
                              }}
                              style={{
                                width: 40,
                                height: 40,
                                marginRight: 10,
                                borderRadius: 20,
                                borderWidth: 1,
                                padding: 10,
                              }}
                            />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>{request.name}</Text>
                          </View>
                          <View style={{ flexDirection: 'column', marginTop: 10 }}>
                            <View style={{ flexDirection: 'column' }}>
                            
                              <Text style={{ fontSize: 14, fontWeight: '600' }}>{request.service}</Text>
                            </View>
                            
                          <Text style={{ fontSize: 14, marginTop: 5, marginBottom: 5 }}>
                            {request.category}
                          </Text>
                           
                                
                                <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 10 }}>
                                  {new Date(request.deadline).toLocaleDateString()} - {new Date(request.deadline).toLocaleTimeString()}
                                </Text>
                              </View>

                          <View style={{ flexDirection: 'row',}}>
                            <TouchableOpacity style={styles.submitButton} onPress={() => handleDecline(request.id)}>
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'black', fontSize: 16, textAlign: 'center' }}>Decline</Text>
                                <Image
                                  source={{
                                    uri: "https://img.icons8.com/?size=100&id=10267&format=png&color=000000",
                                  }}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    marginLeft: 10,
                                  }}
                                />
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton1} onPress={() => handleAccept(request.id)}>
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'black', fontSize: 16, textAlign: 'center' }}>Accept</Text>
                                <Image
                                  source={{
                                    uri: "https://img.icons8.com/?size=100&id=60010&format=png&color=000000",
                                  }}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    marginLeft: 10,
                                  }}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>

                          
                        </View>
                      </View>
                    ))}
                  </View>
              

                  <View style={{flexDirection: 'column', width: '24%', marginRight: 10, marginLeft: 10}}>
                    {acceptedRequests.map((request) => (
                      <View key={request.id}>
                  <View style={styles.smallstep}>
                    <View style={{flexDirection: 'row'}}>
                       <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold' }}>{request.name}</Text>
                     
                      </View>
                     <Text style={{fontSize: 14, color: 'grey', marginTop: 20, }}>{request.description}</Text>
                       <Text style={{fontSize: 14, marginTop: 5, fontWeight: '600', color: 'black' }}>Deadline: {new Date(request.deadline).toLocaleDateString()} - {new Date(request.deadline).toLocaleTimeString()}</Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: 0,
                        width: "100%",
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        backgroundColor: getColorByPreference(request.preference),
                        padding: 10,
                        marginLeft: -20,
                        marginRight: -20,
                      }}
                      onPress={() => {
                        if (request.preference === 'text') {
                          handleOpenPress(request);
                        } else if (request.preference === 'voice') {
                          handleOpenPress3(request);
                        } else if (request.preference === 'video') {
                          handleOpenPress2(request);
                        }
                      }}
                    >
                     <Image
    source={{
      uri: request.preference === "text"
        ? "https://img.icons8.com/?size=100&id=55907&format=png&color=000000"
        : request.preference === "voice"
        ? "https://img.icons8.com/?size=100&id=16071&format=png&color=000000"
        : "https://img.icons8.com/?size=100&id=11374&format=png&color=000000",
    }}
    style={{
      width: 20,
      height: 20,
position: 'absolute',
right: 10
    }}
  />
  <Text style={{ fontSize: 15, textAlign: 'center' }}>
    {request.preference === "text"
      ? "Preffered Text - Start Typing"
      : request.preference === "voice"
      ? "Preffered Voice - Start Recording"
      : "Preffered Video - Join Call"}
  </Text>
                    </TouchableOpacity>
                      </View>
                      </View>
                        ))}
                      
                    
                    
                  </View>

                  <View style={{flexDirection: 'column', width: '24%'}}>
                    {acceptedRequests.map((request) => {
                      const remainingDays = getRemainingDays(request.deadline);
                      const isDeadlineState = remainingDays <= 2;
                      const isOnTimeState = remainingDays > 2;

                      return (
                        <View key={request.id}>
                          {/* Show "Deadline State" if deadline is within 2 days */}
                          {isDeadlineState && (
                            <View style={styles.smallstep1}>
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 20, color: 'black', fontWeight: '600' }}>
                                  Deadline State
                                </Text>
                                <Image
                                  source={{
                                    uri: "https://img.icons8.com/?size=100&id=jZGjc3FZtRYv&format=png&color=000000",
                                  }}
                                  style={{
                                    width: 80,
                                    height: 80,
                                    position: 'absolute',
                                    right: 20,
                                    top: -30,
                                  }}
                                />
                                <Text
                                  style={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    fontSize: 18,
                                    padding: 5,
                                    width: 100,
                                    textAlign: 'center',
                                    position: 'absolute',
                                    right: 10,
                                    marginTop: 37,
                                  }}
                                >
                                  DEADLINE
                                </Text>
                              </View>
                            </View>
                          )}

                          {/* Show "On Time State" if deadline is more than 2 days away */}
                          {isOnTimeState && (
                            <View style={styles.smallstep1}>
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 20, color: 'black', fontWeight: '600' }}>
                                  On Time
                                </Text>
                                <Image
                                  source={{
                                    uri: "https://img.icons8.com/?size=100&id=13026&format=png&color=000000",
                                  }}
                                  style={{
                                    width: 80,
                                    height: 80,
                                    position: 'absolute',
                                    right: 20,
                                    top: -20,
                                  }}
                                />
                              </View>
                            </View>
                          )}
                              </View>
                            );
                          })}
                  

                  </View>
                  <View style={{flexDirection: 'column', width: '24%'}}>
                    {completedRequests.length > 0 ? (
                      completedRequests.map((request) => (
                        <View key={request.id} style={styles.smallstep2}>
                          {/* Request Details */}
                          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                            Specialization: {request.specialization || "N/A"}
                          </Text>
                          <Text style={{ fontSize: 14 }}>
                            Title: {request.title || "N/A"}
                          </Text>
                          <Text style={{ fontSize: 14 }}>
                            Description: {request.description || "N/A"}
                          </Text>
                          <Text style={{ fontSize: 14 }}>
                            Assigned From: {request.name || "N/A"}
                          </Text>
                          <Text style={{ fontSize: 14 }}>
                            Completed At: {request.updated_at || "N/A"}
                          </Text>

                          {/* Rating */}
                          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: "600", marginRight: 10 }}>Rating:</Text>
                            <Text style={styles.emoji}>
                              {request.rating === 4
                                ? "😄"
                                : request.rating === 3
                                ? "😊"
                                : request.rating === 2
                                ? "😐"
                                : "😞"}
                            </Text>
                            <Text style={styles.ratingText}>
                              {request.rating === 4
                                ? "Excellent"
                                : request.rating === 3
                                ? "Good"
                                : request.rating === 2
                                ? "Satisfactory"
                                : "Poor"}
                            </Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text>No completed requests found.</Text>
                    )}
                  </View>

              </View>
                
              </View>
            </ScrollView>
          </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContent}>
          <OpenModal onClose={handleCloseModal} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={handleCloseModal2}
      >
        <View style={styles.modalContent}>
          <OpenModal2 onClose={handleCloseModal2} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible3}
        onRequestClose={handleCloseModal3}
      >
        <View style={styles.modalContent}>
          <OpenModal3 onClose={handleCloseModal3} />
        </View>
      </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible4}
            onRequestClose={handleCloseModal4}
          >
              <View style={styles.modalContent}>
                <OpenModal4 onClose={() => handleCloseModal4()} />
              </View>
          </Modal>
            </View>
          </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10
  },
  background: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  mainContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    marginLeft: 200,
  },
  picker: {
    height: 40,
    width: "24%",
    borderWidth: 1,
    borderColor: '#206C00',
    position: 'absolute',
    right: 20,
    backgroundColor: 'white',
  },
  smallstep0: {
    width: "100%", 
    height: 200,
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'green',
    backgroundColor: "white",
    padding: 20,
  borderRadius: 10,
  shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  smallstepB: {
    width: "100%", 
    height: 200,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'green',
    backgroundColor: "white",
    padding: 20,
  borderRadius: 10,
  shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  smallstepV: {
    width: "100%", 
    height: 200,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'green',
    backgroundColor: "white",
    padding: 20,
  borderRadius: 10,
  shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  smallstep: {
    width: "100%", 
    height: 200,
    marginBottom: 10,
  borderWidth: 1,
    borderColor: 'green',
    backgroundColor: "#F5F5F5",
    padding: 20,
  borderRadius: 10,
  shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
      smallstep1: {
        width: "100%", 
      marginLeft: 5,
        height: 200,
        marginBottom: 10,
      borderWidth: 1,
        borderColor: 'green',
        backgroundColor: "#F5F5F5",
        justifyContent: 'center',
        padding: 20,
      borderRadius: 10,
      shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      smallstep2: {
        width: "100%", 
        height: 200,
        marginLeft: 20,
        justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'green',
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 40,
  },
  progressStep: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'green',
    marginHorizontal: 7,
    borderRadius: 5,
  },
  activeStep: {
    backgroundColor: '#3F5637',
  },
  stepText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: 'lightgrey',
    width: '50%',
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center'
  },
  submitButton3: {
    backgroundColor: '#B6D0E2',
    width: 150,
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    marginLeft: 15,
    justifyContent: 'center'
  },
  submitButton2: {
    backgroundColor: '#c1e1c1',
    width: 150,
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    marginLeft: 15,
    justifyContent: 'center'
  },
  submitButton1: {
    backgroundColor: '#FFDBBB',
    width: '50%',
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    marginLeft: 10 ,
    marginRight: 10,
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginTop: -20,
    marginLeft: -10,
    marginRight: -20,
    marginBottom: 10,
    shadowColor: '#FFFFFF', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5, 
  }, 
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headertext: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 7,
    color: '#666',
    fontFamily:"Roboto-Light"
  },
});

export default TicketsPage;
