import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserTypes {
  token: string;
  data: UserDataTypes;
}

export interface UserDataTypes {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  /**
   * @Types {UserTypes}
   * @description User data
   * @default { id: "", name: "", email: "" }
   */
  users: UserTypes;

  /**
   * @description Set user data
   * @param {UserTypes} users
   */
  setUsers: (users: UserTypes) => void;

  /**
   * @description Clear user data
   */
  clearUsers: () => void;

  /**
   * @description Set token data
   * @param {string} token
   */
  setToken: (token: string) => void;

  /**
   * @description Clear token data
   */
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      users: {
        token: "",
        data: {
          id: "",
          name: "",
          email: "",
        },
      },
      setUsers: (users) => set({ users }),
      clearUsers: () =>
        set({
          users: {
            token: "",
            data: {
              id: "",
              name: "",
              email: "",
            },
          },
        }),

      setToken: (token) =>
        set((state) => ({ users: { ...state.users, token } })),
      clearToken: () =>
        set((state) => ({ users: { ...state.users, token: "" } })),
    }),
    {
      name: "auth-storage", // Nama key di localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
