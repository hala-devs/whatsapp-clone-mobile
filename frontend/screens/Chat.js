import React from 'react';
import { FlatList, Box } from 'native-base';
import { useStore } from '../libs/state';
import ChatItem from '../components/ChatItem';
import { getReceiverMessages } from '../libs/functions';

export default function Chat() {
  const { friends, messages } = useStore();

  // ترتيب القائمة بحيث تكون المحادثة ذات أحدث رسالة في الأعلى دائماً
  const sortedFriends = [...(friends || [])].sort((a, b) => {
    const messagesA = getReceiverMessages(messages, a._id);
    const messagesB = getReceiverMessages(messages, b._id);

    const lastMsgA = messagesA[messagesA.length - 1];
    const lastMsgB = messagesB[messagesB.length - 1];

    const timeA = lastMsgA?.createdAt ? new Date(lastMsgA.createdAt).getTime() : 0;
    const timeB = lastMsgB?.createdAt ? new Date(lastMsgB.createdAt).getTime() : 0;

    return timeB - timeA; // الأحدث يرتفع للأعلى
  });

  return (
    <Box flex={1} bg="white">
      <FlatList
        data={sortedFriends}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ChatItem {...item} />}
      />
    </Box>
  );
}