import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { View, Image, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import CollapsedComponent from "./expertscollapsed"; // Import your collapsed component
import {useFonts} from "expo-font"
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenModal from "../Experts/Updateprofiles";

function MyComponent() {
  const [clickedItem, setClickedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null); 
  const [showMenu, setShowMenu] = useState(true);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState(''); 
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  
  const navigate = useNavigate(); // Get navigation object
   const location = useLocation();

  const handleItemHover = (item) => {
    setHoveredItem(item);
  };

  const handleItemClick = (item) => {
    setClickedItem(clickedItem === item ? null : item);

    // Navigate to respective screens based on the menu item clicked
    switch (item.label) {
      case "Home":
        navigate('/home-experts');
        break;
      case "Preferences":
        navigate('/preferences');
        break;
      case "Interview":
        navigate('/interview');
        break;
      case "Growth Plan":
        navigate('/growth-plan');
        break;
      case "Skills Analysis":
        navigate('/skill-analysis');
        break;
      case "Hubs":
        navigate('/hubs');
        break;
      case "Scenario Project":
        navigate('/scenario-project');
        break;
        case "Support Tickets":
          navigate('/all-tickets');
         break;
      case "Chats":
        navigate('/chats');
        break;
      default:
        break;
    }
  };


  const handleLogout = () => {
    navigate('/sign-in');
  };

  const handleProfileClick = () => {
    // Navigate to MyProfile screen
   navigate('/expert-profile');
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

  const [fontsLoaded]=useFonts({
    'Roboto-Light':require("../assets/fonts/Roboto-Light.ttf"),
  })
  const { t } = useTranslation()

  useEffect(() => {
    const currentPath = location.pathname; // Get the full path
    const matchedItem = menuItems.find(item => {
      switch(item.label) {
        case "Home": return currentPath === '/home-experts';
         case "Preferences": return currentPath === '/home-experts';
           case "Interview": return currentPath === '/interview';
           case "Growth Plan": return currentPath === '/growth-plan';
           case "Skills Analysis": return currentPath === '/skill-analysis';
           case "Scenario Project": return currentPath === '/scenario-project';
           case "Hubs": return currentPath === '/hubs';
          case "Preferences": return currentPath === '/preferences';
        case "Chats": return currentPath === '/chats';
          case "Support Tickets": return currentPath === '/all-tickets';
        default: return false;
      }
    });

    if (matchedItem) {
      setClickedItem(matchedItem);
    }
  }, [location, menuItems]);

  return (
    <View style={[styles.container, !showMenu && { width: 80 }]}>
      {showMenu ?  (
        <View style={styles.contentContainer}>
          {/* Menu Items */}
          <View style={{marginTop: 50}}>
          {menuItems.map((menuItem, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                hoveredItem === menuItem && styles.menuItemHovered,
                clickedItem === menuItem && styles.menuItemSelected
              ]}
              onMouseEnter={() => handleItemHover(menuItem)}
              onMouseLeave={() => handleItemHover(null)}
              onPress={() => handleItemClick(menuItem)}
            >
              <View style={styles.menuItemContent}>
                <Image
                  source={{ uri: menuItem.icon }}
                  style={{ width: 20, height: 20, marginRight: 6 }}
                />
                <Text style={[styles.text, clickedItem === menuItem && styles.textActive]}>{t(menuItem.label)}</Text>
              </View>
            </TouchableOpacity>
          ))}
          </View>
          {/* Profile Info */}
          <TouchableOpacity onPress={handleOpenPress}>
          <View style={styles.divider} />
          <View style={styles.profileInfo}>
            <Image
              source={require("../assets/account.png")}
              style={{ width: 40, height: 40, aspectRatio: 1 }}
            />
            <View style={{ marginLeft: 5 }}>
              <Text style={{ fontSize: 14, color: '#666',fontFamily:"Roboto-Light"  }}>{first_name} {last_name}</Text>
            </View>
          </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          {/* Logout */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <View style={styles.logoutButton}>
              <Image
                source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/8619284eda5dda6f5d7db1f24b673d86816adddc50319ac5f1954048b0054972?apiKey=7b9918e68d9b487793009b3aea5b1a32&" }}
                style={{ width: 20, height: 20, marginRight: 6, marginTop: 5, marginBottom: 5}}
              />
              <Text style={{ marginTop: 5, marginBottom: 5, color: clickedItem === "Logout" ? 'coral' : '#666',fontFamily:"Roboto-Light"  }}>{t("Logout")}</Text>
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
        </View>
      ) : (
        <CollapsedComponent /> 
      
      )}
    </View>
  );
}

const menuItems = [
  { label: "Home", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/c2a8bbea82c77b8fb3265f2792b73ef422d464a228510b5a1a07d2d657c4441f?apiKey=7b9918e68d9b487793009b3aea5b1a32&" },
  { label: "Skills Analysis", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d82dc6c35b436a4ac93edec3cb47de416b168131f8e3deb5c4898437d416d25f?apiKey=7b9918e68d9b487793009b3aea5b1a32&" },
  { label: "Growth Plan", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/dea8538a41a4085f905f7513c46d36613c28b4ada84630149918f4444ac5ecde?apiKey=7b9918e68d9b487793009b3aea5b1a32&" },
  { label: "Hubs", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/925cfbb55e82458868f5e0c8cafbdc90d47bec0907e65b77fb918a7ac0dbcfe0?apiKey=7b9918e68d9b487793009b3aea5b1a32&" },
  { label: "Support Tickets", icon: "https://img.icons8.com/?size=100&id=18644&format=png&color=5B5D55" },
];

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    top: 60,
    bottom: 0,
    marginRight: 30,
    width: 210,
    backgroundColor: "white",
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "#f7fff4",
    borderRadius: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexGrow: 1
  },
  menuItem: {
    padding: 10,
    marginTop: 7,
    backgroundColor: "#f7fff4",
    borderRadius: 0,
    borderWidth: 0,
    height: 40,
    borderColor: "transparent",
  },
  menuItemHovered: {
    backgroundColor: '#EEFFF8',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 2,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: 190.3,
    height: 40,
  },
  menuItemSelected: {
    backgroundColor: '#f7fff4',
    borderBottomWidth: 0,
    borderRightColor: 'coral',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 2,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    width: 190.3,
    height: 40,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginLeft: 6,
    color: "black",
  },
  textActive: {
    color: "coral",
  },
  profileInfo: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 10,
    alignItems: "center",
    marginRight: -5,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    width: 170,
    alignSelf: "center",
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 30,
    width: 140,
    backgroundColor: '#E3F4DB',
    alignItems: "center",
    padding: 7,
    marginTop: 10,
    borderRadius: 5
  },
  messageCount: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 70
  },
  messageCountText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 11,
    fontFamily:"Roboto-Light" 
  },
});

export default MyComponent;
