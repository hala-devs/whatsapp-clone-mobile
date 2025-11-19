import { View, Text } from 'react-native';
import { useRef } from 'react';
import { Button, Modal, FormControl, Input } from 'native-base';
import * as Yup from 'yup';
import { useStore } from '../libs/state';
import { useFormik } from 'formik';
import axios from '../libs/api';

export default function EditUserModal(props) {
  const { user, setUser, token } = useStore();

  const initialModalRef = useRef(null);
  const finalModalRef = useRef(null);

  // ✅ تحقق من وجود user قبل استخدامه
  if (!user) {
    return null; // أو رسالة تحميل
  }

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || '', // ✅ استخدم ?. للتحقق
      lastName: user?.lastName || '',   // ✅ استخدم ?. للتحقق
      status: user?.status || '',       // ✅ استخدم ?. للتحقق
    },
    validationSchema: Yup.object({
      firstName: Yup.string(),
      lastName: Yup.string(),
      status: Yup.string(),
    }),
    async onSubmit(values) {
      try {
        const response = await axios.put('/user', values, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ أضف Bearer
          },
        });
        setUser(response.data);
        props.closeModal();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },
  });

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

          <FormControl mt='3'>
            <FormControl.Label>Last Name</FormControl.Label>
            <Input
              value={formik.values.lastName}
              onChangeText={formik.handleChange('lastName')}
            />
          </FormControl>

          <FormControl mt='3'>
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
              bg='#0e806a'
              _hover={{ bg: 'green.700' }}
            >
              Cancel
            </Button>
            <Button
              onPress={formik.submitForm}
              bg='#0e806a'
              _hover={{ bg: 'green.700' }}
            >
              Save
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}