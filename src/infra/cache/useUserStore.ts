import { create } from 'zustand';
import { UserModel } from '../../domain/user/UserModel';
import { ID } from '../../domain/ID';

interface UserState {
  users: Record<string, UserModel>;
  updateUser: (user: UserModel) => void;
  removeUser: (id: ID<UserModel>) => void;
  getUser: (id: ID<UserModel>) => UserModel | undefined;
  getAllUsers: () => UserModel[];
}

export const useUserStore = create<UserState>((set, get) => ({
  users: {},
  updateUser: (user) =>
    set((state) => ({
      users: {
        ...state.users,
        [user.id]: user,
      },
    })),
  removeUser: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.users;
      return { users: rest };
    }),
  getUser: (id) => get().users[id],
  getAllUsers: () => Object.values(get().users),
}));
