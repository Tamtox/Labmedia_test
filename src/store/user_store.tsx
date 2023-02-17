import { create } from 'zustand';

import { IUser } from '@/types/types';

export interface IUsersStore {
  users: IUser[];
  filteredUsers: IUser[];
  currentPage: number;
  setUsers: (users: IUser[]) => void;
  setFilteredUsers: (users: IUser[]) => void;
  deleteUser: (userId: string) => void;
}

export const useUserStore = create<IUsersStore>((set) => ({
  users: [],
  filteredUsers: [],
  currentPage: 1,
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
      return { users: newUsers, filteredUsers: newUsers };
    }),
}));
