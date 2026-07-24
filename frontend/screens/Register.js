import React from 'react';
import { Platform } from 'react-native';
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
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'native-base';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import axios from '../libs/api';
import { useStore } from '../libs/state';

export default function Register() {
  const { setUser, setToken } = useStore();
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      status: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      status: Yup.string().required('Status is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post('/user/register', {
          email: values.email,
          password: values.password,
          lastName: values.lastName,
          firstName: values.firstName,
          status: values.status,
        });

        if (response.data.errors) {
          Toast.show({
            title: typeof response.data.errors === 'string' 
              ? response.data.errors 
              : JSON.stringify(response.data.errors),
            status: 'error',
            backgroundColor: 'red.500',
            placement: 'top',
          });
        } else {
          Toast.show({
            title: response.data.message || 'Registration successful',
            status: 'success',
            backgroundColor: '#0e806a',
            placement: 'top',
          });

          setUser(response.data.user);
          const token = response.data.token?.startsWith('Bearer ')
            ? response.data.token
            : `Bearer ${response.data.token}`;
          setToken(token);

          navigation.navigate('Home');
        }
      } catch (error) {
        // طباعة التفاصيل في Terminal لتحديد السبب بدقة
        console.log('=== REGISTER ERROR DETAILS ===');
        console.log('Status Code:', error.response?.status);
        console.log('Server Data:', error.response?.data);
        console.log('Error Message:', error.message);

        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Registration failed';

        Toast.show({
          title: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
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
        <Box flex={1} px="6" justifyContent="center" alignItems="center" py="12">
          <Box w="100%" maxW="380px" bg="white" p="8" borderRadius="24" shadow="3">
            <Box
              alignSelf="center"
              bg="emerald.100"
              p="3.5"
              borderRadius="18"
              mb="6"
              shadow="1"
            >
              <Image
                source={require('../assets/logo.png')}
                alt="App Logo"
                size="50px"
                resizeMode="contain"
              />
            </Box>

            <Heading size="xl" fontWeight="800" color="coolGray.900" textAlign="center">
              Join Us
            </Heading>
            <Text mt="1.5" color="coolGray.600" fontSize="md" fontWeight="medium" textAlign="center">
              Create your account to get started
            </Text>

            <VStack space={4} mt="9">
              <HStack space={3}>
                <FormControl
                  flex={1}
                  isInvalid={Boolean(formik.touched.firstName && formik.errors.firstName)}
                >
                  <FormControl.Label _text={{ fontWeight: '700', color: 'coolGray.800', fontSize: 'sm' }}>
                    First Name
                  </FormControl.Label>
                  <Input
                    size="md"
                    borderRadius="12"
                    py="3"
                    px="4"
                    placeholder="John"
                    value={formik.values.firstName}
                    onChangeText={formik.handleChange('firstName')}
                    onBlur={formik.handleBlur('firstName')}
                    bg="coolGray.50"
                    borderWidth="1.5"
                    borderColor="coolGray.200"
                    _focus={{ borderColor: '#0e806a', bg: 'white', shadow: '1' }}
                  />
                  <FormControl.ErrorMessage _text={{ fontSize: 'xs', fontWeight: '600' }}>
                    {formik.errors.firstName}
                  </FormControl.ErrorMessage>
                </FormControl>

                <FormControl
                  flex={1}
                  isInvalid={Boolean(formik.touched.lastName && formik.errors.lastName)}
                >
                  <FormControl.Label _text={{ fontWeight: '700', color: 'coolGray.800', fontSize: 'sm' }}>
                    Last Name
                  </FormControl.Label>
                  <Input
                    size="md"
                    borderRadius="12"
                    py="3"
                    px="4"
                    placeholder="Doe"
                    value={formik.values.lastName}
                    onChangeText={formik.handleChange('lastName')}
                    onBlur={formik.handleBlur('lastName')}
                    bg="coolGray.50"
                    borderWidth="1.5"
                    borderColor="coolGray.200"
                    _focus={{ borderColor: '#0e806a', bg: 'white', shadow: '1' }}
                  />
                  <FormControl.ErrorMessage _text={{ fontSize: 'xs', fontWeight: '600' }}>
                    {formik.errors.lastName}
                  </FormControl.ErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={Boolean(formik.touched.email && formik.errors.email)}>
                <FormControl.Label _text={{ fontWeight: '700', color: 'coolGray.800', fontSize: 'sm' }}>
                  Email Address
                </FormControl.Label>
                <Input
                  size="md"
                  borderRadius="12"
                  py="3"
                  px="4"
                  placeholder="john.doe@example.com"
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
                  size="md"
                  borderRadius="12"
                  py="3"
                  px="4"
                  type="password"
                  placeholder="Minimum 8 characters"
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

              <FormControl isInvalid={Boolean(formik.touched.status && formik.errors.status)}>
                <FormControl.Label _text={{ fontWeight: '700', color: 'coolGray.800', fontSize: 'sm' }}>
                  Status / Role
                </FormControl.Label>
                <Input
                  size="md"
                  borderRadius="12"
                  py="3"
                  px="4"
                  placeholder="e.g., Student, Developer"
                  value={formik.values.status}
                  onChangeText={formik.handleChange('status')}
                  onBlur={formik.handleBlur('status')}
                  bg="coolGray.50"
                  borderWidth="1.5"
                  borderColor="coolGray.200"
                  _focus={{ borderColor: '#0e806a', bg: 'white', shadow: '1' }}
                />
                <FormControl.ErrorMessage _text={{ fontSize: 'xs', fontWeight: '600' }}>
                  {formik.errors.status}
                </FormControl.ErrorMessage>
              </FormControl>

              <Button
                mt="5"
                py="4"
                borderRadius="14"
                backgroundColor="#0e806a"
                _text={{ fontWeight: '700', fontSize: 'md' }}
                _pressed={{ bg: '#0b6856' }}
                shadow="2"
                isLoading={formik.isSubmitting}
                onPress={formik.handleSubmit}
              >
                Create Account
              </Button>

              <HStack mt="4" justifyContent="center" alignItems="center" space={1}>
                <Text fontSize="sm" color="coolGray.600" fontWeight="medium">
                  Already have an account?
                </Text>
                <Link
                  _text={{
                    color: '#0e806a',
                    fontWeight: '700',
                    fontSize: 'sm',
                  }}
                  onPress={() => navigation.navigate('Login')}
                  isUnderlined={false}
                >
                  Sign In
                </Link>
              </HStack>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}