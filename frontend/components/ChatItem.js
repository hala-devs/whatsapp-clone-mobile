import React from 'react';
import { Box, Text, HStack, VStack, Avatar, Pressable } from 'native-base';
import moment from 'moment';
import { useStore } from '../libs/state';
import { getReceiverMessages } from '../libs/functions';
import { useNavigation } from '@react-navigation/native';

export default function ChatItem(props) {
  const { messages, socket, user } = useStore();
  const navigation = useNavigation();

  const contactMessages = getReceiverMessages(messages, props._id);
  const lastMessage = contactMessages[contactMessages.length - 1];

  const unreadMessages = contactMessages?.filter(
    message => !message.seen && message.receiverId === user?._id
  ).length;

  const formattedTime = lastMessage?.createdAt 
    ? moment(lastMessage.createdAt).format('hh:mm A') 
    : '';

  const hasValidPicture = Boolean(
    props.profilePicture && 
    typeof props.profilePicture === 'string' && 
    props.profilePicture.trim() !== ''
  );

  const imageUri = hasValidPicture 
    ? `${props.profilePicture}?t=${new Date(props.updatedAt || Date.now()).getTime()}`
    : null;

  const firstLetter = props.firstName ? props.firstName.charAt(0).toUpperCase() : 'U';

  return (
    <Pressable
      onPress={() => {
        socket?.emit('seen', props._id);
        navigation.navigate('Messages', {
          lastName: props.lastName,
          firstName: props.firstName,
          _id: props._id,
          profilePicture: props.profilePicture,
        });
      }}
      _pressed={{ bg: 'coolGray.100' }}
    >
      <HStack
        justifyContent="space-between"
        alignItems="center"
        p="4"
        borderBottomWidth="1"
        borderBottomColor="coolGray.200"
      >
        <HStack space={4} alignItems="center" flex={1}>
          {hasValidPicture ? (
            <Avatar
              size="55px"
              source={{ uri: imageUri }}
            />
          ) : (
            <Avatar
              size="55px"
              bg="emerald.700"
              _text={{ color: 'white', fontWeight: 'bold', fontSize: 'xl' }}
            >
              {firstLetter}
            </Avatar>
          )}

          <VStack flex={1}>
            <Text fontSize="md" fontWeight="bold" color="coolGray.800" noOfLines={1}>
              {props.firstName} {props.lastName}
            </Text>
            <Text 
              fontSize="sm" 
              color={unreadMessages > 0 ? 'coolGray.800' : 'coolGray.500'} 
              fontWeight={unreadMessages > 0 ? 'bold' : 'normal'}
              noOfLines={1} 
              mt="0.5"
            >
              {lastMessage?.content || 'Start the conversation'}
            </Text>
          </VStack>
        </HStack>

        <VStack alignItems="flex-end" space={1}>
          <Text fontSize="xs" color={unreadMessages > 0 ? '#0e806a' : 'coolGray.400'} fontWeight={unreadMessages > 0 ? 'bold' : 'normal'}>
            {formattedTime}
          </Text>
          {unreadMessages > 0 && (
            <Box
              bg="#0e806a"
              px="2"
              py="0.5"
              borderRadius="full"
              minW="22px"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontSize="xs" fontWeight="bold">
                {unreadMessages < 9 ? unreadMessages : '+9'}
              </Text>
            </Box>
          )}
        </VStack>
      </HStack>
    </Pressable>
  );
}