import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image, ImageBackground, Modal, FlatList  } from 'react-native';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Recruiterssidebar';
import { BlurView } from 'expo-blur';
import Topbar from '../components/Recruiterstopbar';
import SuggestionModal from '../components/Suggestion';
import CustomPercentageChart from '../components/PercentageChart';
import OpenModal2 from './GetStartedTeam';
import OpenModal3 from './New Manager';
import OpenModal4 from '../Jobseekers/Pickyourhub';
import { useTranslation } from 'react-i18next';
import {useFonts} from "expo-font"
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomePage = () => {
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);
  const [isHovered4, setIsHovered4] = useState(false);
  const [isHovered5, setIsHovered5] = useState(false);
  const [isHovered6, setIsHovered6] = useState(false);
  const [isHovered7, setIsHovered7] = useState(false);
  const [isHovered8, setIsHovered8] = useState(false);
  const [isHovered9, setIsHovered9] = useState(false);
  const [isHovered10, setIsHovered10] = useState(false);
  const [isHovered11, setIsHovered11] = useState(false);
  const [isHovered12, setIsHovered12] = useState(false);
  const [isHovered13, setIsHovered13] = useState(false);
  const [isHovered14, setIsHovered14] = useState(false);
  const [isHovered15, setIsHovered15] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
   const navigate = useNavigate();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState(''); 

  const goToEmployees = () => {
    navigate('/employees');
  };

  const goToManagers = () => {
    navigate('/managers');
  };

  const goToTeams = () => {
    navigate('/teams');
  };

  const goToPerformance = () => {
    navigate('/performance');
  };

  const goToCoach = () => {
  navigate('/coach');
  };

  const goToSubscription = () => {
  navigate('/subscription');
  };

  const handleOpenPress2 = () => {
    setModalVisible2(true);
  };

  const handleCloseModal2 = () => {
    setModalVisible2(false);
  };

  const handleOpenPress3 = () => {
    setModalVisible3(true);
  };

  const handleCloseModal3 = () => {
    setModalVisible3(false);
  };

  const handleOpenPress4 = () => {
    setModalVisible4(true);
  };

  const handleCloseModal4 = () => {
    setModalVisible4(false);
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
  
  const ProgressBar = ({ percentage }) => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        <Text style={styles.progressText}>{percentage}%</Text>
      </View>
    );
  };
  
 // EmployeePerformance Component
const EmployeePerformance = () => {
    const employees = [
      { id: '1', name: 'Elvis Mordirij', performance: 78 },
      { id: '2', name: 'Bob Annabel', performance: 67 },
      { id: '3', name: 'Platinuni Frigos', performance: 72 },
      { id: '4', name: 'David Wicher', performance: 85 },
      { id: '5', name: 'Hussein Bilal', performance: 79 },
      { id: '6', name: 'Micheal Anotie', performance: 45 },
      { id: '7', name: 'Jessica Oturu', performance: 65 },
    ];
  
    return (
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.employeeContainer}>
            <Text style={styles.employeeName}>{item.name}</Text>
            <ProgressBar percentage={item.performance} />
          </View>
        )}
      />
    );
  };

  const [fontsLoaded]=useFonts({
"Roboto-Light":require("../assets/fonts/Roboto-Light.ttf")
  })
