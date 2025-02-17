import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, TextInput, Image, ScrollView, Picker, Alert } from 'react-native';
import { useNavigate } from 'react-router-dom';
import DateTimePickerModal from "../components/DateTimePickerModal";
import { useFonts } from 'expo-font';
import { useTranslation } from 'react-i18next';
import PaymentDetails from './PaymentDetails';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/CustomAlert';
import { format } from 'date-fns';

function MyComponent({ onClose }) {
   const navigate = useNavigate();
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
      const [paymentModalVisible, setPaymentModalVisible] = useState(false);
        const [paymentRequired, setPaymentRequired] = useState(false);
        const [specialization, setSpecialization] = useState('');
  const [token, setToken] = useState("");
  const [type, setSelectedType] = useState('Personal');
  const [title, setTitle] = useState('Advancing in my current career path');
  const [role, setRole] = useState('');
  const [result_description, setResultDescription] = useState('');
  const [how_to_achieve, setHowToAchieve] = useState('');
  const [achieve_the_objective, setNeeds] = useState('');
  const [review_with_coach, setreviewwithcoach] = useState('Biannually');
  const [starting_level, setStartingLevel] = useState('Beginner');
  const [target_level, setTargetLevel] = useState('Junior');
  const [end_date, setEndDate] = useState('12 Months');
  const [status, setStatus] = useState('Active');
  const [coach, setCoach] = useState('');
   const [feedbacks, setFeedback] = useState('Read only field');
  const [expert_available_days, setExpertAvailableDays] = useState('');
  const [expert_available_time, setExpertAvailableTime] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [candidate, setCandidate] = useState("Individual");
  const [expertid, setExpertid] = useState(" ");
   const [meetingtype, setType] = useState("growth");
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;
  
  const gotoCV = () => {
      navigate('/growth-plan-sessions');
  };

  // Options for the picker (goals someone might want to achieve with expert help)
  const goals = [
    'Advancing in my current career path',
    'Shifting to a new career or industry',
    'Improving technical skills',
    'Enhancing leadership or management skills',
    'Learning a new skill',
    'Expert Guidance on career growth or promotion',
  ];

  // Handle selection change from the picker
  const handlePickerChange = (value) => {
    setTitle(value); // Set the goal state when a goal is selected
  };

  useEffect(() => {
    const fetchPaymentDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                return;
            }

            const response = await fetch(`${apiUrl}/api/jobseeker/get-paystack-payment-details`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            // Check if "Pay as you go" is set in the response
            if (data?.PaystackDetail?.payment_detail === 'Pay as you go') {
                setPaymentRequired(true);
            }

            // Set the specialization from the response
            if (data?.PaystackDetail?.specialization) {
              setRole(data.PaystackDetail.specialization);
            }

        } catch (error) {
            console.error('Error fetching payment details:', error);
        }
    };

    fetchPaymentDetails();
}, []); // Empty dependency array to run this effect only once on mount

