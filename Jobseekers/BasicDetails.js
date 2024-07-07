import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { useFonts } from 'expo-font';
import { useTranslation } from 'react-i18next';


function MyComponent() {
  const navigation = useNavigation(); // Accessing navigation object using useNavigation hook

  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');

  const handleChooseImage = (event) => {
    const selectedImage = event.target.files[0];
    const imageUrl = URL.createObjectURL(selectedImage);
    setProfileImage(imageUrl);
  };

  const handleSaveContinue = () => {
    // Here you can use the collected data as needed
    console.log('Collected Data:');
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('State:', state);
    console.log('Country:', country);
    console.log('Date of Birth:', dob);
    console.log('Gender:', gender);
    console.log('Profile Picture:', profileImage);

    // Navigate to the next screen
    navigation.navigate('Home'); // Navigating to the "EduAndWork" page
  };

  const [fontsLoaded]=useFonts({
    "Roboto-Light":require("../assets/fonts/Roboto-Light.ttf"),
      })
const {t}=useTranslation()

  return (
    <View style={{ flex: 1}}>
    <Topbar />
    <View style={{ flexDirection: 'row', flex: 1  }}>
      <Sidebar />
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
          <View style={{ marginLeft: 10 }}>
            <View style={{ marginTop: 20 }}>
              <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10, alignItems: 'center', justifyContent: 'center', }}>
               
                
               
              </View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'coral',fontFamily:"Roboto-Light" }}>{t("Basic Details")}</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 14 }}>
              <View style={{ flex: 1, marginRight: 40 }}>
                <Text style={{ color: 'black', fontWeight: '600',fontFamily:"Roboto-Light" }}>{t("First Name")}</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: 'grey',
                    padding: 10,
                    maxWidth: '100%',
                    marginTop: 5,
                    placeholderTextColor: 'black',
                    fontFamily:"Roboto-Light"
                  }}
                  placeholder='Enter your First Name'
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text style={{ fontWeight: '600', color: 'black',fontFamily:"Roboto-Light" }}>{t("Last Name")}</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: 'grey',
                    borderRadius: 5,
                    padding: 10,
                    maxWidth: '100%',
                    marginTop: 5,
                    placeholderTextColor: 'black',
                    fontFamily:"Roboto-Light"
                  }}
                  placeholder='Enter your Last Name'
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 7 }}>
              <View style={{ flex: 1, marginRight: 40 }}>
                <Text style={{ fontWeight: '600', marginTop: 15, color: 'black',fontFamily:"Roboto-Light" }}>{t("State or Province")}</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: 'grey',
                    borderRadius: 5,
                    padding: 10,
                    maxWidth: '100%',
                    marginTop: 5,
                    placeholderTextColor: 'grey',
                    fontFamily:"Roboto-Light"
                  }}
                  placeholder="Enter your State or Province"
                  value={state}
                  onChangeText={setState}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text style={{ fontWeight: '600', marginTop: 15, color: 'black',fontFamily:"Roboto-Light" }}>{t("Country")}</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: 'grey',
                    borderRadius: 5,
                    padding: 10,
                    maxWidth: '100%',
                    marginTop: 5,
                    placeholderTextColor: 'grey',
                    fontFamily:"Roboto-Light"
                  }}
                  placeholder="Enter your Country"
                  value={country}
                  onChangeText={setCountry}
                />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={{ fontWeight: '600', marginTop: 25, color: 'black',fontFamily:"Roboto-Light" }}>{t("Birthday")}</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: 'grey',
                  borderRadius: 5,
                  padding: 10,
                  maxWidth: '100%',
                  marginTop: 5,
                  placeholderTextColor: 'grey',
                  fontFamily:"Roboto-Light"
                }}
                placeholder="Enter your Date of Birth (DD/MM/YYYY)"
                value={dob}
                onChangeText={setDob}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={{ marginTop: 25, color: 'black', fontWeight: '600',fontFamily:"Roboto-Light" }}>{t("Gender")}</Text>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ height: 40, width: '100%', borderColor: 'grey', borderRadius: 5,fontFamily:"Roboto-Light" }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {/* Upload Profile Picture */}
              <Text style={{ fontWeight: '600', marginTop: 25, color: 'black',fontFamily:"Roboto-Light" }}>{t("Upload Profile Picture")}</Text>
              <input
                type="file"
                accept="image/*"
                onChange={handleChooseImage}
                style={{ marginTop: 5,fontFamily:"Roboto-Light" }}
              />
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={{ width: 50, height: 50 }} />
              ) : (
                <Text style={{ fontWeight: '100', marginTop: 5, color: 'black', marginBottom: 20, fontSize: 11, marginLeft: 5,fontFamily:"Roboto-Light" }}>{t("Your profile image is necessary for Authentication purpose")}</Text>
              )}
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 3, justifyContent: 'space-between', paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#d3f9d8',
              borderRadius: 5,
              paddingVertical: 10,
              paddingHorizontal: 20,
              
            }}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#206C00',fontFamily:"Roboto-Light" }}>{t("Skip for now")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'coral',
              borderRadius: 5,
              paddingVertical: 10,
              paddingHorizontal: 20,
      
              marginLeft: 80, // Adding margin between buttons
            }}
            onPress={handleSaveContinue}
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white',fontFamily:"Roboto-Light" }}>{t("Save & Continue")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </View>
  );
}

export default MyComponent;