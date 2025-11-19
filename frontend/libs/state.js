import { create } from "zustand";

export const useStore = create((set) => ({
  // المستخدم الحالي
  user: null,
  setUser: (user) => set({ user }),

  // توكن الدخول
  token: "",
  setToken: (token) => set({ token }),

  // قائمة الأصدقاء
  friends: [],
  setFriends: (friends) => set({ friends }),

  // اتصال الـ socket
  socket: null,
  setSocket: (socket) => set({ socket }),

  // الرسائل
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...(state.messages || []), message],
    })),

  // المستلم الحالي للمحادثة
  currentReceiver: null,
  setCurrentReceiver: (currentReceiver) => set({ currentReceiver }),

  // حالة الكتابة (typing)
  typing: false,
  setTyping: (typing) => set({ typing }),

  // حماية عند تعديل المستخدم أو تحديث الأصدقاء
  updateUser: (updatedUser) =>
    set((state) => ({
      user: state.user?._id === updatedUser._id ? updatedUser : state.user,
    })),

  addFriend: (newUser) =>
    set((state) => ({
      friends: state.friends
        ? { ...state.friends, [newUser._id]: newUser }
        : { [newUser._id]: newUser },
    })),
}));
