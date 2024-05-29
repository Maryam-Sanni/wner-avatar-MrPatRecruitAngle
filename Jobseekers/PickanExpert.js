import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Animated, TouchableOpacity, StyleSheet, Modal, Picker, TextInput } from 'react-native';
import OpenSchedule2 from '../components/JProfile';
import { useNavigation } from '@react-navigation/native';

function MyComponent({ onClose }) {
    const navigation = useNavigation();
  const [scaleAnimations] = useState([...Array(12)].map(() => new Animated.Value(1)));
  const [modalVisible2, setModalVisible2] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [isDropdown, setIsDropdown] = useState(false);
  const [mainModalVisible, setMainModalVisible] = useState(true);
  const [formModalVisible, setformModalVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false); // State for tracking whether the TouchableOpacity is pressed

  const handleOpenPress = () => {
    setMainModalVisible(false);
    setformModalVisible(true);
  };

  const handleCloseformModal = () => {
    setformModalVisible(false);
    onClose();
  };

  const toggleMode = () => {
    setIsDropdown(!isDropdown);
    setSelectedValue('');
    setSearch('');
  };

  const handleOpenPress2 = () => {
    setModalVisible2(true);
  };

  const handleCloseModal2 = () => {
    setModalVisible2(false);
  };

  const goToPlans = () => {
    // Navigate to ExpertsProfile screen when the button is clicked
    navigation.navigate('Your Offer');
    onClose(); // Close the modal
  };

  // Sample data for the cards
  const cardData = [
    {
      description: "Here is a description of what your coach does, kindly read the description carefully.",
      expert: "Emily Ray",
      job: "SAP FI",
      country: "Switzerland",
      interviewfee: "$50",
    },
    {
      description: "Here is a description of what your coach does, kindly read the description carefully.",
      expert: "Monica Jerry",
      job: "SAP FI",
      country: "Canada",
      interviewfee: "$30",
    },
    {
      description: "Here is a description of what your coach does, kindly read the description carefully.",
      expert: "Fisayo Fosudo",
      job: "SAP FI",
      country: "Nigeria",
      interviewfee: "$25",
    },
    {
      description: "Here is a description of what your coach does, kindly read the description carefully.",
      expert: "Will Cooper",
      job: "SAP FI",
      country: "United Kingdom",
      interviewfee: "$70",
    },
  ];

  const handleCardAnimation = (index, toValue) => {
    Animated.timing(
      scaleAnimations[index],
      {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  };

  const handleTogglePress = () => {
    setIsPressed(!isPressed); // Toggle the pressed state
  };

  const renderInput = () => {
    if (isDropdown) {
      return (
        <Picker
          selectedValue={selectedValue}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedValue(itemValue)
          }
        >
          <Picker.Item label="Pick an expert" value="Pick an expert" />
          <Picker.Item label="Monica Jerry" value="Monica Jerry" />
          <Picker.Item label="Will Cooper" value="Will Cooper" />
          <Picker.Item label="John Othega" value="John Othega" />
          <Picker.Item label="Joop Melcher" value="Joop Melcher" />
        </Picker>
      );
    } else {
      return (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search for experts..."
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={toggleMode} style={styles.iconContainer}>
            <Image source={require('../assets/arrow-down.png')} style={{ width: 15, height: 15, }} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderCards = () => {
    return cardData.map((data, index) => (
      <Animated.View
        key={index}
        style={{
          width: '25%',
          paddingHorizontal: 5,
          marginBottom: 20,
          transform: [{ scale: scaleAnimations[index] }],
        }}
        onMouseEnter={() => handleCardAnimation(index, 1.05)}
        onMouseLeave={() => handleCardAnimation(index, 1)}
      >
        {/* Card content */}
        <View
          style={{
            width: '100%',
            height: 300,
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            backgroundColor: "#d3f9d8",
          }}
        >
          <TouchableOpacity onPress={handleOpenPress2} onPressIn={handleTogglePress} onPressOut={handleTogglePress}>
            <View style={{ justifyContent: "center", width: '90%', height: 100, borderRadius: 5, backgroundColor: isPressed ? "darkgreen" : "#F0FFF9", marginRight: 15, marginLeft: 10, marginTop: 20, alignItems: 'center', borderWidth: 1, borderColor: '#206C00' }}>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Image
                  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/96214782d7fee94659d7d6b5a7efe737b14e6f05a42e18dc902e7cdc60b0a37b' }}
                  style={{ width: 50, height: 50, aspectRatio: 1, marginTop: 10, }}
                />
                <Text style={{ fontSize: 14, color: "black", fontWeight: 'bold', }}>
                  {data.expert}
                </Text>
                <Text style={{ fontSize: 12, color: "#206C00", marginBottom: 10 }}>
                  {data.job}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 18, }}>
            <View style={{ flex: 1, }}>
              <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center', justifyContent: "center" }}>
                <Image
                  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6bba7edcb3f010b92084265108234b625f6a1e57053bb656b44878ce3a0ec09a?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
                  style={{ width: 10, height: 10, aspectRatio: 1, marginTop: 5, }}
                />
                <Text style={{ fontSize: 10, color: '#206C00', marginLeft: 4, marginTop: 2, }}>{data.country}</Text>
              </View>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: "#888", marginTop: 10, marginLeft: 10, }}>{data.description}</Text>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            
            <TouchableOpacity
              style={{ height: 18, width: 18, borderRadius: 15, borderWidth: 1, borderColor: "#4A5568", position: 'absolute', right: 20, marginTop: 10, backgroundColor: 'none' }}
              onPressIn={handleTogglePress}  // Triggered when pressing down
              onPressOut={handleTogglePress} // Triggered when releasing
            />
          </View>
        </View>
      </Animated.View>
    ));
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={mainModalVisible}
        onRequestClose={onClose}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", marginTop: 40, alignItems: 'center' }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, maxHeight: 500 }}>
            <View style={styles.greenBox}>
              <View style={styles.header}>
                <Image
                  source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1f2d38e99b0016f2bd167d2cfd38ff0d43c9f94a93c84b4e04a02d32658fb401?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }} // replace with your logo URL
                  style={styles.logo}
                />
                <Text style={styles.headerText}>Pick an Expert</Text>

                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={{ fontSize: 18, color: '#3F5637', fontWeight: 'bold' }}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'flex-start', marginLeft: 40, }}>
                <Text style={{ fontSize: 16, color: "black", alignText: 'flex-start', fontWeight: 'bold', marginTop: 5 }}>Choose your preffered Expert</Text>
                <Text style={{ fontSize: 14, color: "black", alignText: 'flex-start', marginBottom: 10 }}>Use the search or the dropdown to filter</Text>
                <View style={styles.dropcontainer}>
                  {renderInput()}
                </View>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 30, marginLeft: 30, marginRight: 30 }}>
                {renderCards()}
              </View>
              <TouchableOpacity onPress={goToPlans} style={styles.buttonplus} >
                <Text style={styles.buttonTextplus}>Next</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={handleCloseModal2}
      >
        <View style={styles.modalContent}>
          <OpenSchedule2 onClose={() => handleCloseModal2()} />
        </View>
      </Modal>
    </>
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
  greenBox: {
    width: 1000,
    height: 800,
    backgroundColor: '#F8F8F8',
  },
  buttonplus: {
    backgroundColor: 'coral',
    borderRadius: 5,
    padding: 5,
    position: 'absolute',
    right: 40,
    width: 100,
    paddingHorizontal: 20,
    bottom: 170,
    marginBottom: 30,
    borderRadius: 5,
  },
  buttonTextplus: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
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
    marginBottom: 20
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F5637'
  },
  dropcontainer: {
    justifyContent: 'center',
    width: 400,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 500,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: 'white'
  },
  picker: {
    width: 470,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  iconContainer: {
    padding: 8,
  },
});

export default MyComponent;

