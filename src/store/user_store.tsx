import { create } from 'zustand';

import { IUser } from '@/types/types';

export interface IUsersStore {
  users: IUser[];
  filteredUsers: IUser[];
  currentPage: number;
  loading: boolean;
  setUsers: (users: IUser[]) => void;
  setFilteredUsers: (users: IUser[]) => void;
  deleteUser: (userId: string) => void;
  setPage: (newPage: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<IUsersStore>((set) => ({
  users: [],
  filteredUsers: [],
  currentPage: 1,
  loading: false,
  setUsers: (users: IUser[]) =>
    set((state) => ({
      users: users,
      filteredUsers: users,
    })),
  setFilteredUsers: (users: IUser[]) =>
    set((state) => ({
      filteredUsers: users,
    })),
  deleteUser: (userId: string) =>
    set((state) => {
      const newUsers = state.users.filter((user: IUser) => user.id !== userId);
      const newFilteredUsers = state.filteredUsers.filter((user: IUser) => user.id !== userId);
      return { users: newUsers, filteredUsers: newFilteredUsers };
    }),
  setPage: (newPage: number) =>
    set((state) => {
      if (newPage < 1 || newPage > Math.ceil(state.filteredUsers.length / 5)) {
        return state;
      }
      return { currentPage: newPage };
    }),
  setLoading: (loading: boolean) =>
    set((state) => ({
      loading,
    })),
}));
