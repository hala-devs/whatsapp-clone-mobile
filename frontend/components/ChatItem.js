import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import moment from 'moment';
import { useStore } from '../libs/state'; // تصحيح مسار الاستيراد
import { getReceiverMessages } from '../libs/functions';
import { useNavigation } from '@react-navigation/native';

export default function ChatItem(props) {
  const { messages, socket } = useStore();
  const navigation = useNavigation();

  const contactMessages = getReceiverMessages(messages, props._id);
  const lastMessage = contactMessages[contactMessages.length - 1];

  const unreadMessages = contactMessages?.filter(
    message => !message.seen && message.receiverId === props._id // تصحيح: يجب أن تكون === بدلاً من !==
  ).length;

  return (
    <TouchableOpacity
      onPress={() => {
        socket?.emit('seen', props._id);
        navigation.navigate('Messages', {
          // تصحيح: navigation بدلاً من navigator
          lastName: props.lastName,
          firstName: props.firstName,
          _id: props._id,
        });
      }}
    >
      <View style={styles.container}>
        <View style={styles.chatContainer}>
          <Image style={styles.image} source={{ uri: props.profilePicture }} />
          <View style={styles.chatContent}>
            {/* تصحيح: استخدام chatContent بدلاً من chatContainer */}
            <Text>
              {props.firstName} {props.lastName}
            </Text>
            {/* إضافة مسافة بين الاسمين */}
            <Text style={styles.lastMessage}>
              {lastMessage?.content || 'Start the conversation'}
              {/* تصحيح: content بدلاً من contant */}
            </Text>
          </View>
        </View>
        <View style={styles.unreadMessageContainer}>
          <Text>{moment(lastMessage?.createdAt).format('hh:mm A')}</Text>
          {/* تصحيح: createdAt بدلاً من createsAt */}
          {unreadMessages > 0 && (
            <View style={styles.unreadMessages}>
              <Text style={{ color: 'white' }}>{unreadMessages < 9 ? unreadMessages : '+9'}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  chatContent: {
    marginLeft: 16,
  },
  unreadMessageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  unreadMessages: {
    backgroundColor: '#0e806a',
    width: 25,
    height: 25,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMessage: {
    color: '#9e9e9e',
    width: 200,
  },
});
