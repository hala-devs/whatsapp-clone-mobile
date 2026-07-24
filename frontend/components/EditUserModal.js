import React, { useRef } from 'react';
import { Button, Modal, FormControl, Input } from 'native-base';
import * as Yup from 'yup';
import { useStore } from '../libs/state';
import { useFormik } from 'formik';
import axios from '../libs/api';

export default function EditUserModal(props) {
  const { user, setUser, token } = useStore();

  const initialModalRef = useRef(null);
  const finalModalRef = useRef(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      status: user?.status || '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string(),
      lastName: Yup.string(),
      status: Yup.string(),
    }),
    async onSubmit(values) {
      try {
        const authHeader = token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
        const response = await axios.put('/user', values, {
          headers: {
            Authorization: authHeader,
          },
        });
        setUser(response.data);
        props.closeModal();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },
  });

  if (!user) {
    return null;
  }

  return (
    <Modal
      isOpen={props.modalVisible}
      onClose={props.closeModal}
      initialFocusRef={initialModalRef}
      finalFocusRef={finalModalRef}
      avoidKeyboard
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>First Name</FormControl.Label>
            <Input
              ref={initialModalRef}
              value={formik.values.firstName}
              onChangeText={formik.handleChange('firstName')}
            />
          </FormControl>

          <FormControl mt="3">
            <FormControl.Label>Last Name</FormControl.Label>
            <Input
              value={formik.values.lastName}
              onChangeText={formik.handleChange('lastName')}
            />
          </FormControl>

          <FormControl mt="3">
            <FormControl.Label>Status</FormControl.Label>
            <Input
              value={formik.values.status}
              onChangeText={formik.handleChange('status')}
            />
          </FormControl>
        </Modal.Body>

        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              onPress={props.closeModal}
              variant="ghost"
              colorScheme="coolGray"
            >
              Cancel
            </Button>
            <Button
              onPress={formik.submitForm}
              isLoading={formik.isSubmitting}
              bg="#0e806a"
              _pressed={{ bg: '#075e54' }}
            >
              Save
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}