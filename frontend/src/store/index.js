import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  group: null,
  setUser: (user) => set({ user }),
  setGroup: (group) => set({ group }),
}));