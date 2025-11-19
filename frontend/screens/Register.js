import { View, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Toast,
} from "native-base";
import React from 'react';
import { useFormik } from 'formik';
import axios from '../libs/api';
import * as Yup from 'yup';
import { useStore } from '../libs/state';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const { setUser, setToken } = useStore();
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      lastName: '',
      firstName: '',
      status: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Email is required').email('Invalid Email'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password size must be at least 8'),
      lastName: Yup.string().required('lastName is required'),
      firstName: Yup.string().required('firstName is required'),
      status: Yup.string().required('status is required'),
    }),
  });

  async function onSubmit() {
    const errors = Object.values(formik.errors);
    if (errors.length > 0) {
      Toast.show({
        title: errors.join('\n'),
        status: 'error',
        backgroundColor: '#ff5252',
        placement: 'top'
      });
    } else {
      try {
        const response = await axios.post('/user/register', {
          email: formik.values.email,
          password: formik.values.password,
          lastName: formik.values.lastName,
          firstName: formik.values.firstName,
          status: formik.values.status,
        });

        console.log(response);

        if (response.data.errors) {
          Toast.show({
            title: response.data.errors,
            status: 'error',
            backgroundColor: '#ff5252',
            placement: 'top'
          });
        } else {
          Toast.show({
            title: response.data.message,
            status: 'success',
            backgroundColor: '#0e806a',
            placement: 'top'
          });

          setUser(response.data.user);
          setToken(response.data.token);

          navigation.navigate("Home");
        }
      } catch (error) {
        Toast.show({
          title: 'Registration failed. Please try again.',
          status: 'error',
          backgroundColor: '#ff5252',
          placement: 'top'
        });
        console.error('Registration error:', error);
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

        <Heading mt='1' fontWeight='medium' color='coolGray.600' size='xs'>
          Register to continue!
        </Heading>

        <VStack space={3} mt='5'>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input 
              value={formik.values.email} 
              onChangeText={formik.handleChange('email')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>First Name</FormControl.Label>
            <Input 
              value={formik.values.firstName} 
              onChangeText={formik.handleChange('firstName')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Last Name</FormControl.Label>
            <Input 
              value={formik.values.lastName} 
              onChangeText={formik.handleChange('lastName')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input 
              value={formik.values.password} 
              onChangeText={formik.handleChange('password')}
              type="password"
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Status</FormControl.Label>
            <Input 
              value={formik.values.status} 
              onChangeText={formik.handleChange('status')}
            />
          </FormControl>

          <Button mt='2' backgroundColor='#0e806a' onPress={onSubmit}>
            Register
          </Button>

          <HStack mt='6' justifyContent='center'>
            <Text fontSize='sm' color='coolGray.600'>
              Already have an account?
            </Text>
            <Link 
              _text={{
                color: 'indigo.500',
                fontWeight: 'medium',
                fontSize: 'sm'
              }} 
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              Login
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