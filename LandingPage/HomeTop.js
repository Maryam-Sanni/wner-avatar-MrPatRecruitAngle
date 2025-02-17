import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, FlatList } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ProductsPopup from './ProductsPopup';
import SolutionsPopup from './SolutionsPopup';
import MorePopup from './MorePopup';

const PickerItem = ({ label, icon, onPress }) => (
  <TouchableOpacity style={styles.pickerItem} onPress={onPress}>
    <Image source={icon} style={styles.pickerItemIcon} />
    <Text style={styles.pickerItemText}>{label}</Text>
  </TouchableOpacity>
);

const MyComponent = () => {
  const navigation = useNavigation();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const { i18n, t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false); // For handling the modal visibility
  const [showProductsPopup, setShowProductsPopup] = useState(false);
  const [showSolutionsPopup, setShowSolutionsPopup] = useState(false);
  const [showMorePopup, setShowMorePopup] = useState(false);

  const handleProductsHover = () => {
    setShowProductsPopup(true);
  };

  const handleProductsClose = () => {
    setShowProductsPopup(false);
  };

  const handleSolutionsHover = () => {
    setShowSolutionsPopup(true);
  };

  const handleSolutionsclose = () => {
    setShowSolutionsPopup(false);
  };

  const handleMoreHover = () => {
    setShowMorePopup(true);
  };

  const handleMoreclose = () => {
    setShowMorePopup(false);
  };

  const handleXPress = () => {
    navigation.navigate('Join Recruitangle');
  };

  const handleSignInPress = () => {
    navigation.navigate('Sign in to AngleQuest');
  };

  const handleAIPress = () => {
    navigation.navigate('AI');
  };

  const languages = [
    { code: 'en', label: 'English', icon: require('../assets/english.png') },
    { code: 'nl', label: 'Dutch', icon: require('../assets/dutch.png') },
    { code: 'es', label: 'Spanish', icon: require('../assets/spanish.png') },
    { code: 'fr', label: 'French', icon: require('../assets/french.png') },
    { code: 'de', label: 'German', icon: require('../assets/german.png') },
    { code: 'zh', label: 'Mandarin', icon: require('../assets/mandarin.png') },
    { code: 'hi', label: 'Hindi', icon: require('../assets/hindi.png') },
    { code: 'ar', label: 'Arabic', icon: require('../assets/arabic.png') },
    { code: 'bn', label: 'Bengali', icon: require('../assets/bengali.png') },
    { code: 'pt', label: 'Portuguese', icon: require('../assets/portuguese.png') },
  ];

  const toggleLanguageSwitcher = () => {
    setShowLanguagePicker(!showLanguagePicker);
  };

  const onChangeLang = (lang_code) => {
    i18n.changeLanguage(lang_code);
    setShowLanguagePicker(false);
  };

  const selectedLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1f2d38e99b0016f2bd167d2cfd38ff0d43c9f94a93c84b4e04a02d32658fb401?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
          style={styles.logo}
        />
        <View>
        <Text
          style={{ fontSize: 18, marginRight: 5, marginLeft: 30, fontWeight: 500 }}
          onMouseEnter={handleProductsHover}
        >
          Products
        </Text>
        </View>
        <Image
                  source={require('../assets/icons8-arrow-down-24.png')}
                  style={styles.arrowdown}
                />
                
        <TouchableOpacity>
        <Text
          style={{ fontSize: 18, marginRight: 5, fontWeight: 500 }}
          onMouseEnter={handleSolutionsHover}
        >
          Solutions
        </Text>
        </TouchableOpacity>

        <Image
                  source={require('../assets/icons8-arrow-down-24.png')}
                  style={styles.arrowdown}
                />
                <TouchableOpacity onPress={handleAIPress}>
        <Text style={{ fontSize: 18, marginRight: 5, fontWeight: 500 }}>AngleQuest AI</Text>
        </TouchableOpacity>
        <View onMouseEnter={handleMoreHover}>
                 <Image
                  source={require('../assets/icons8-ellipsis-30.png')}
                  style={styles.topicons}
                />
                </View>
                <Image
                  source={require('../assets/icons8-search-30.png')}
                  style={styles.search}
                />
                <Image
                  source={require('../assets/icons8-notification.gif')}
                  style={styles.megaphone}
                />
        <TouchableOpacity onPress={toggleLanguageSwitcher} style={styles.languageButton}>
          <Image source={selectedLanguage.icon} style={styles.languageIcon} />
          <Text style={styles.languageButtonText}>{selectedLanguage.code}</Text>
        </TouchableOpacity>
        <Modal visible={showLanguagePicker} animationType="fade" transparent={true} onRequestClose={() => setShowLanguagePicker(false)}>
          <TouchableWithoutFeedback onPress={() => setShowLanguagePicker(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.languageModalContent}>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <PickerItem
                  label={item.label}
                  icon={item.icon}
                  onPress={() => onChangeLang(item.code)}
                />
              )}
            />
          </View>
        </Modal>
       
        <TouchableOpacity style={{ position: "absolute", right: 210 }} onPress={handleSignInPress}>
        <Text style={{ fontSize: 16, fontWeight: 500 }}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.joinButton} onPress={handleXPress}>
          <Text style={styles.joinButtonText}>See Progress</Text>
        </TouchableOpacity>
      </View>
      <ProductsPopup visible={showProductsPopup} onClose={() => setShowProductsPopup(false)} />
      <SolutionsPopup visible={showSolutionsPopup} onClose={() => setShowSolutionsPopup(false)} />
      <MorePopup visible={showMorePopup} onClose={() => setShowMorePopup(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    width: 1400,
    alignSelf: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 17,
    backgroundColor: 'white',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 5,
    marginLeft: 50,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'darkgreen',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: 'white',
    position: 'absolute',
    right: 257
  },
  languageIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  languageButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 500
  },
  joinButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'coral',
    padding: 10,
    position: 'absolute',
    right: 70,
    borderRadius: 5
  },
  joinButtonText: {
    color: 'coral',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  languageModalContent: {
    position: 'absolute',
    width: '20%',
    right: 10,
    top: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 20,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  pickerItemIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  pickerItemText: {
    fontSize: 18,
  },
  arrowdown: {
    width: 20,
    height: 20,
    marginRight: 30
  },
  topicons: {
    width: 20,
    height: 20,
    marginLeft: 30
  },
  megaphone: {
    width: 25,
    height: 25,
   position: "absolute",
   right: 343
  },
  search: {
    width: 24,
    height: 24,
   position: "absolute",
   right: 393
  },
});

export default MyComponent;
