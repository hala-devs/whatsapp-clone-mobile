import * as FileSystem from 'expo-file-system/legacy';
import {API_URL} from '@env';

export function getReceiverMessages(messages, receiverId) {
    return messages.filter(
      (message) =>
        message.senderId === receiverId || message.receiverId === receiverId
    );
  }

export async function uploadImage(token, localUri) {
  const response = await FileSystem.uploadAsync(API_URL + '/user/profile-picture', localUri, {
    headers: {
      Authorization: token,
    },
    httpMethod: 'PUT',
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    fieldName: 'profilePicture',
    mimeType: 'image/jpeg',
  });

  return response;
}