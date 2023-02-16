import { create } from "zustand";

import { IUser } from "@/types/types";

export interface IUsersStore {
  users: IUser[];
  filteredUsers: IUser[];
  setUsers: (users: IUser[]) => void;
  setFilteredUsers: (users: IUser[]) => void;
}

export const useUserStore = create<IUsersStore>((set) => ({
  users: [],
  filteredUsers: [],
  setUsers: (users: IUser[]) =>
    set((state) => ({
      users: users,
      filteredUsers: users,
    })),
  setFilteredUsers: (users: IUser[]) =>
    set((state) => ({
      filteredUsers: users,
    })),
}));
