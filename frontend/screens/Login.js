import React from 'react';
import { Platform } from 'react-native';
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
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'native-base';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import axios from '../libs/api';
import { useStore } from '../libs/state';

export default function Login() {
  const navigation = useNavigation();
  const { setUser, setToken } = useStore();

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
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post('/user/login', {
          email: values.email,
          password: values.password,
        });

        if (response.data.errors) {
          Toast.show({
            title: response.data.errors,
            status: 'error',
            backgroundColor: 'red.500',
            placement: 'top',
          });
        } else {
          setUser(response.data.user);
          const token = response.data.token.startsWith('Bearer ')
            ? response.data.token
            : `Bearer ${response.data.token}`;
          setToken(token);

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
          backgroundColor: 'red.500',
          placement: 'top',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      bg="coolGray.50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Box flex={1} px="6" justifyContent="center" alignItems="center" py="16">
          <Box w="100%" maxW="360px" bg="white" p="8" borderRadius="24" shadow="3">
            
            <Box
              alignSelf="center"
              bg="emerald.100"
              p="4"
              borderRadius="20"
              mb="8"
              shadow="1"
            >
              <Image
                source={require('../assets/logo.png')}
                alt="App Logo"
                size="60px"
                resizeMode="contain"
              />
            </Box>

            <Heading size="xl" fontWeight="800" color="coolGray.900" textAlign="center">
              Welcome Back
            </Heading>
            <Text mt="1.5" color="coolGray.600" fontSize="md" fontWeight="medium" textAlign="center">
              Sign in to continue to your account
            </Text>

            <VStack space={5} mt="10">
              <FormControl isInvalid={Boolean(formik.touched.email && formik.errors.email)}>
                <FormControl.Label _text={{ fontWeight: '700', color: 'coolGray.800', fontSize: 'sm' }}>
                  Email Address
                </FormControl.Label>
                <Input
                  size="lg"
                  borderRadius="12"
                  py="3.5"
                  px="4"
                  placeholder="your.email@example.com"
                  value={formik.values.email}
                  onChangeText={formik.handleChange('email')}
                  onBlur={formik.handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  bg="coolGray.50"
                  borderWidth="1.5"
                  borderColor="coolGray.200"
                  _focus={{ borderColor: '#0e806a', bg: 'white', shadow: '1' }}
                />
                <FormControl.ErrorMessage _text={{ fontSize: 'xs', fontWeight: '600' }}>
                  {formik.errors.email}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(formik.touched.password && formik.errors.password)}>
                <FormControl.Label _text={{ fontWeight: '700', color: 'coolGray.800', fontSize: 'sm' }}>
                  Password
                </FormControl.Label>
                <Input
                  size="lg"
                  borderRadius="12"
                  py="3.5"
                  px="4"
                  type="password"
                  placeholder="••••••••••••"
                  value={formik.values.password}
                  onChangeText={formik.handleChange('password')}
                  onBlur={formik.handleBlur('password')}
                  bg="coolGray.50"
                  borderWidth="1.5"
                  borderColor="coolGray.200"
                  _focus={{ borderColor: '#0e806a', bg: 'white', shadow: '1' }}
                />
                <FormControl.ErrorMessage _text={{ fontSize: 'xs', fontWeight: '600' }}>
                  {formik.errors.password}
                </FormControl.ErrorMessage>
              </FormControl>

              <Button
                mt="4"
                py="4"
                borderRadius="14"
                backgroundColor="#0e806a"
                _text={{ fontWeight: '700', fontSize: 'md' }}
                _pressed={{ bg: '#0b6856' }}
                shadow="2"
                isLoading={formik.isSubmitting}
                onPress={formik.handleSubmit}
              >
                Sign In
              </Button>

              <HStack mt="5" justifyContent="center" alignItems="center" space={1}>
                <Text fontSize="sm" color="coolGray.600" fontWeight="medium">
                  New user?
                </Text>
                <Link
                  _text={{
                    color: '#0e806a',
                    fontWeight: '700',
                    fontSize: 'sm',
                  }}
                  onPress={() => navigation.navigate('Register')}
                  isUnderlined={false}
                >
                  Create an account
                </Link>
              </HStack>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}