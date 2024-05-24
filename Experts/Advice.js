import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableHighlight, TouchableOpacity,  Modal,  Animated, ImageBackground,} from 'react-native';
import { FaStar } from 'react-icons/fa';
import Topbar from '../components/expertstopbar';
import Sidebar from '../components/expertssidebar';
import ScheduledAdvice from '../components/ScheduledAdvice';
import CompletedAdvice from '../components/CompletedAdvice';
import { useNavigation } from '@react-navigation/native';
import OpenModal from '../Experts/AdviceProfile';

const data = [
  { date: 'M', score: 10 },
{ date: 'T', score: 15 },
{ date: 'W', score: 8 },
{ date: 'T', score: 18 },
{ date: 'F', score: 4 },
{ date: 'S', score: 6 },
{ date: 'S', score: 1 }
];

const colors = ['#FF4040', '#CD5B45', '#FF7F50', '#F08080', '#F88379', '#FFE4E1', '#FFE4E1',];

function MyComponent() {
    const navigation = useNavigation();
    const [isInterviewHovered, setIsInterviewHovered] = useState(false);
    const [isGrowthHovered, setIsGrowthHovered] = useState(false);
    const [isAdviceHovered, setIsAdviceHovered] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const barHeights = useRef(data.map(() => new Animated.Value(0))).current;
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = {};
  
      if (difference > 0) {
        timeLeft = {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
  
      return timeLeft;
    };
  
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const targetDate = '2024-05-25T00:00:00'; // Change this to your target date and time
  
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

  useEffect(() => {
    const animations = data.map((item, index) => Animated.timing(barHeights[index], {
      toValue: item.score * 7,
      duration: 1000,
      useNativeDriver: false,
    }));

    Animated.stagger(100, animations).start();
  }, []);

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
        <View style={{ marginLeft: 270, }}>
          <View style={styles.header}>
            <TouchableHighlight
                                onPress={goToInterview} 
                                underlayColor={isInterviewHovered ? 'transparent' : 'transparent'}
                                onMouseEnter={() => setIsInterviewHovered(true)}
                                onMouseLeave={() => setIsInterviewHovered(false)}>
                                <View style={styles.item}>
                                <Image
  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ed6b330337dad3f4c29dae397b1a587ec9cdb40064dc06f64111e037496f2e8f?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
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
  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e5fc48985e9bd23839ab4e933835f0a18c6a7586a0ec50e99bc97886e30e1e63?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
  style={styles.image}
/>
                                    <Text style={[styles.headertext, isAdviceHovered && { color: 'coral' }]}>Advice</Text>
                                </View>
                            </TouchableHighlight>
          </View>
          <TouchableOpacity onPress={handleOpenPress}>
    <View style={{ justifyContent: "flex-start", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5, borderColor: "#f7fff4", backgroundColor: 'rgba(211,249,216,0.3)', width: 150, alignItems: 'center', marginTop: 20, marginLeft: 50, borderWidth: 1 }}>
                    <Text style={{ fontSize: 13, color: "#f7fff4", alignText: 'center', fontWeight: 'bold' }}>Advice Profile</Text>
                  </View>
     </TouchableOpacity>

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

      <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.barGraphContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <Animated.View style={[styles.graphBar, { height: barHeights[index], backgroundColor: colors[index] }]} />
              <View style={styles.scoreDateContainer}>
                <Text style={styles.graphScore}>{item.score}</Text>
                <Text style={styles.graphDate}>{item.date}</Text>
              </View>
            </View>
          ))}
          
        </View>
        
      </View>
       <View style={styles.box}>
        <View style={{alignItems: 'center', alignContent: 'center'}}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', }}>Rating</Text>
       <Text style={{ fontSize: 12, marginTop: 5, marginBottom: 15 }}>40 candidates reviews</Text>
    <View style={{ paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(225,225,212,0.3)', width: 200, alignItems: 'center', marginTop: 10 }}>
    <View style={{ flexDirection: 'row'}}>
                    <Text style={{ fontSize: 18, color: "black", alignText: 'center', fontWeight: '600' }}><FaStar color="gold" /><FaStar color="gold" /><FaStar color="gold" /><FaStar color="gold" /><FaStar color="gold" /></Text> <Text style={{ fontSize: 12, marginTop: 3, marginLeft: 5, color: "black"}}> 4.7 out of 5 </Text>
                    </View>
                  </View>
      <TouchableOpacity>
     <Text style={{ fontSize: 12, color: 'darkgrey', marginTop: 30 }}>How do we calculate ratings?</Text>
     </TouchableOpacity>
    </View>
      </View>
      <View style={styles.box2}>
        <Text style = {{fontSize: 10, color: 'grey', marginTop: 20, fontWeight: '600'}}>Next Session is in</Text>
         <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'coral', marginTop: 10 }}>{timerComponents}</Text>
        <Text style = {{fontSize: 12, marginTop: 20, color: 'grey'  }}>By recording upcoming sessions in your calendar, you hold yourself accountable for candidate's progress. Seeing these sessions scheduled prompts you to prepare accordingly and actively participate. </Text>
     </View>
     </View>

<ScheduledAdvice /> 
<CompletedAdvice />
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
    backgroundColor: '#f7fff4',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }, 
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headertext: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
    color: '#666'
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 5,
    marginLeft: 100
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10, marginTop: 50, marginLeft: 20, marginRight: 50
  },
  box2: {
    backgroundColor: '#f7fff4',
    padding: 20,
    borderRadius: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '44%',
    height: 200,
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
  box: {
    backgroundColor: '#f7fff4',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
    height: 200,
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
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  barGraphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: 200,
    height: 80,
    marginTop: 60,
    marginRight: 20,
    marginBottom: -10,
    paddingHorizontal: 10,
    backgroundColor: '#f7fff4',
    borderRadius: 5,
    paddingTop: 20,
    paddingBottom: 10,
  },
  barContainer: {
    alignItems: 'center',
  },
  scoreDateContainer: {
    position: 'absolute',
    bottom: -30,
    left: '50%',
    transform: [{ translateX: -5 }],
    alignItems: 'center',
     marginBottom: 10,
  },
  graphBar: {
    width: 20,
    borderRadius: 2,
    marginBottom: 10,
  },
  graphScore: {
    fontSize: 10,
    color: 'lightgrey',
    fontWeight: '600',
     marginTop: 10,
  },
  graphDate: {
    fontSize: 12,
    color: 'grey',
    fontWeight: 'bold',
    marginTop: 2,
   marginBottom: -10
  },
  boximage: {
        width: 50,
        height: 50,
        position: 'absolute',
        left: '100%',
        marginLeft: 350,
        borderRadius: 25, 
      },
});

export default MyComponent;
