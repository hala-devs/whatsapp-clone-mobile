import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

export default function MessageItem(props) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: props.isSender ? 'blue' : 'gray',
          alignSelf: props.isSender ? 'flex-end' : 'flex-start',
          borderWidth: props.isSender ? 0 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: props.isSender ? 'white' : 'black',
          },
        ]}
      >
        {props?.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: 'rgba(0,0,0,0.2)',
    margin: 12,
    borderRadius: 10,
    maxWidth: '70%',
  },
  title: {
    fontSize: 18,
    color: 'white',
  },
});
