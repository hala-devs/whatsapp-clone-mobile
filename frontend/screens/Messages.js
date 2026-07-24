import { View, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useStore } from '../libs/state';
import MessageItem from '../components/MessageItem';
import MessageFooter from '../components/MessageFooter';
import { getReceiverMessages } from '../libs/functions';

export default function Messages() {
  const route = useRoute();
  const navigation = useNavigation();
  const { _id, firstName, lastName } = route.params || {};
  const { messages, user } = useStore();
  const flatListRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: firstName ? `${firstName} ${lastName || ''}`.trim() : 'Chat',
      headerStyle: { backgroundColor: '#0e806a' },
      headerTintColor: 'white',
      headerTitleStyle: { fontWeight: 'bold' },
    });
  }, [navigation, firstName, lastName]);

  const chatMessages = getReceiverMessages(messages, _id);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item?._id || item?.id || String(Math.random())}
        renderItem={({ item }) => (
          <MessageItem
            content={item?.content}
            isSender={item?.senderId === user?._id}
            timestamp={item?.createdAt}
          />
        )}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      <MessageFooter _id={_id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeae2',
  },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});