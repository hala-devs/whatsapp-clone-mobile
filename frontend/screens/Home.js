import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Profile from './Profile';
import Chat from './Chat';
import Community from './Community';
import Header from '../components/Header';
import io from 'socket.io-client';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import { useStore } from '../libs/state';
import axios from '../libs/api';
import { API_URL } from '@env';

const TopTabs = createMaterialTopTabNavigator();

export default function Home() {
  const {
    setSocket,
    token,
    setMessages,
    setFriends,
    messages,
    user,
    friends,
    setTyping,
    setUser,
    currentReceiver,
    setCurrentReceiver,
    addMessage,
  } = useStore();

  useEffect(() => {
    console.log('Home mounted, setting up socket connection🍬🍬');
    const socket = io(API_URL, {
      query: { token: token.split(' ')[1] },
    });

    socket.on('receive_message', message => {
      console.log('Received message', message);
      addMessage(message);
    });

    socket.on('connect', () => {
      console.log('connected to the server with the id  : ', socket.id);
    });
    socket.on('disconnect', () => {
      console.log('disconnected from  the server : ');
    });

    socket.on('typing', () => setTyping(true));
    socket.on('stop_typing', () => setTyping(false));

    socket.on('user_created', userCreated => {
      if (user._id !== userCreated._id) {
        console.log([...friends, userCreated]);
        setFriends({ ...friends, userCreated });
      }
    });
    socket.on('user_updated', userUpdated => {
      if (user._id === userUpdated._id) {
        setUser(userUpdated);
      }
    });

    const fetchData = async () => {
      const usersRes = await axios.get('/user', {
        headers: {
          Authorization: token,
        },
      });
      const users = usersRes.data;

      const messagesRes = await axios.get('/message', {
        headers: {
          Authorization: token,
        },
      });

      const messages = messagesRes.data;
      console.log(users, '👋👋');
      setFriends(users);
      setMessages(messages);
    };
    fetchData();
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Header />
      <TopTabs.Navigator
        initialRouteName='Chat'
        screenOptions={{
          headerShown: false,
        }}
      >
        <TopTabs.Screen name='Profile' component={Profile} />
        <TopTabs.Screen name='Chat' component={Chat} />
        <TopTabs.Screen
          name='Community'
          component={Community}
          options={{
            tabBarLabelStyle: { display: 'none' },
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name='account-group' size={24} color={color} />
            ),
          }}
        />
      </TopTabs.Navigator>
    </>
  );
}
