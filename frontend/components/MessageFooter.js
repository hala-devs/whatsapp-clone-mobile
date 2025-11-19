import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useStore } from '../libs/state';

export default function MessageFooter(props) {
  const [input, setInput] = useState('');
  const { socket } = useStore();

  const sendMessage = () => {
    if (input.trim() === '') return;
    socket.emit('send_message', {
      receiverId: props._id,
      content: input.trim(),
    });
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.select({ ios: 85, android: 0 })}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder='Type a message...'
          value={input}
          onChangeText={text => setInput(text)}
          onSubmitEditing={sendMessage}
        />
        <Icon 
          name='send' 
          style={styles.sendButton} 
          onPress={sendMessage} 
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    padding: 16,
    backgroundColor: '#0e806a',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#075e54',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
    elevation: 2,
  },
  sendButton: {
    color: 'white',
    fontSize: 24,
    padding: 8,
  },
});