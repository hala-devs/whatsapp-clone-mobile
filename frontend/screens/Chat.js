import { View, Text, FlatList } from 'react-native';
import React from 'react';
import ChatItem from '../components/ChatItem';
import { useStore } from '../libs/state';

export default function Chat() {
  const { friends } = useStore();

  return (
    <View>
      <FlatList
        data={friends}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <ChatItem
            _id={item._id}
            lastName={item.lastName}
            firstName={item.firstName}
            status={item.status}
            profilePicture={item.profilePicture}
          />
        )}
      />
    </View>
  );
}
