 import React, { useState, useEffect, useRef} from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableHighlight, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import Topbar from '../components/expertstopbar';
import Sidebar from '../components/expertssidebar';
import ScheduledMeetingsTable from '../components/ScheduledMeetingsTable';
import AwaitingFeedbacks from '../components/AwaitingFeedbacks';
import CompletedFeedbacks from '../components/CompletedFeedbacks';
import OpenModal from '../Experts/InterviewProfile'; 
import { useNavigation } from '@react-navigation/native';


function MyComponent() { 
    const navigation = useNavigation();
    const [isInterviewHovered, setIsInterviewHovered] = useState(false);
    const [isGrowthHovered, setIsGrowthHovered] = useState(false);
    const [isAdviceHovered, setIsAdviceHovered] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = {};
  
      if (difference > 0) {
        timeLeft = {
          hrs: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
        };
      }
  
      return timeLeft;
    };
  
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const targetDate = '2024-05-30T00:00:00'; // Change this to your target date and time
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
  
      return () => clearTimeout(timer);
    });
  
    const timerComponents = Object.keys(timeLeft).map((interval) => {
      if (!timeLeft[interval]) {
        return null;
      }
  
      return (
        <Text key={interval}>
          {timeLeft[interval]} {interval}{" "}
        </Text>
      );
    });

    const handleOpenPress = () => {
      setModalVisible(true);
    };
  
    const handleCloseModal = () => {
      setModalVisible(false);
    };

    const goToInterview = () => {
        navigation.navigate('Interview');
    };

    const goToGrowth = () => {
        navigation.navigate('Growth Plan');
    };

    const goToAdvice = () => {
        navigation.navigate('Advice');
    };


    return (
      <ImageBackground
    source={require ('../assets/Background.png') }
  style={{ height: '150%', width: '100%',flex: 1}}
>
        <View style={{ flex: 1 }}>
            <Topbar />
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <Sidebar />
                <ScrollView contentContainerStyle={{ flexGrow: 1, maxHeight: 500 }}>
                    <View style={{ marginLeft: 270 }}>
                        <View style={styles.header}>
                            <TouchableHighlight
                                onPress={goToInterview} 
                                underlayColor={isInterviewHovered ? 'transparent' : 'transparent'}
                                onMouseEnter={() => setIsInterviewHovered(true)}
                                onMouseLeave={() => setIsInterviewHovered(false)}>
                                <View style={styles.item}>
                                <Image
  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/d10a8ee7c8c9726e17c1a541282a434772d42408c95ac5f784d03e9befeb6519?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
  style={styles.image}
/>
                                    <Text style={[styles.headertext, isInterviewHovered && { color: 'coral' }]}>Interviews</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={goToGrowth}
                                underlayColor={isGrowthHovered ? 'transparent' : 'transparent'}
                                onMouseEnter={() => setIsGrowthHovered(true)}
                                onMouseLeave={() => setIsGrowthHovered(false)}>
                                <View style={styles.item}>
                                <Image
  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/dea8538a41a4085f905f7513c46d36613c28b4ada84630149918f4444ac5ecde?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
  style={styles.image}
/>
                                    <Text style={[styles.headertext, isGrowthHovered && { color: 'coral' }]}>Growth Plan</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={goToAdvice}
                                underlayColor={isAdviceHovered ? 'transparent' : 'transparent'}
                                onMouseEnter={() => setIsAdviceHovered(true)}
                                onMouseLeave={() => setIsAdviceHovered(false)}>
                                <View style={styles.item}>
                                <Image
  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/d82dc6c35b436a4ac93edec3cb47de416b168131f8e3deb5c4898437d416d25f?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
  style={styles.image}
/>
                                    <Text style={[styles.headertext, isAdviceHovered && { color: 'coral' }]}>Advice</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <TouchableOpacity onPress={handleOpenPress}>
    <View style={{ justifyContent: "flex-start", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5, borderColor: "#f7fff4", backgroundColor: 'rgba(211,249,216,0.3)', width: 150, alignItems: 'center', marginTop: 20, marginLeft: 50, borderWidth: 1 }}>
                    <Text style={{ fontSize: 13, color: "#f7fff4", alignText: 'center', fontWeight: 'bold' }}>Interview Profile</Text>
                  </View>
     </TouchableOpacity>

     <View style={styles.container}>
      <View style={styles.box}>
         <Text style = {{fontSize: 12, color: 'grey' }}>No of candidates interviewed</Text>
         <View style={{flexDirection: 'row'}}>
         <Image source={require('../assets/icons8-line-chart.gif')} style={styles.boximage}  />
           <Text style = {{fontSize: 24, fontWeight: 'bold', color: 'blue', marginTop: 5 }}>500</Text>
           </View>
           <Text style = {{fontSize: 14, fontWeight: '500', marginTop: 10 }}>You have 2 new booked session(s) today</Text>
           </View>

      <View style={styles.box}>
        <Text style = {{fontSize: 12, color: 'grey' }}>Total Earnings</Text>
        <View style={{flexDirection: 'row'}}>
         <Image source={require('../assets/icons8-money.gif')} style={styles.boximage}  />
           <Text style = {{fontSize: 24, fontWeight: 'bold', marginTop: 5, color: 'lightblue' }}>$1,580</Text>
     </View>
     <Text style = {{fontSize: 14, fontWeight: '500', marginTop: 10 }}>You earned a total of $30 today</Text>
    
      </View>
     
      <View style={styles.box}> 
        <Text style = {{fontSize: 12, color: 'grey' }}>Profile Visits</Text>
        <View style={{flexDirection: 'row'}}>
         <Image source={require('../assets/icons8-people.gif')} style={styles.boximage}  />
           <Text style = {{fontSize: 24, fontWeight: 'bold', marginTop: 5, color: 'darkgrey' }}>20</Text>
      </View>
      <Text style = {{fontSize: 14, fontWeight: '500', marginTop: 10 }}>You have 10 profile visit(s) this week</Text>
      </View>
      <View style={styles.box}>
        <Text style = {{fontSize: 12, color: 'black' }}>Next Session in</Text>
        <View style={{flexDirection: 'row'}}>
           <Text style = {{fontSize: 24, fontWeight: 'bold', marginTop: 5, color: 'darkgreen' }}>{timerComponents}</Text>
           </View>
           <Text style = {{fontSize: 14, fontWeight: '500', marginTop: 10 }}>You have a new session in {timerComponents}!</Text>
      </View>
    </View>
    

                        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
          <View style={styles.modalContent}>
          <OpenModal onClose={() => handleCloseModal()} />
          </View>
      </Modal>
                        <ScheduledMeetingsTable />
                        <AwaitingFeedbacks />
                        <CompletedFeedbacks />
                    </View>
                </ScrollView>
            </View>
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
    header: {
        marginLeft: -60,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(225,225,212,0.3)',
        backgroundColor: '#f7fff4',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: 10, 
    }, 
    headertext: {
      marginLeft: 5,
      fontSize: 14,
      fontWeight: '500',
      marginTop: 5,
      color: '#666'
    },
    image: {
        width: 21,
        height: 21,
        marginTop: 5,
        marginRight: 5,
        marginLeft: 100
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 40, marginRight: 50, marginTop: 50
      },
      box: {
        backgroundColor: '#f7fff4',
        padding: 20,
        borderRadius: 20,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '22%',
        height: 150,
        borderWidth: 2, borderColor: 'rgba(225,225,212,0.3)',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      boximage: {
        width: 30,
        height: 30,
        position: 'absolute',
        left: 150,
        borderRadius: 25
      },
});

export default MyComponent;