const [isLoading, setIsLoading] = useState(false);
const [email, setEmail] = useState(false);
const initiatePayment = async () => {
  try {
    // Retrieve values from AsyncStorage
    const values = await AsyncStorage.multiGet(['first_name', 'last_name', 'email']);
    const firstName = values.find(item => item[0] === 'first_name')?.[1] || "";
    const lastName = values.find(item => item[0] === 'last_name')?.[1] || "";
    const email = values.find(item => item[0] === 'email')?.[1] || "";

    // Combine first and last name
    const fullName = `${firstName} ${lastName}`;
    setEmail(email);

    // Get token from AsyncStorage for authorization
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "Authorization token not found.");
      return false; // Indicate failure
    }

    // Fetch payment details from backend
    const paymentDetailsResponse = await axios.get(`${apiUrl}/api/jobseeker/get-paystack-payment-details`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Check if response is successful
    if (paymentDetailsResponse?.data?.status !== "success") {
      Alert.alert("Error", "Failed to retrieve payment details.");
      return false; // Indicate failure
    }

    // Extract and parse card details
    const rawCardDetails = paymentDetailsResponse.data.PaystackDetail.card_detail;
    console.log("Raw Card Details:", rawCardDetails); // Debugging

    // Check if rawCardDetails exists and is a valid JSON string
    let cardDetailsArray;
    try {
      cardDetailsArray = JSON.parse(rawCardDetails);
    } catch (parseError) {
      console.error("Error parsing card details:", parseError);
      Alert.alert("Error", "Failed to parse card details.");
      return false;
    }

    // Ensure we have at least one card
    if (!Array.isArray(cardDetailsArray) || cardDetailsArray.length === 0) {
      Alert.alert("Error", "No card details found.");
      return false;
    }

    const cardDetails = cardDetailsArray[0]; // Get first card
    console.log("Extracted Card Details:", cardDetails);

    // Extract expiry month and year correctly
    const [expMonth, expYear] = cardDetails.exp_date.split("/");

    // Construct payment payload
    const paymentPayload = {
      email: email,
      name: fullName,
      plan: "pay_as_you_go",
      amount: "40",
      card_number: cardDetails.cardnumber,
      cvv: cardDetails.cvv,
      expiry_month: expMonth,
      expiry_year: expYear,
    };

    console.log("Final Payment Payload:", paymentPayload); // Debugging

    // Log headers and payload before making the request
    console.log("Making payment request with token:", token);
    console.log("Payment URL:", `${apiUrl}/api/jobseeker/charge-card`);

    // Make the payment request to the backend
    const paymentResponse = await axios.post(`${apiUrl}/api/jobseeker/charge-card`, paymentPayload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Log the full payment response for debugging
    console.log("Payment Response:", paymentResponse);

    // Check if the HTTP status code is 200 (successful)
    if (paymentResponse.status === 200) {
      return true; // Indicate success
    } else {
      console.error("Payment Response Data:", paymentResponse?.data); // Log more details
      alert("We were unable to charge your card", "Payment initiation failed. Please check card details.");
      return false; // Indicate failure
    }
  } catch (error) {
    console.error("Payment Error:", error);

    // If error.response is undefined or null, handle it
    const errorMessage = error.response?.data?.message || error.message || "Please try again.";
    Alert.alert("An error occurred", errorMessage);
    return false; // Indicate failure
  }
};