const {t}=useTranslation()

  return (
    <ImageBackground
    source={require ('../assets/backgroundimg2.png') }
  style={{ height: '100%', width: '100%',flex: 1}}
>
  <View style={{ flex: 1}}>
    <Topbar />
    <View style={{ flexDirection: 'row', flex: 1  }}>
      <Sidebar />
      <ScrollView contentContainerStyle={{ flexGrow: 1, maxHeight: 500  }}>
           <View style={styles.container}>
           <View style={{flexDirection: 'row' }}>
           <Image
        source={{
          uri:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/1f2d38e99b0016f2bd167d2cfd38ff0d43c9f94a93c84b4e04a02d32658fb401?apiKey=7b9918e68d9b487793009b3aea5b1a32&",
        }}
        style={{ width: 40, height: 40, marginTop: -5}}
      />
      <Text style={styles.greeting}>{t("Good Day")}, {first_name}</Text>
      </View>
      <View style={styles.mainContent}>
      <View style={styles.messageBox}>
      <BlurView intensity={50} style={styles.blurBackground}>
      <View style={{flexDirection: 'row', marginBottom: 30 }}>
          <Image
       source={require('../assets/performance.png')}
        style={styles.boxicon}
      />
          <Text style={{fontSize: 18, color: '#63EC55', marginTop: 25, marginLeft: 10,  fontWeight: 'bold',fontFamily:"Roboto-Light" }}>{t("Performance")}</Text>
          </View>

          <EmployeePerformance />

          <TouchableOpacity onPress={goToPerformance} 
           style={[
            styles.touchablechat,
            isHovered1 && styles.touchableOpacityHovered
          ]}
          onMouseEnter={() => setIsHovered1(true)}
          onMouseLeave={() => setIsHovered1(false)}
        >
          <Text style={styles.touchableText}>{t("See All")}</Text>
          </TouchableOpacity>
          </BlurView>
          </View>
        <View style={styles.sideColumn}>
        <View style={styles.greenBorderedBox}>
          <BlurView intensity={80} style={styles.blurBackground}>
          <View style={{flexDirection: 'row', }}>
          <View style={{flexDirection: 'column', marginTop: 20, width: 350, marginLeft: 30 }}>
          <Text style={{fontSize: 24, color: '#63EC55', fontWeight: 'bold', marginTop: 12,fontFamily:"Roboto-Light" }}>{t("Orchestrate the growth of everyone in your team")}</Text>
          <TouchableOpacity onPress={handleOpenPress2} 
          style={[
          styles.touchablebegin,
          isHovered13 && styles.touchableOpacityHovered
        ]}
        onMouseEnter={() => setIsHovered13(true)}
        onMouseLeave={() => setIsHovered13(false)}
      >
          <Text style={styles.touchableTextbegin}>{t("Get Started")}</Text>
          </TouchableOpacity>
         
         
         
          
          </View>
          <Image
                  source={require('../assets/Homeland2.jpg')}
                  style={styles.imageback}
                />
                </View>
               
          </BlurView>
          </View>

          <View style={styles.greenBox}>
          <BlurView intensity={80} style={styles.blurBackground}>
          
          <Image
       source={require('../assets/headimage.png')}
        style={styles.headimage}
      />
         
<View style={{flexDirection: 'row' }}>
<View style={styles.greenwhitebox}> 
<Text style={{fontSize: 16, color: '#63EC55', marginTop: 15, marginLeft: 20, fontWeight: 'bold',fontFamily:"Roboto-Light"}}>{t("Activities")}</Text>
<View style={{flexDirection: 'row' }}>
<TouchableOpacity onPress={goToEmployees} 
 style={[
  styles.touchablerate,
  isHovered2 && styles.touchableOpacityHovered
]}
onMouseEnter={() => setIsHovered2(true)}
onMouseLeave={() => setIsHovered2(false)}
>
          <Text style={styles.touchableTextrate}>{t("Employees")}</Text>
          </TouchableOpacity>
<TouchableOpacity onPress={goToManagers} 
style={[
  styles.touchablerate,
  isHovered3 && styles.touchableOpacityHovered
]}
onMouseEnter={() => setIsHovered3(true)}
onMouseLeave={() => setIsHovered3(false)}
>
          <Text style={styles.touchableTextrate}>{t("Managers")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToCoach} 
          style={[
  styles.touchablerate,
  isHovered5 && styles.touchableOpacityHovered
]}
onMouseEnter={() => setIsHovered5(true)}
onMouseLeave={() => setIsHovered5(false)}
>
          <Text style={styles.touchableTextrate}>{t("Coach")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToTeams} 
          style={[
            styles.touchablerate,
            isHovered6 && styles.touchableOpacityHovered
          ]}
          onMouseEnter={() => setIsHovered6(true)}
          onMouseLeave={() => setIsHovered6(false)}
          >
          <Text style={styles.touchableTextrate}>{t("Teams")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToPerformance} 
          style={[
            styles.touchablerate,
            isHovered4 && styles.touchableOpacityHovered
          ]}
          onMouseEnter={() => setIsHovered4(true)}
          onMouseLeave={() => setIsHovered4(false)}
          >
          <Text style={styles.touchableTextrate}>{t("Performance")}</Text>
          </TouchableOpacity>
</View>
</View>
</View>

<View style={{flexDirection: 'row' }}>
<View style={styles.greenwhitebox}>
<View style={{flexDirection: 'row'}}>
<Text style={{fontSize: 16, color: '#63EC55', marginTop: 15, marginLeft: 30, fontWeight: 'bold',fontFamily:"Roboto-Light" }}>{t("Upcoming Growth Plan Session")} </Text>
<Text style={{fontSize: 12, color: 'white', marginTop: 15, marginLeft: 55, fontWeight: '600',fontFamily:"Roboto-Light" }}>9:30 AM to 10:30 AM | Jun 25</Text>
</View>
<View style={{flexDirection: 'row', }}>
<Image
              source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/96214782d7fee94659d7d6b5a7efe737b14e6f05a42e18dc902e7cdc60b0a37b' }}
              style={{ width: 30, height: 30,  marginLeft: 30, marginTop: 15,}}
            />
              <Text style={{fontSize: 14, color: 'white', marginTop: 20, marginLeft: 10, fontWeight: '600',fontFamily:"Roboto-Light" }}>Maryam Bakahali with expert Joop Melcher</Text>
<TouchableOpacity 
style={[
  styles.touchablestart,
  isHovered7 && styles.touchableOpacityHovered
]}
onMouseEnter={() => setIsHovered7(true)}
onMouseLeave={() => setIsHovered7(false)}
>
          <Text style={styles.touchableTextjoinreview}>{t("Join")}</Text>
          </TouchableOpacity>
          </View>
          </View>
          </View>
<View style={{flexDirection: 'row' }}>
<View style={styles.greenwhitebox}>
<View style={{flexDirection: 'row'}}>
<Text style={{fontSize: 16, color: '#63EC55', marginTop: 15, marginLeft: 30, fontWeight: 'bold',fontFamily:"Roboto-Light" }}>{t("Upcoming Advice Session")}</Text>
<Text style={{fontSize: 12, color: 'white', marginTop: 15, marginLeft: 95, fontWeight: '600',fontFamily:"Roboto-Light" }}>9:30 AM to 10:30 AM | Jun 25</Text>
</View>
<View style={{flexDirection: 'row' }}>
<Image
              source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/96214782d7fee94659d7d6b5a7efe737b14e6f05a42e18dc902e7cdc60b0a37b' }}
              style={{ width: 30, height: 30,  marginLeft: 30, marginTop: 15,}}
            />
              <Text style={{fontSize: 14, color: 'white', marginTop: 20, marginLeft: 10, fontWeight: '600',fontFamily:"Roboto-Light" }}>Eniobanke Ademide with expert Emily Ray</Text>
<TouchableOpacity 
style={[
  styles.touchablestart,
  isHovered8 && styles.touchableOpacityHovered
]}
onMouseEnter={() => setIsHovered8(true)}
onMouseLeave={() => setIsHovered8(false)}
>
          <Text style={styles.touchableTextjoinreview}>{t("Join")}</Text>
          </TouchableOpacity>
          </View>
          </View>
          </View>
 <View style={{flexDirection: 'row' }}>
          <View style={styles.greenwhitebox}>
<View style={{flexDirection: 'row'}}>
<Text style={{fontSize: 16, color: '#63EC55', marginTop: 15, marginLeft: 30, fontWeight: 'bold',fontFamily:"Roboto-Light" }}>{t("Upcoming Interview Session")} </Text>
<Text style={{fontSize: 12, color: 'white', marginTop: 15, marginLeft: 75, fontWeight: '600',fontFamily:"Roboto-Light" }}>9:30 AM to 10:30 AM | Jun 25</Text>
</View>
<View style={{flexDirection: 'row', marginBottom: 10 }}>
<Image source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/96214782d7fee94659d7d6b5a7efe737b14e6f05a42e18dc902e7cdc60b0a37b' }}
              style={{ width: 30, height: 30,  marginLeft: 30, marginTop: 15,}}
            />
              <Text style={{fontSize: 14, color: 'white', marginTop: 20, marginLeft: 10, fontWeight: '600',fontFamily:"Roboto-Light" }}>Patrick King with expert Wicher Jeroen</Text>
<TouchableOpacity 
style={[
  styles.touchablestart,
  isHovered9 && styles.touchableOpacityHovered
]}
onMouseEnter={() => setIsHovered9(true)}
onMouseLeave={() => setIsHovered9(false)}
>
          <Text style={styles.touchableTextjoinreview}>{t("Join")}</Text>
          </TouchableOpacity>
          </View>
          </View>
          
          </View>
          </BlurView>
 </View>

        </View>

        <View style={styles.whiteBoxesContainer}>
          {/* White boxes will go here */}
          <View style={styles.whiteBox}>
          <View style={{flexDirection: 'row' }}>
          <Image
       source={require('../assets/question.png')}
        style={styles.boxicon}
      />
          <Text style={{fontSize: 18, color: '#63EC55', marginTop: 25, marginLeft: 10,  fontWeight: 'bold',fontFamily:"Roboto-Light" }}>{t("Have a question?")}</Text>
          </View>
          <Text style={{fontSize: 14, color: 'white', marginTop: 10, marginLeft: 35,marginRight: 20, marginBottom: 20,fontFamily:"Roboto-Light" }}>{t("Do you have an idea you will like to share with us?")}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}
          style={[
            styles.touchablecoach,
            isHovered10 && styles.touchableOpacityHovered
          ]}
          onMouseEnter={() => setIsHovered10(true)}
          onMouseLeave={() => setIsHovered10(false)}
          >
          <Text style={styles.touchableTextcoach}>{t("Let's hear from you")}</Text>
          </TouchableOpacity>
          </View>

          <View style={styles.whiteBox}>
          <View style={{flexDirection: 'row' }}>
          <Image
       source={require('../assets/QandA.png')}
        style={styles.boxicon}
      />
          <Text style={{fontSize: 18, color: '#63EC55', marginTop: 25, marginLeft: 10,  fontWeight: 'bold',fontFamily:"Roboto-Light" }}>{t("Need Help?")}</Text>
          </View>
          <Text style={{fontSize: 14, color: 'white', marginTop: 10, marginLeft: 35,marginRight: 20, marginBottom: 20,fontFamily:"Roboto-Light"  }}>{t("Do you have an issue you would like us to assist you with?")}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}
          style={[
            styles.touchablecoach,
            isHovered12 && styles.touchableOpacityHovered
          ]}
          onMouseEnter={() => setIsHovered12(true)}
          onMouseLeave={() => setIsHovered12(false)}
          >
          <Text style={styles.touchableTextcoach}>{t("Get Help")}</Text>
          </TouchableOpacity>
          </View>

          <View style={styles.whiteBox}>
          <View style={{flexDirection: 'row' }}>
          <Image
        source={require('../assets/money (2).png')}
        style={styles.boxicon}
      />
           <Text style={{fontSize: 18, color: '#63EC55', marginTop: 25, marginLeft: 10,  fontWeight: 'bold',fontFamily:"Roboto-Light" }}>{t("Due Payment")}</Text>
           </View>
           <Text style={{fontSize: 14, color: 'white', marginTop: 10, marginLeft: 25,marginRight: 20, marginBottom: 25,fontFamily:"Roboto-Light"  }}>{t("Wicher Jeroen payment is due 12th of June 2024")}</Text>
          <TouchableOpacity onPress={goToSubscription}
          style={[
            styles.touchablecoach,
            isHovered11 && styles.touchableOpacityHovered
          ]}
          onMouseEnter={() => setIsHovered11(true)}
          onMouseLeave={() => setIsHovered11(false)}
          >
          <Text style={styles.touchableTextcoach}>{t("Renew now")}</Text>
          </TouchableOpacity>
          
          </View>


          <View style={styles.whiteBox}>
          <Text style={{fontSize: 18, color: '#63EC55', marginTop: 25, marginLeft: 20,  fontWeight: 'bold',fontFamily:"Roboto-Light" }}>{t("Your Angle Badge")}</Text>
          <View style={{flexDirection: 'row' }}>
          <Text style={{fontSize: 16, color: 'white', marginTop: 10, marginLeft: 20,marginRight: 20, marginBottom: 20,fontFamily:"Roboto-Light"  }}>{t("This is the combined progress of your team")}</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20, marginTop: -30 }}>
      <CustomPercentageChart percentage={70} />
      </View>
    </View>
          </View>
        </View>
      </View>
    </View>
          
        </ScrollView>
      </View>
      
    
    <SuggestionModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={handleCloseModal2}
      >
        <View style={styles.modalContent}>
          <OpenModal2 onClose={() => handleCloseModal2()} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible3}
        onRequestClose={handleCloseModal3}
      >
        <View style={styles.modalContent}>
          <OpenModal3 onClose={() => handleCloseModal3()} />
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 210,
    marginTop: 100
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
    marginLeft: 3,
    fontFamily:"Roboto-Light"
  },
  icon: {
    width: 15,
    height: 15,
    marginLeft: 30,
    marginTop: 10
  },
  sunicon: {
    width: 28,
    height: 28,
    marginRight: 10,
    marginTop: 20,
    marginLeft: -300
  },
  boxicon: {
    width: 25,
    height: 25,
    marginLeft: 20,
    marginTop: 25,
  },
  staricon: {
    width: 20,
    height: 20,
    marginLeft: 50,
    marginTop: 15
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sideColumn: {
    marginRight: 15,
  },
  greenBorderedBox: {
    width: 580,
    height: 200,
    backgroundColor: 'rgba(125,125,125,0.3)',
      borderRadius: 20,
    marginBottom: 20, 
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1
},
messageBox: {
  width: 220,
  height: 700,
  backgroundColor: 'rgba(125,125,125,0.3)',
    borderRadius: 20,
  marginRight: 15, 
  borderColor: 'rgba(255,255,255,0.5)',
  borderWidth: 1
},
greenBox: {
  width: 580,
  height: 600,
  backgroundColor: 'rgba(225,255,212,0.1)',
  borderRadius: 20,
  marginBottom: 20,
  borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1
},
blurBackground: {
  flex: 1, 
  borderRadius: 20, 
},
  whiteBoxesContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  greenwhitebox: {
    width: 510,
    height: 100,
    backgroundColor: 'rgba(10,0,0,0.3)',
    marginLeft: 35, 
    marginTop: 10, 
    borderRadius: 20, 
    },
    headimage: {
        width: 510,
        height: 100,
        marginLeft: 35, 
        marginTop: 10, 
        borderRadius: 20, 
        },
    whiteBox: {
      width: 280,
      height: 200,
      backgroundColor: 'rgba(125,125,125,0.3)',
      borderRadius: 20,
      marginBottom: 15,
      borderColor: 'rgba(255,255,255,0.5)',
      borderWidth: 1
    },
  touchable: {
    padding: 8,
    paddingHorizontal: 20,
    marginTop: 12,
    marginLeft: 80,
    backgroundColor: 'rgba(200,200,125,0.3)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  touchablechat: {
    padding: 8,
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 50,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: 'rgba(200,200,125,0.3)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  touchableText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontFamily:"Roboto-Light"
  },
  touchableTextbegin: {
    color: 'darkgreen',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily:"Roboto-Light"
  },
  touchablecoach: {
    backgroundColor: 'rgba(200,200,125,0.3)',
    padding: 8,
    paddingHorizontal: 5, 
    marginTop: 25,
    marginLeft: 30,
    marginRight: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  touchableTextcoach: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontFamily:"Roboto-Light"
  },
   touchableall: {
    backgroundColor: 'rgba(200,200,125,0.3)',
    padding: 8,
    paddingHorizontal: 20, 
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  touchableTextall: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontFamily:"Roboto-Light"
  },
   touchablehub: {
    backgroundColor: 'rgba(200,200,125,0.3)',
    padding: 8,
    paddingHorizontal: 20, 
    marginTop: 15,
    marginRight: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  touchableTexthub: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontFamily:"Roboto-Light"
  },
  touchablejoinsession: {
    backgroundColor: 'rgba(200,200,125,0.3)',
    padding: 8,
    paddingHorizontal: 20, 
    marginTop: 10,
    marginRight: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  touchableTextjoinsession: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontFamily:"Roboto-Light"
  },
  touchablerate: {
    backgroundColor: 'rgba(200,200,125,0.3)',
    padding: 8,
    paddingHorizontal: 10, 
    marginTop: 15,
    marginLeft: 10,
    width: 90,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  touchableTextrate: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontFamily:"Roboto-Light"
  },
  touchablesession: {
    backgroundColor: 'rgba(200,200,125,0.3)',
    padding: 8,
    paddingHorizontal: 20, 
    marginTop: 10,
    marginRight: 10,
    marginLeft: 180,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  touchableTextsession: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontFamily:"Roboto-Light"
  },
    touchablestart: {
      backgroundColor: 'rgba(200,200,125,0.3)',
      padding: 8,
      paddingHorizontal: 20, 
      marginTop: 15,
      position: 'absolute',
      right: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
     touchablejoinreview: {
    backgroundColor: 'white',
    paddingVertical: 3,
    paddingHorizontal: 15, 
    marginTop: 5,
    marginLeft: 200,
    borderColor: '#CCC',
    borderWidth: 1
  },
  touchableTextjoinreview: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontFamily:"Roboto-Light"
  },
    verticalLine: {
    height: 60,
    width: 2,
    backgroundColor: '#CCC',
    marginLeft: 30,
    marginTop: 15
  },
  image: {
    width: 35,
    height: 35,
    marginRight: 10,
    marginLeft: 15,
    borderRadius: 25
  },
  progressBarContainer: {
    width: '90%',
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
    marginLeft: 10
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#63EC55',
  },
  progressText: {
    position: 'absolute',
    right: 10,
    color: '#000',
  },
  employeeContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  employeeName: {
    marginBottom: 5,
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginLeft: 10
  },
  touchableOpacityHovered: {
    backgroundColor: 'coral'
  },
  imageback: {
    width: 180,
    height: 180,
    marginRight: 30,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 20
  },
  touchablebegin: {
    padding: 10,
    paddingHorizontal: 5,
    marginTop: 40,
    marginBottom: 10,
    width: 150,
    backgroundColor: '#63EC55',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default HomePage;
