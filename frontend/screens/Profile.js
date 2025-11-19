import { View, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import { Button } from 'native-base';
import React, { useState } from 'react';
import { useStore } from '../libs/state';
import EditUserModal from '../components/EditUserModal.js';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../libs/functions'; 

export default function Profile() {
  const { user, token } = useStore(); 
  
  // ✅ تحقق من وجود user
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user data...</Text>
      </View>
    );
  }
  
  const { lastName, firstName, profilePicture, status } = user;
  const [file, setFile] = useState(profilePicture || 'https://via.placeholder.com/150');
  const actualStatus = status || 'No status';
  const [modalVisible, setModalVisible] = useState(false);

  function openModal() {
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry we need camera roll permission to upload images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      const localUrl = result.assets[0].uri;
      setFile(localUrl);
      try {
        const response = await uploadImage(token, localUrl);
        console.log('Upload response:', response);
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Upload Failed', 'Something went wrong while uploading the image.');
      }
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <EditUserModal modalVisible={modalVisible} closeModal={closeModal} />
      
      {/* ✅ التصميم الأصلي */}
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: file }} style={styles.profilePicture} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.subContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.label}>Status</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{firstName} {lastName}</Text>
          <Text style={styles.text}>{actualStatus}</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          onPress={openModal}
          bg="#0e806a"
          _hover={{ bg: "green.700" }}
        >
          Edit Profile
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  imageContainer: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 1000,
  },
  subContainer: {
    marginTop: 40,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  labelContainer: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  label: {
    fontSize: 20,
    marginVertical: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
});