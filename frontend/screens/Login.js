import { View, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import {
  Box,
  Text,
  Button,
  Link,
  Input,
  FormControl,
  VStack,
  Heading,
  Toast,
  HStack,
} from 'native-base';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import axios from '../libs/api';
import { useStore } from '../libs/state'; // ✅ استيراد zustand

export default function Login() {
  const navigation = useNavigation();

  const { setUser, setToken } = useStore(); // ✅ استدعاء setUser و setToken من zustand

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    }),
  });

  async function onSubmit() {
    const errors = Object.values(formik.errors);
    if (errors.length > 0) {
      Toast.show({
        title: errors.join('\n'),
        status: 'error',
        backgroundColor: '#ff5252',
        placement: 'top',
      });
    } else {
      try {
        const response = await axios.post('/user/login', {
          email: formik.values.email,
          password: formik.values.password,
        });

        if (response.data.errors) {
          Toast.show({
            title: response.data.errors,
            status: 'error',
            backgroundColor: '#ff5252',
            placement: 'top',
          });
        } else {
          console.log(response, '✅✅✅');
          // ✅ حفظ المستخدم والتوكن في الستور
          setUser(response.data.user);
setToken(`Bearer ${response.data.token}`);

          Toast.show({
            title: response.data.message || 'Login successful',
            status: 'success',
            backgroundColor: '#0e806a',
            placement: 'top',
          });

          navigation.navigate('Home');
        }
      } catch (error) {
        Toast.show({
          title: 'Login failed. Please try again.',
          status: 'error',
          backgroundColor: '#ff5252',
          placement: 'top',
        });
        console.error('Login error:', error);
      }
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Box safeArea w='90%' maxW={290}>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
        <Heading size='lg' fontWeight='600' color='coolGray.800'>
          Welcome
        </Heading>
        <Heading mt='1' color='coolGray.600' fontWeight='medium' size='xs'>
          Login to continue!
        </Heading>
        <VStack space={3} mt='5'>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input value={formik.values.email} onChangeText={formik.handleChange('email')} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              type='password'
            />
          </FormControl>
          <Button mt='2' backgroundColor='#0e806a' onPress={onSubmit}>
            Login
          </Button>
          <HStack mt='0' justifyContent='center'>
            <Text fontSize='sm' color='coolGray.600'>
              I'm a new user.
            </Text>
            <Link
              _text={{
                color: 'indigo.500',
                fontWeight: 'medium',
                fontSize: 'sm',
              }}
              onPress={() => {
                navigation.navigate('Register');
              }}
            >
              Register
            </Link>
          </HStack>
        </VStack>
      </Box>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 72,
  },
  logo: {
    transform: [{ scale: 0.5 }],
    alignSelf: 'center',
  },
});