const handlePaymentSuccess = () => {
    setPaymentModalVisible(false);
    setPaymentRequired(false);
};

  useEffect(() => {
      const getTokenAndUser = async () => {
          try {
              // Retrieve token and user data from AsyncStorage
              const storedToken = await AsyncStorage.getItem('token');
              setToken(storedToken);

              const storedFirstName = await AsyncStorage.getItem('selectedUserFirstName');
              const storedLastName = await AsyncStorage.getItem('selectedUserLastName');
              const storedExpertid = await AsyncStorage.getItem('selectedUserExpertid');
              const storedDays = await AsyncStorage.getItem('selectedUserDays');
              const storedTimes = await AsyncStorage.getItem('selectedUserTimes');
              const storedUserName = await AsyncStorage.getItem('selectedUserName'); // Retrieve expert_name


              if (storedFirstName && storedLastName) {
                  // If first_name and last_name are available
                  setCoach(`${storedFirstName} ${storedLastName}`);
              } else if (storedUserName) {
                  // If expert_name is available and first_name/last_name are not
                  setCoach(storedUserName);
              } else {
                  console.warn('No user data found');
              }

              // Set other user data
              setExpertid(`${storedExpertid}`);
              setExpertAvailableDays(`${storedDays}`);
              setExpertAvailableTime(`${storedTimes}`);

          } catch (error) {
              console.error('Error retrieving token or user:', error);
          }
      };

      getTokenAndUser();
  }, []);

  
 

  const handleConfirmDateTime = (dateTime) => {
    setSelectedDateTime(dateTime);
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    // Retrieve first_name and last_name from AsyncStorage
    const retrieveData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('first_name');
        const storedLastName = await AsyncStorage.getItem('last_name');
        if (storedFirstName !== null && storedLastName !== null) {
          console.log('Stored first_name:', storedFirstName);
          console.log('Stored last_name:', storedLastName);
          setFirstName(storedFirstName);
          setLastName(storedLastName);
        }
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };

    retrieveData();
  }, []);
  
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    };
    getToken();
  }, []);
  
  const goToPlan = async () => {
    if (paymentRequired) {
      const paymentSuccessful = await initiatePayment(); // Wait for payment to complete
      if (!paymentSuccessful) {
        return; // Stop execution if payment failed
      }
    }

    try {
      // Validate the form data before making the API request
      if ( !role || !title || !expert_available_days) {
      setAlertMessage(t('Please fill all fields'));
        setAlertVisible(true);
        return;
      }

      // Format selectedDateTime to Y-m-d H:i:s
      const formattedDate = format(selectedDateTime, "yyyy-MM-dd HH:mm:ss");

      const meetingFormData = new FormData();
      meetingFormData.append('candidate_account_type', candidate);
      meetingFormData.append('role', role);
      meetingFormData.append('expert_id', expertid);
      meetingFormData.append('type', meetingtype);
      meetingFormData.append('date_scheduled', formattedDate);

            // Retrieve data from AsyncStorage
            const guideRaw = await AsyncStorage.getItem('selectedUserGuides');

            const guide = guideRaw ? JSON.parse(guideRaw) : [];

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      // Post to create-jobseeker-interview endpoint
      const MeetingResponse = await axios.post(
        `${apiUrl}/api/jobseeker/meetings/schedule`,
        meetingFormData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      if (MeetingResponse.status !== 200) {
        onClose();
        return;
      }
      
      // Prepare the data for the API request
      const formData = {
        role,
        title,
        guide,
        starting_level,
        target_level,
        date_time: selectedDateTime,
        feedbacks,
        expert_available_days,
        expert_available_time,
        coach,
        expertid: expertid,
        name: first_name  + ' ' + last_name
      };

      // Make the GET request to check the subscription status
      const subscriptionResponse = await axios.get(
        `${apiUrl}/api/jobseeker/get-subscription`,
          { headers: { Authorization: `Bearer ${token}` } }
      );

      // Check if JSSubscriptionStatus exists and if subscribed is "Yes"
      const subscribed = subscriptionResponse?.data?.JSSubscriptionStatus?.subscribed;

      // Save the growth plan regardless of the subscription status
      const response = await axios.post(
        `${apiUrl}/api/jobseeker/create-jobseeker-growth-plan`, 
        formData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        await AsyncStorage.setItem('GrowthFormData', JSON.stringify(formData));

        // Navigate based on the subscription status
        if (subscribed === 'Yes') {
          navigate('/growth-plan-sessions');
        } else {
          navigate('/growth-plan-sessions');
        }

              onClose(); // Close the form/modal
            }
          } catch (error) {
            console.error('Error during save:', error);
            setAlertMessage('Failed to create Growth PlanSession');
            setAlertVisible(true);
          }
        };

  const hideAlert = () => {
    setAlertVisible(false);
  };


  const [fontsLoaded] = useFonts({
    'Roboto-Light': require("../assets/fonts/Roboto-Light.ttf"),
  });

  if (!fontsLoaded) {
    return null; // You can return a loading indicator here if you want
  }

  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F8F8', alignItems: 'center', marginTop: 40 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, maxHeight: 500 }}>
        <View style={styles.greenBox}>
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1f2d38e99b0016f2bd167d2cfd38ff0d43c9f94a93c84b4e04a02d32658fb401?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
              style={styles.logo}
            />
            <Text style={styles.headerText}>{t('Create New Growth Plan Objective')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={{ fontSize: 18, color: '#3F5637', fontWeight: 'bold', fontFamily: 'Roboto-Light' }}>✕</Text>
            </TouchableOpacity>
          </View>
        
          <View style={styles.container}>
            {/* Form fields */}
           
            <View style={styles.row}>
              <View style={[styles.cell, { flex: 1}]}>
                <Text style={{ fontFamily: 'Roboto-Light' }}>{t('Goal')}</Text>
              </View>
              <View style={[styles.cell, { flex: 2}]}>
              <Picker
        selectedValue={title}
        onValueChange={handlePickerChange}
        style={styles.picker}
      >
        {goals.map((goalOption, index) => (
          <Picker.Item key={index} label={goalOption} value={goalOption} />
        ))}
      </Picker>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, { flex: 1}]}>
                <Text style={{ fontFamily: 'Roboto-Light' }}>{t('Role')}</Text>
              </View>
              <View style={[styles.cell, { flex: 2}]}>
                <TextInput
                  placeholder="Example: SAP FI"
                  placeholderTextColor="grey"
                  style={styles.input}
                  value={role}
                  onChangeText={setRole}
                />
              </View>
            </View>
           
            
           
            
            <View style={styles.row}>
              <View style={[styles.cell, { flex: 1}]}>
                <Text style={{ fontFamily: 'Roboto-Light' }}>{t("Current level")}</Text>
              </View>
              <View style={[styles.cell, { flex: 2}]}>
                <Picker
                  selectedValue={starting_level}
                  style={styles.picker}
                  onValueChange={(itemValue) => setStartingLevel(itemValue)}
                >
                <Picker.Item label={t("Beginner")} value="Beginner" />
                   <Picker.Item label={t("Junior")} value="Junior" />
                  <Picker.Item label={t("Intermediate")} value="Intermediate" />
                  <Picker.Item label={t("Advanced")} value="Advanced" />
                </Picker>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, { flex: 1}]}>
                <Text style={{ fontFamily: 'Roboto-Light' }}>{t("Desired career level")}</Text>
              </View>
              <View style={[styles.cell, { flex: 2}]}>
                <Picker
                  selectedValue={target_level}
                  style={styles.picker}
                  onValueChange={(itemValue) => setTargetLevel(itemValue)}
                >
                <Picker.Item label={t("Junior")} value="Junior" />
                  <Picker.Item label={t("Senior")} value="Senior" />
                  <Picker.Item label={t("Manager")} value="Manager" />
                  <Picker.Item label={t("Senior Manager")} value="Senior Manager" />
                  <Picker.Item label={t("Solution Architect")} value="Solution Architect" />
                </Picker>
              </View>
            </View>
           
            
          </View>


          <Text style={{ fontSize: 15, color: 'black', marginLeft: 50, fontWeight: '500', marginTop: 30, marginBottom: -10, }}>{coach}'s {t("available days and time")}</Text>
          <View style={styles.container}>
            <View style={styles.row}>
              <View style={[styles.cell, { flex: 1}]}>
                <Text style={{ fontFamily: "Roboto-Light" }}>{t("Days")}</Text>
              </View>
              <View style={[styles.cell, { flex: 2}]}>
                <Text style={{ color: 'grey', fontFamily: "Roboto-Light" }}>
                  {expert_available_days}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, { flex: 1}]}>
                <Text style={{ fontFamily: "Roboto-Light" }}>Time</Text>
              </View>
              <View style={[styles.cell, { flex: 2}]}><Text style={{ color: 'grey', fontFamily: "Roboto-Light" }}>{expert_available_time}
                </Text>
              </View>
            </View>
          </View>

          <Text style={{ fontSize: 15, color: 'black', fontWeight: '500', marginTop: 30, marginBottom: -10, marginLeft: 50, marginRight: 50 }}>{t("Select day and time for growth plan session.")}</Text>
          <View style={styles.container}>
            <View style={styles.row}>
              <View style={[styles.cell, { flex: 1}]}>
                <Text style={{ fontFamily: "Roboto-Light" }}>{t("Date and Time")}</Text>
              </View>
              <View style={[styles.cell, { flex: 2}]}>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setIsModalVisible(true)}
                >
                  <Text style={{ fontFamily: "Roboto-Light", color: 'blue', textDecorationLine: 'underline' }}>
                    {selectedDateTime
                      ? selectedDateTime.toLocaleString()
                      : t("Select Date and Time")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.buttonplus} onPress={goToPlan} disabled={isLoading}>
  {isLoading ? (
    <ActivityIndicator size="small" color="#fff" /> // Show loading indicator while processing
  ) : (
    <Text style={styles.buttonTextplus}>{t("Save & Create Session")}</Text>
  )}
