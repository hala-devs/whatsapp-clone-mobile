import { Platform } from "react-native";
import { API_URL } from "@env";

export function getReceiverMessages(messages, receiverId) {
  if (!Array.isArray(messages)) return [];
  return messages.filter(
    (message) =>
      message.senderId === receiverId || message.receiverId === receiverId
  );
}

export async function uploadImage(token, localUri) {
  try {
    const filename = localUri.split("/").pop() || "profile.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";
    const fileUri = Platform.OS === "android" ? localUri : localUri.replace("file://", "");

    const formData = new FormData();
    formData.append("profilePicture", {
      uri: fileUri,
      name: filename,
      type: type,
    });

    const authHeader = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const response = await fetch(`${API_URL}/user/profile-picture`, {
      method: "PUT",
      headers: {
        "Authorization": authHeader,
        "Accept": "application/json",
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || `Server Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
