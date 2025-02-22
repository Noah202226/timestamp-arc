// Desc: Store for user data
import { create } from "zustand";

const userStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  userRecords: [],
  setUserRecords: (records) => set({ userRecords: records }),
}));

export default userStore;
