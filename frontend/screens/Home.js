import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import io from 'socket.io-client';
import { API_URL } from '@env';

import Profile from './Profile';
import Chat from './Chat';
import Community from './Community';
import Header from '../components/Header';
import { useStore } from '../libs/state';
import axios from '../libs/api';

const TopTabs = createMaterialTopTabNavigator();

export default function Home() {
  const {
    setSocket,
    token,
    setMessages,
    setFriends,
    user,
    setTyping,
    setUser,
    addMessage,
  } = useStore();

  useEffect(() => {
    if (!token) return;

    console.log('Home mounted, setting up socket connection 🍬🍬');
    
    // استخراج التوكن بشكل آمن ومحمي
    const formattedToken = token.includes(' ') ? token.split(' ')[1] : token;

    const socket = io(API_URL, {
      query: { token: formattedToken },
    });

    // 1. استقبال الرسائل
    socket.on('receive_message', (message) => {
      console.log('Received message:', message);
      addMessage(message);
    });

    // 2. أحداث الاتصال
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // 3. التحديث اللحظي للكتابة (Typing Status)
    socket.on('typing', () => setTyping(true));
    socket.on('stop_typing', () => setTyping(false));

    // 4. إضافة مستخدم جديد للقائمة فوراً عند التسجيل (تصحيح المكتوب سابقاً)
    socket.on('user_created', (userCreated) => {
      if (user?._id !== userCreated._id) {
        setFriends((prevFriends) => {
          const exists = prevFriends.some((f) => f._id === userCreated._id);
          if (exists) return prevFriends;
          return [...prevFriends, userCreated];
        });
      }
    });

    // 5. تحديث بيانات المستخدم
    socket.on('user_updated', (userUpdated) => {
      if (user?._id === userUpdated._id) {
        setUser(userUpdated);
      }
    });

    // جلب البيانات الأولية عند فتح الصفحة
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('/user', {
          headers: { Authorization: token },
        });

        const messagesRes = await axios.get('/message', {
          headers: { Authorization: token },
        });

        setFriends(usersRes.data);
        setMessages(messagesRes.data);
      } catch (error) {
        console.log('Error fetching home data:', error?.response?.data || error.message);
      }
    };

    fetchData();
    setSocket(socket);

    // تنظيف الاتصال عند الخروج من الصفحة
    return () => {
      socket.disconnect();
    };
  }, [token]);

  return (
    <>
      <Header />
      <TopTabs.Navigator
        initialRouteName="Chat"
        screenOptions={{
          tabBarActiveTintColor: '#0e806a',
          tabBarInactiveTintColor: '#888',
          tabBarIndicatorStyle: { backgroundColor: '#0e806a', height: 3 },
          tabBarLabelStyle: { fontWeight: 'bold', fontSize: 13, textTransform: 'capitalize' },
          tabBarStyle: { backgroundColor: '#fff', elevation: 2, shadowOpacity: 0.1 },
        }}
      >
        <TopTabs.Screen
          name="Chat"
          component={Chat}
          options={{
            tabBarLabel: 'Chats',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="chat" size={22} color={color} />
            ),
          }}
        />

        <TopTabs.Screen
          name="Community"
          component={Community}
          options={{
            tabBarLabel: 'Community',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-group" size={22} color={color} />
            ),
          }}
        />

        <TopTabs.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" size={22} color={color} />
            ),
          }}
        />
      </TopTabs.Navigator>
    </>
  );
}