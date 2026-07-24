import React from 'react';
import {
  Box,
  HStack,
  Text,
  Avatar,
  Pressable,
  Icon,
  StatusBar,
  Menu,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../libs/state';

export default function Header() {
  const { user, setUser, setToken } = useStore();
  const navigation = useNavigation();

  if (!user) {
    return null;
  }

  // دالة تسجيل الخروج وتنظيف الجلسة بالكامل
  const handleLogout = () => {
    if (setToken) setToken(null);
    if (setUser) setUser(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // استخراج أول حرف من الاسم للآفتار
  const firstLetter = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0b6856" />
      
      <Box bg="#0e806a" pt="12" pb="3" px="4" shadow="3">
        <HStack justifyContent="space-between" alignItems="center">
          
          {/* معلومات المستخدم: الصورة/الآفتار مع الاسم والصفة */}
          <HStack space={3} alignItems="center">
            <Pressable onPress={() => navigation.navigate('Profile')}>
              {user.profilePicture ? (
                <Avatar
                  size="40px"
                  source={{ uri: user.profilePicture }}
                  borderWidth="1.5"
                  borderColor="white"
                />
              ) : (
                <Avatar
                  size="40px"
                  bg="emerald.700"
                  _text={{ color: 'white', fontWeight: 'bold', fontSize: 'md' }}
                  borderWidth="1.5"
                  borderColor="white"
                >
                  {firstLetter}
                </Avatar>
              )}
            </Pressable>

            <Box>
              <Text color="white" fontSize="md" fontWeight="bold" noOfLines={1}>
                {user.firstName} {user.lastName}
              </Text>
              {user.status && (
                <Text color="emerald.100" fontSize="xs" fontWeight="medium" noOfLines={1}>
                  {user.status}
                </Text>
              )}
            </Box>
          </HStack>

          {/* القائمة الجانبية أو الأزرار السريعة */}
          <HStack space={1} alignItems="center">
            {/* قائمة خيارات احترافية */}
            <Menu
              w="160"
              trigger={(triggerProps) => {
                return (
                  <Pressable p="2" borderRadius="full" _pressed={{ bg: 'emerald.800' }} {...triggerProps}>
                    <Icon as={<MaterialIcons name="more-vert" />} size="6" color="white" />
                  </Pressable>
                );
              }}
            >
              <Menu.Item onPress={() => navigation.navigate('Profile')}>
                <HStack space={2} alignItems="center">
                  <Icon as={<MaterialIcons name="person" />} size="5" color="coolGray.600" />
                  <Text color="coolGray.800" fontWeight="medium">Profile</Text>
                </HStack>
              </Menu.Item>
              
              <Menu.Item onPress={handleLogout}>
                <HStack space={2} alignItems="center">
                  <Icon as={<MaterialIcons name="logout" />} size="5" color="red.500" />
                  <Text color="red.500" fontWeight="bold">Logout</Text>
                </HStack>
              </Menu.Item>
            </Menu>
          </HStack>

        </HStack>
      </Box>
    </>
  );
}