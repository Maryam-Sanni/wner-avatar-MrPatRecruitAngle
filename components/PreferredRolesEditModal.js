import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFonts } from 'expo-font';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PreferredRolesEditModal = ({ visible, onClose, onSave }) => {
  const roles = ['SAP', 'Microsoft', 'Salesforce', 'Frontend Development', 'Backend Development', 'UI/UX', 'Data Analysis', 'Cloud Computing', 'Management']; // List of roles
  const [selectedRole, setSelectedRole] = useState(roles[0]); // Default to the first role

  const handleSavePreferredRole = async () => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('Token not found. Please sign in again.');
        return;
      }

      // Prepare data for API request
      const data = {
        preferred_role: selectedRole
      };

      // Send POST request to API
      const response = await axios.post('https://recruitangle.com/api/expert/update-profile', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Save Specification Response:', response.data);

      // Close modal after successful save
      onClose();
    } catch (error) {
      console.error('Save Specification Error:', error);
      alert('Failed to save preferred locations. Please try again.');
    }

    // Save the locations in the parent component
    onSave(selectedRole);
  };

  const [fontsLoaded] = useFonts({
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
  });

  const { t } = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1f2d38e99b0016f2bd167d2cfd38ff0d43c9f94a93c84b4e04a02d32658fb401?apiKey=7b9918e68d9b487793009b3aea5b1a32&' }}
              style={styles.logo}
            />
            <Text style={styles.headerText}>{t('Edit Preferred Role')}</Text>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={{ fontSize: 18, color: '#3F5637', fontWeight: 'bold', fontFamily: 'Roboto-Light' }}>✕</Text>
            </TouchableOpacity>
          </View>

          {roles.map((role, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.roleItem, selectedRole === role && styles.selectedRole]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={styles.roleText}>{role}</Text>
            </TouchableOpacity>
          ))}

          <View style={{ width: 200, marginTop: 20 }}>
            <Button title="Save" onPress={handleSavePreferredRole} color="coral" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    marginTop: 40,
    width: 600,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  header: {
    width: 600,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    marginBottom: 50,
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
  roleItem: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#d3f9d8',
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: '#a1e6a1',
  },
  roleText: {
    fontSize: 16,
    color: '#206C00',
  },
});

export default PreferredRolesEditModal;
