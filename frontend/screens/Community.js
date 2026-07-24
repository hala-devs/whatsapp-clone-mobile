import React from 'react';
import {
  Box,
  Text,
  VStack,
  Heading,
  Button,
  Image,
  Center,
  HStack,
  Icon,
  ScrollView,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Community() {
  const navigation = useNavigation();

  return (
    <Box flex={1} bg="coolGray.50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Center flex={1} px="6" py="10">
          
          {/* 1. شعار التطبيق بداخل خلفية ناعمة */}
          <Box
            bg="emerald.100"
            p="5"
            borderRadius="3xl"
            mb="6"
            shadow="2"
          >
            <Image
              source={require('../assets/logo.png')}
              alt="Community Logo"
              size="80px"
              resizeMode="contain"
            />
          </Box>

          {/* 2. النصوص الترحيبية */}
          <Heading
            size="xl"
            fontWeight="800"
            color="coolGray.800"
            textAlign="center"
            mb="2"
          >
            Welcome to Community
          </Heading>
          
          <Text
            fontSize="sm"
            color="coolGray.500"
            textAlign="center"
            maxW="280"
            mb="8"
            lineHeight="20px"
          >
            Connect with friends, share updates, and stay in touch with your circles effortlessly.
          </Text>

          {/* 3. كروت الميزات التوضيحية */}
          <VStack space={3} w="100%" maxW="320" mb="8">
            <HStack bg="white" p="3.5" borderRadius="16" alignItems="center" space={3} shadow="1">
              <Center bg="emerald.50" p="2.5" borderRadius="12">
                <Icon as={MaterialIcons} name="chat-bubble-outline" size="5" color="#0e806a" />
              </Center>
              <VStack flex={1}>
                <Text fontWeight="bold" fontSize="sm" color="coolGray.800">
                  Instant Messaging
                </Text>
                <Text fontSize="xs" color="coolGray.400">
                  Real-time seamless conversations
                </Text>
              </VStack>
            </HStack>

            <HStack bg="white" p="3.5" borderRadius="16" alignItems="center" space={3} shadow="1">
              <Center bg="emerald.50" p="2.5" borderRadius="12">
                <Icon as={MaterialIcons} name="people-outline" size="5" color="#0e806a" />
              </Center>
              <VStack flex={1}>
                <Text fontWeight="bold" fontSize="sm" color="coolGray.800">
                  Active Community
                </Text>
                <Text fontSize="xs" color="coolGray.400">
                  Stay updated with your friends
                </Text>
              </VStack>
            </HStack>
          </VStack>

          {/* 4. زر الانتقال للمحادثات بنفس التوجيه المضبوط */}
          <Button
            w="100%"
            maxW="320"
            py="3.5"
            borderRadius="14"
            bg="#0e806a"
            _pressed={{ bg: '#0b6856' }}
            shadow="2"
            leftIcon={<Icon as={MaterialIcons} name="chat" size="5" color="white" />}
            _text={{ fontWeight: 'bold', fontSize: 'md' }}
            onPress={() => navigation.navigate('Chat')}
          >
            Go to Chat
          </Button>

        </Center>
      </ScrollView>
    </Box>
  );
}