</TouchableOpacity>
          
        </View>
        <DateTimePickerModal
          isVisible={isModalVisible}
          mode="datetime"
          onConfirm={handleConfirmDateTime}
          onCancel={handleCancelModal}
        />
        <CustomAlert
          visible={alertVisible}
          title={t("Alert")}
          message={alertMessage}
          onConfirm={hideAlert}
        />
          <Modal
                        animationType="slide"
                        transparent={true}
                        visible={paymentModalVisible}
                        onRequestClose={() => setPaymentModalVisible(false)}
                      >
                          <View style={styles.modalContent}>
                            <PaymentDetails 
                              onClose={() => setPaymentModalVisible(false)} 
                              onPaymentSuccess={handlePaymentSuccess} 
                            />
                        </View>
                      </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#CCC',
    marginRight: 70,
    marginTop: 20,
    marginLeft: 50,
  },
  greenBox: {
    width: 920,
    backgroundColor: 'white',
    height: 1000
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
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    color: 'black',
    fontSize: 14,
  },
  buttonplus: {
    backgroundColor: 'coral',
    borderRadius: 5,
    padding: 10,
    marginLeft: 650,
    width: 200,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  buttonTextplus: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Roboto-Light',
  },
  input: {
    fontFamily: "Roboto-Light",
    paddingLeft: 5,
    fontSize: 14
  },
  input2: {
    fontFamily: "Roboto-Light",
    paddingLeft: 5,
    fontSize: 14,
    color: 'grey'
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
    fontFamily: 'Roboto-Light',
  },
});

export default MyComponent;
