import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, ImageBackground, TextInput, } from 'react-native';
import Sidebar from '../components/expertssidebar';
import Topbar from '../components/expertstopbar';
import { BlurView } from 'expo-blur';
import SkillsEditModal from '../components/SkillsEditModal';
import CertificationsEditModal from '../components/CertificationsEditModal';
import PreferredLocationsEditModal from '../components/PreferredLocationsEditModal';
import PreferredRolesEditModal from '../components/PreferredRolesEditModal';
import AboutEditModal from '../components/AboutEditModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useFonts} from "expo-font"
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const initialHistory = [
    {
      id: 1,
      position: 'Cloud Engineer',
      company: 'IBM',
      duration: 'May 2020 - Present',
      description: `- Deployed and managed over 50 Azure Virtual Machines (VMs) for internal and client-facing applications, optimizing resource allocation and ensuring high availability.
- Implemented Azure Active Directory for secure identity management, including multi-factor authentication and role-based access control (RBAC) for multiple client projects.
- Automated infrastructure deployment using Azure Resource Manager (ARM) templates, reducing manual configuration errors and deployment time by 30%.
- Designed and implemented scalable storage solutions using Azure Blob Storage and Azure File Storage, ensuring secure and efficient data management for enterprise-level applications.`,
    },
    {
      id: 2,
      position: 'Cloud Solutions Architect',
      company: 'Microsoft',
      duration: 'July 2015 - Jan 2020',
      description: `- Led the migration of on-premises workloads to Azure for several large enterprises, reducing infrastructure costs by 25% and improving application scalability.
- Implemented and managed Azure Kubernetes Service (AKS) clusters for microservices-based applications, enabling seamless scaling and efficient resource management.
- Integrated Azure DevOps for continuous integration and continuous deployment (CI/CD) pipelines, improving software delivery speed and quality for multiple client projects.
- Conducted security audits and implemented Azure Security Center recommendations, enhancing the security posture of cloud environments for Fortune 500 clients.`,
    },
    {
      id: 3,
      position: 'Junior Azure Consultant',
      company: 'Capgemini',
      duration: 'Sept 2012 - Feb 2015',
      description: `- Assisted in organizing and managing Azure resources through effective use of Azure Resource Groups, ensuring efficient resource allocation and streamlined management.
- Supported the setup and configuration of Azure Virtual Machines (VMs) for development and testing environments, contributing to project delivery timelines.
- Helped implement Azure Active Directory (Azure AD) for identity management, setting up role-based access control (RBAC) to secure cloud resources for clients.
- Monitored and diagnosed performance issues using Azure Monitor and Application Insights, assisting in maintaining the health and performance of client applications.`,
    },
  ];

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentHistory, setCurrentHistory] = useState(null);
  const [availableDays, setAvailableDays] = useState('Mon, Tue, Wed');
  const [hours, setHours] = useState('9:00 AM - 3:00 PM');
  const [special, setSpecial] = useState('');
   const [years, setYears] = useState('');
  const [totalBalance, setTotalBalance] = useState(null);
  const [loading, setLoading] = useState(null);
  const textInputRef = useRef(null);
  const textInputRef2 = useRef(null);

  useEffect(() => {
    // Function to fetch balance data with token from AsyncStorage
    const fetchBalance = async () => {
      try {
        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Make API request with token in headers
        const response = await fetch(`${apiUrl}/api/expert/get-balance`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.status === 'success' && data.bal) {
          setTotalBalance(data.bal.total_balance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Make API request with token in headers
        const response = await fetch(`${apiUrl}/api/expert/get-expert-profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.status === 'success' && data.profile) {
          setAbout(data.profile.about);
          setPreferredLocations(data.profile.location);
          setPreferredRole(data.profile.category);
          setSpecial(data.profile.specialization);
          setYears(data.profile.years_experience);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  
  const [employmentHistories, setEmploymentHistories] = useState(initialHistory);
  const [about, setAbout] = useState(`Alex Johnson is a dedicated Microsoft Azure expert with over 10 years of experience in cloud computing and IT infrastructure. With a Bachelor's degree in Computer Science from XYZ University and a Master's degree in Information Technology, Alex combines in-depth technical knowledge with a passion for innovative cloud solutions.`);
      const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const handleOpenPress = (history) => {
    setCurrentHistory(history);
    setModalVisible(true);
  };

  const handleSave = (updatedHistory) => {
    const updatedHistories = employmentHistories.map((history) =>
      history.id === updatedHistory.id ? updatedHistory : history
    );
    setEmploymentHistories(updatedHistories);
  };

  const handleSaveAbout = (newAbout) => {
    setAbout(newAbout);
  };

  const [skills, setSkills] = useState([
    'Kuberbetes Experience',
    'Cloud Platform',
    'Data backup and recovery',
    'Information security',
    'Application management'
  ]);

  const [skillsmodalVisible, setskillsModalVisible] = useState(false);

  const handleOpenSkills = () => {
    setskillsModalVisible(true);
  };

  const handleCloseModal = () => {
    setskillsModalVisible(false);
  };

  const handleSaveSkills = (newSkills) => {
    setSkills(newSkills);
  };

   const [preferredLocations, setPreferredLocations] = useState('');

  const [preferredLocationsModalVisible, setPreferredLocationsModalVisible] = useState(false);

  const handleOpenPreferredLocations = () => {
    setPreferredLocationsModalVisible(true);
  };

  const handleClosePreferredLocationsModal = () => {
    setPreferredLocationsModalVisible(false);
  };

  const handleSavePreferredLocations = (newPreferredLocations) => {
    setPreferredLocations(newPreferredLocations);
  };

  const [certifications, setCertifications] = useState([
    'Licensed Cloud Computing with Azure - [London/United Kingdom]',
    'Azure Administration Essential Training [LinkedIn Learning (Certification Course)]',
    'Architecting Microsoft Azure Solutions [edX]',
    'Microsoft Azure Cloud Engineering [Udemy Bootcamp]',
    'Microsoft Azure Fundamentals [Coursera]',
  ]);

  const [certificationsmodalVisible, setcertificationsModalVisible] = useState(false);

  const handleOpenCertifications = () => {
    setcertificationsModalVisible(true);
  };

  const handleClosecertificationsModal = () => {
    setcertificationsModalVisible(false);
  };

  const handleSaveCertifications = (newCertifications) => {
    setCertifications(newCertifications);
  };

  const [preferredRoles, setPreferredRoles] = useState([
    'Microsoft Azure',
  ]);
  
  const [preferredRole, setPreferredRole] = useState('Microsoft');
  const [preferredRolesModalVisible, setPreferredRolesModalVisible] = useState(false);

  const handleOpenPreferredRoles = () => {
    setPreferredRolesModalVisible(true);
  };

  const handleSavePreferredRole = (selectedRole) => {
    setPreferredRole(selectedRole);
  };

   const apiUrl = process.env.REACT_APP_API_URL;
  
  const [fontsLoaded]=useFonts({
    'Roboto-Light':require("../assets/fonts/Roboto-Light.ttf"),
  })
  const {t}=useTranslation()

  const handleSaveall = async () => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('Token not found. Please sign in again.');
        return;
      }

      // Prepare data for API request
      const data = {
        about: about,
        skills: skills,
        certifications: certifications,
        location: String(preferredLocations), 
        category: preferredRole,
        specialization: special,
        years_experience: years
      };

      // Send POST request to API
      const response = await axios.post(`${apiUrl}/api/expert/update-profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Save Days Response:', response.data);
        alert('Your Profile has been successfully saved.');

      } else {
        alert('Failed to save. Please try again.');
      }
    } catch (error) {
      console.error('Save Error:', error);
      alert('Failed to save. Please try again.');
    }
  };

  // Function to focus on TextInput
  const handleFocus = () => {
    if (textInputRef.current) {
      textInputRef.current.focus(); // Step 2: Focus the TextInput
    }
  };

  const handleFocus2 = () => {
    if (textInputRef2.current) {
      textInputRef2.current.focus(); // Step 2: Focus the TextInput
    }
  };
  
  return (
    <ImageBackground
    source={require ('../assets/Background.png') }
  style={{ height: '110%', width: '100%',flex: 1}}
>
<BlurView intensity={70} style={styles.blurBackground}>
    <View style={{ flex: 1 }}>
      <Topbar />
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Sidebar />
         <ScrollView contentContainerStyle={{ flexGrow: 1, maxHeight: 500 }}>
         <View style={styles.glassBox}>
         <View style={styles.pagecontainer}>
         <View style={{ padding: 20 }}>
            <View style={{ flex: 1 }}>
              {/* Profile Card */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 50 }}>
              <View style={{ flex: 1, alignSelf: "flex-start" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold",fontFamily:"Roboto-Light", marginBottom: 20 }}>{t("My Profile")}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Image
                    source={require("../assets/account.png")}
                    style={{ width: 79, height: 79, borderRadius: 79, marginRight: 20 }}
                    resizeMode="cover"
                  /> 
                </View>
                </View>
               
           <View style={{ alignItems: 'flex-end', alignSelf: 'flex-start', justifyContent: 'center', marginRight: 20 }}>
                   <Text style={{ fontSize: 16, color: '#206C00', textAlign: 'right', marginBottom: 5, fontWeight: '600' }}>{t("Available Balance")}</Text>
             <Text style={{ fontSize: 36, marginBottom: 5, fontWeight: '600' }}>${totalBalance !== null ? totalBalance : '0'}.00</Text>
                  
                  
                 </View>
               </View>
             </View>
           </View>

          {/* Profile Description */}
          <View style={{ marginTop: 20, marginRight: 30 }}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                      <Text style={{ fontSize: 18, textAlign: 'justify', fontWeight: '600', color: '#206C00', fontFamily:"Roboto-Light" }}>
                        {t("About Me")} </Text> 
                        <TouchableOpacity onPress={() => setAboutModalVisible(true)} style={{ marginLeft: 10 }}>
                        <Image
            source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6326875147d814303309b6b133e12c983f42b31e7c4e6b223f7fbc169c262b88?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
            style={{ width: 20, height: 20 }} // adjust width and height as needed
            resizeMode="cover" // or any other resizeMode that suits your need
          />
                        </TouchableOpacity> 
                       </View>
                      <Text style={{ fontSize: 14, textAlign: 'justify', fontFamily: "Roboto-Light" }}>{about}</Text>
                
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#CCC', marginTop: 30 }} />
            </View>
         
           
          

          {/* Skills */}
          <View style={{ marginTop: 20, marginRight: 30 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, textAlign: 'justify', fontWeight: 'bold', color: '#206C00',    fontFamily:"Roboto-Light"
 }}>{t("Technical Skills")}</Text>
        <TouchableOpacity onPress={handleOpenSkills}>
          <Image
            source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6326875147d814303309b6b133e12c983f42b31e7c4e6b223f7fbc169c262b88?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
            style={{ width: 20, height: 20 }} // adjust width and height as needed
            resizeMode="cover" // or any other resizeMode that suits your need
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginRight: 50 }}>
        <View style={styles.container}>
          <View style={styles.row}>
            {skills.map((skill, index) => (
              <Text key={index} style={[styles.text, { backgroundColor: '#d3f9d8' }]}>{skill}</Text>
            ))}
          </View>
        </View>
      </View>

      <SkillsEditModal
        visible={skillsmodalVisible}
        skills={skills}
        onClose={handleCloseModal}
        onSave={handleSaveSkills}
      />
    </View>
    
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#CCC',  marginTop: 30 }} />
                           {/* Certifications */}
                           <View style={{ marginTop: 20, marginRight: 30 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, textAlign: 'justify', fontWeight: '500', color: '#206C00' ,    fontFamily:"Roboto-Light"
}}>{t("Certifications")}</Text>
        <TouchableOpacity onPress={handleOpenCertifications}>
          <Image
            source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6326875147d814303309b6b133e12c983f42b31e7c4e6b223f7fbc169c262b88?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
            style={{ width: 20, height: 20 }} // adjust width and height as needed
            resizeMode="cover" // or any other resizeMode that suits your need
          />
        </TouchableOpacity>
      </View>
      <Text style={{ marginTop: 15, marginLeft: 5, fontSize: 14,    fontFamily:"Roboto-Light"
 }}>
        {certifications.map((cert, index) => (
          <Text key={index}>
            - {cert} {'\n'}
          </Text>
        ))}
      </Text>

      <CertificationsEditModal
        visible={certificationsmodalVisible}
        certifications={certifications}
        onClose={handleClosecertificationsModal}
        onSave={handleSaveCertifications}
      />
    </View>
 <View style={{ borderBottomWidth: 1, borderBottomColor: '#CCC', marginTop: 30 }} />
                      {/* Other Experience*/}
 
                     {/*Location*/}
                     <View style={{ marginTop: 20, marginRight: 30 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 18, textAlign: 'justify', fontWeight: '500', color: '#206C00',    fontFamily:"Roboto-Light"
 }}>{t("Location")}</Text>
                      <TouchableOpacity onPress={handleOpenPreferredLocations}>
                        <Image
                          source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6326875147d814303309b6b133e12c983f42b31e7c4e6b223f7fbc169c262b88?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
                          style={{ width: 20, height: 20 }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={{ marginRight: 50 }}>
        <View style={styles.container}>
          <View style={styles.row}>
              <Text style={[styles.text, { backgroundColor: '#d3f9d8',    fontFamily:"Roboto-Light"
              }]}>{preferredLocations}</Text>
          </View>
        </View>
      </View>

                    <PreferredLocationsEditModal
                      visible={preferredLocationsModalVisible}
                      preferredLocations={preferredLocations}
                      onClose={handleClosePreferredLocationsModal}
                      onSave={handleSavePreferredLocations}
                    />
                  </View>
                   {/*Roles*/}
                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#CCC', marginTop: 30 }} />
                    <View style={{ marginTop: 20, marginRight: 30 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, textAlign: 'justify', fontWeight: '500', color: '#206C00', fontFamily: 'Roboto-Light' }}>
                          {t('Specialization')}
                        </Text>
                        <TouchableOpacity onPress={handleOpenPreferredRoles}>
                          <Image
                            source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6326875147d814303309b6b133e12c983f42b31e7c4e6b223f7fbc169c262b88?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
                            style={{ width: 20, height: 20 }} // adjust width and height as needed
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{ marginRight: 50 }}>
                        <View style={styles.container}>
                          <View style={styles.row}>
                            <Text style={[styles.text, { backgroundColor: '#d3f9d8', fontFamily: 'Roboto-Light' }]}>
                              {preferredRole}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

           <View style={{ borderBottomWidth: 1, borderBottomColor: '#CCC', marginTop: 30 }} />
           <View style={{ marginTop: 20, marginRight: 30 }}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
               <Text style={{ fontSize: 18, textAlign: 'justify', fontWeight: '500', color: '#206C00', fontFamily: 'Roboto-Light' }}>
                 {t('What part of')} {preferredRole}  {t('do you specialize in')}?
               </Text>
               <TouchableOpacity onPress={handleFocus}>
                 <Image
                   source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6326875147d814303309b6b133e12c983f42b31e7c4e6b223f7fbc169c262b88?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
                   style={{ width: 20, height: 20 }}
                   resizeMode="cover"
                 />
               </TouchableOpacity>
             </View>
             <View style={{ marginRight: 50 }}>
               <View style={styles.container}>
                 <View style={styles.row}>
                   <TextInput
                     ref={textInputRef} 
                     style={[styles.text, { backgroundColor: '#d3f9d8', fontFamily: 'Roboto-Light', textAlign: 'flex-start', borderWidth: 1, borderColor: '#206C00', width: 180 }]}
                     placeholder="Example: Microsoft Azure"
                     placeholderTextColor="grey"
                     value={special}
                     onChangeText={setSpecial}
                   />
                 </View>
               </View>
             </View>
           </View>

           <View style={{ borderBottomWidth: 1, borderBottomColor: '#CCC', marginTop: 30 }} />
           <View style={{ marginTop: 20, marginRight: 30 }}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
               <Text style={{ fontSize: 18, textAlign: 'justify', fontWeight: '500', color: '#206C00', fontFamily: 'Roboto-Light' }}>
                 {t('How many years of experience do you have in')} {special}?
               </Text>
               <TouchableOpacity onPress={handleFocus2}>
                  <Image
                    source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6326875147d814303309b6b133e12c983f42b31e7c4e6b223f7fbc169c262b88?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
                    style={{ width: 20, height: 20 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
             </View>
             <View style={{ marginRight: 50 }}>
               <View style={styles.container}>
                 <View style={styles.row}>
                   <TextInput
                     ref={textInputRef2}
                     style={[styles.text, { backgroundColor: '#d3f9d8', fontFamily: 'Roboto-Light', textAlign: 'center', borderWidth: 1, borderColor: '#206C00',  fontSize: 16, width: 50 }]}
                     placeholder="2"
                     placeholderTextColor="grey"
                     value={years}
                     onChangeText={setYears}
                   />
                   <Text style={{ fontSize: 16, fontWeight: '500', fontFamily: 'Roboto-Light', marginTop: 15, marginLeft: 5 }}>
                      {t('Years of experience')}
                    </Text>
                 </View>
               </View>
             </View>
           </View>
           
            <Text style={{ fontSize: 14, marginTop: 40, fontStyle: 'italic', fontFamily:"Roboto-Light" }}>{t("You will need to edit and update your profile for it to be visible to 'Individuals' and 'Businesses'")}</Text>
           <TouchableOpacity style={{ justifyContent: 'center', marginLeft: 10, width: 150, paddingHorizontal: 10, paddingVertical: 10, marginTop: 10, marginBottom: 50, backgroundColor: 'coral', borderRadius: 5, }} onPress={handleSaveall} >
             <Text style={{ fontSize: 14, color: 'white', textAlign: 'center',fontFamily:"Roboto-Light" }}>{t("Update Profile")}</Text>
           </TouchableOpacity>
           
                    <PreferredRolesEditModal
                      visible={preferredRolesModalVisible}
                      onClose={() => setPreferredRolesModalVisible(false)}
                      onSave={handleSavePreferredRole}
                    />
<AboutEditModal
            visible={aboutModalVisible}
            about={about}
            onClose={() => setAboutModalVisible(false)}
            onSave={handleSaveAbout}
          />
    </View>
    </View>
        </ScrollView>
      </View>
    </View>
    </BlurView>
    </ImageBackground>
  );
}

const styles = {
  pagecontainer: {
    backgroundColor: '#f7fff4',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20, 
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    borderWidth: 2, 
    borderColor: 'rgba(225,225,212,0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
 glassBox: {
  backgroundColor: 'rgba(225,255,212,0.3)',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: 30,
    marginLeft: 240,
    marginRight: 30,
    marginBottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start', 
  },
  text: {
    borderRadius: 20,
    padding: 10,
    margin: 5,
    color: '#206C00',
    textAlign: 'center',
  },
  blurBackground: {
    flex: 1, 
    backgroundColor: 'rgba(125,255,212,0.3)',
  },
  duration: {
    marginTop: 3,
    fontSize: 12,
    color: 'grey',
    fontFamily:"Roboto-Light"

  },
  description: {
    marginTop: 15,
    fontSize: 14,
    fontFamily:"Roboto-Light"

  },
  historyItem: {
    marginBottom: 20,
  },
  historyheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyheaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#206C00',
    fontFamily:"Roboto-Light"
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
  imageabout: {
    width: 20,
    height: 20,
    marginTop: 10,
    resizeMode: 'cover',
    position: 'absolute',
    right: 50
  },
  textInput: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    fontFamily: 'Roboto-Light',
    marginRight: -50,
    borderBottomWidth: 0, // Remove bottom border (outline)
    borderWidth: 0, // Remove border outline
    padding: 0, // Adjust padding if necessary
    color: 'black', // Text color
  },
};