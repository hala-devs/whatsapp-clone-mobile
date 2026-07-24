import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Avatar,
  Pressable,
  Icon,
  Spinner,
  Center,
  ScrollView,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useStore } from '../libs/state';
import EditUserModal from '../components/EditUserModal';
import { uploadImage } from '../libs/functions';

export default function Profile() {
  const { user, token } = useStore();

  const [file, setFile] = useState(user?.profilePicture || null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // تحديث الصورة لو تغيرت داخل الـ Store
  useEffect(() => {
    if (user?.profilePicture) {
      setFile(user.profilePicture);
    }
  }, [user?.profilePicture]);

  // تحقق من وجود user
  if (!user) {
    return (
      <Center flex={1} bg="coolGray.50">
        <Spinner size="lg" color="#0e806a" />
        <Text mt="3" color="coolGray.500" fontWeight="medium">
          Loading profile...
        </Text>
      </Center>
    );
  }

  const { lastName, firstName, status } = user;
  const actualStatus = status || 'No status set';

  function openModal() {
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  // ✅ دالة اختيار الصورة المحسنة لحل مشكلة الأذونات
  async function pickImage() {
    try {
      // 1. جلب حالة الإذن الحالية
      let permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();

      // 2. طلب الإذن إذا لم يكن ممنوحاً
      if (!permissionResult.granted) {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      // 3. التحقق مما إذا كان المستخدم رفض الإذن كلياً
      const isGranted = permissionResult.granted || permissionResult.accessPrivileges === 'limited';

      if (!isGranted) {
        Alert.alert(
          'Permission Required',
          'We need access to your photo gallery to update your profile picture. Please enable it in Settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      // 4. فتح الاستوديو
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const localUrl = result.assets[0].uri;
        setFile(localUrl);
        setIsUploading(true);

        try {
          const response = await uploadImage(token, localUrl);
          console.log('Upload response:', response);
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Upload Failed', 'Something went wrong while uploading the image.');
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  }

  const firstLetter = firstName ? firstName.charAt(0).toUpperCase() : 'U';

  // فحص آمن للتأكد من وجود رابط صورة غير فارغ
  const hasValidPicture = Boolean(
    file && 
    typeof file === 'string' && 
    file.trim() !== ''
  );

  return (
    <Box flex={1} bg="coolGray.50">
      <EditUserModal modalVisible={modalVisible} closeModal={closeModal} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <VStack space={6} px="5" py="8" alignItems="center">
          
          {/* 1. قسم الصورة الشخصية */}
          <Box position="relative">
            <Pressable onPress={pickImage} disabled={isUploading}>
              {hasValidPicture ? (
                <Avatar
                  size="130px"
                  source={{ uri: file }}
                  borderWidth="3"
                  borderColor="white"
                  shadow="3"
                />
              ) : (
                <Avatar
                  size="130px"
                  bg="emerald.700"
                  _text={{ color: 'white', fontWeight: 'bold', fontSize: '3xl' }}
                  borderWidth="3"
                  borderColor="white"
                  shadow="3"
                >
                  {firstLetter}
                </Avatar>
              )}

              {/* أيقونة الكاميرا */}
              <Box
                position="absolute"
                bottom="0"
                right="0"
                bg="#0e806a"
                p="2.5"
                borderRadius="full"
                borderWidth="2"
                borderColor="white"
                shadow="2"
              >
                <Icon as={MaterialIcons} name="photo-camera" size="4" color="white" />
              </Box>
            </Pressable>

            {isUploading && (
              <Center
                position="absolute"
                top="0"
                bottom="0"
                left="0"
                right="0"
                bg="black:alpha.40"
                borderRadius="full"
              >
                <Spinner color="white" size="small" />
              </Center>
            )}
          </Box>

          {/* 2. بطاقة البيانات */}
          <VStack w="100%" maxW="380px" space={3} mt="2">
            <Box bg="white" p="4" borderRadius="16" shadow="1">
              <HStack space={3} alignItems="center">
                <Center bg="emerald.50" p="2.5" borderRadius="12">
                  <Icon as={MaterialIcons} name="person" size="5" color="#0e806a" />
                </Center>
                <VStack flex={1}>
                  <Text fontSize="xs" color="coolGray.400" fontWeight="bold" textTransform="uppercase">
                    Full Name
                  </Text>
                  <Text fontSize="md" color="coolGray.800" fontWeight="bold" mt="0.5">
                    {firstName} {lastName}
                  </Text>
                </VStack>
              </HStack>
            </Box>

            <Box bg="white" p="4" borderRadius="16" shadow="1">
              <HStack space={3} alignItems="center">
                <Center bg="emerald.50" p="2.5" borderRadius="12">
                  <Icon as={MaterialIcons} name="info-outline" size="5" color="#0e806a" />
                </Center>
                <VStack flex={1}>
                  <Text fontSize="xs" color="coolGray.400" fontWeight="bold" textTransform="uppercase">
                    Status / Bio
                  </Text>
                  <Text fontSize="sm" color="coolGray.700" fontWeight="medium" mt="0.5">
                    {actualStatus}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>

          {/* 3. زر التعديل */}
          <Button
            w="100%"
            maxW="380px"
            py="3.5"
            borderRadius="14"
            bg="#0e806a"
            _pressed={{ bg: '#0b6856' }}
            shadow="2"
            leftIcon={<Icon as={MaterialIcons} name="edit" size="5" color="white" />}
            _text={{ fontWeight: 'bold', fontSize: 'md' }}
            onPress={openModal}
            mt="2"
          >
            Edit Profile
          </Button>

        </VStack>
      </ScrollView>
    </Box>
  );
}
