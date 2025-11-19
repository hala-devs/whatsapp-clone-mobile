import { View, FlatList, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useStore } from '../libs/state';
import MessageItem from '../components/MessageItem';
import MessageFooter from '../components/MessageFooter';
import { getReceiverMessages } from '../libs/functions';

export default function Messages() {
  const route = useRoute();
  const navigation = useNavigation();
  const { _id, firstName, lastName } = route.params;
  const { messages, user } = useStore();

  useEffect(() => {
    navigation.setOptions({
      title: `${firstName} ${lastName}`,
      headerStyle: { backgroundColor: '#0e806a' },
      headerTintColor: 'white',
      headerTitleStyle: { fontWeight: 'bold' },
    });
  }, [firstName, lastName]);

  const chatMessages = getReceiverMessages(messages, _id);

  return (
    <View style={styles.container}>
      <FlatList
        data={chatMessages}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <MessageItem
            content={item.content}
            isSender={item.senderId === user._id}
            timestamp={item.createdAt}
          />
        )}
      />
      <MessageFooter _id={_id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});