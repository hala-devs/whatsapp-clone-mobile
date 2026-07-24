import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useStore } from '../libs/state';

export default function MessageFooter({ _id }) {
  const [input, setInput] = useState('');
  const { socket } = useStore();
  const typingTimeoutRef = useRef(null);

  const handleTextChange = (text) => {
    setInput(text);

    if (!socket) return;

    socket.emit('typing', _id);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', _id);
    }, 1500);
  };

  const sendMessage = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || !socket) return;

    socket.emit('send_message', {
      receiverId: _id,
      content: trimmedInput,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit('stop_typing', _id);

    setInput('');
  };

  const isInputEmpty = input.trim().length === 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={handleTextChange}
            multiline
            maxLength={1000}
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.sendButton, 
            isInputEmpty ? styles.sendButtonDisabled : styles.sendButtonActive
          ]} 
          onPress={sendMessage}
          disabled={isInputEmpty}
          activeOpacity={0.7}
        >
          <Icon 
            name="send" 
            size={16} 
            color="#FFFFFF" 
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#efeae2',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    marginRight: 8,
    maxHeight: 120,
    minHeight: 44,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  input: {
    fontSize: 16,
    color: '#111b21',
    lineHeight: 20,
    paddingTop: Platform.OS === 'ios' ? 4 : 0,
    paddingBottom: Platform.OS === 'ios' ? 4 : 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  sendButtonActive: {
    backgroundColor: '#00a884',
  },
  sendButtonDisabled: {
    backgroundColor: '#b4c3bc',
  },
  sendIcon: {
    marginLeft: 2,
  },
});