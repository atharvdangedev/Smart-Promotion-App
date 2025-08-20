import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            userId: null,
            rolename: null,
            profilePic: null,
            username: null,

            setAuth: (data = {}) => {
                set({
                    token: data?.token || null,
                    userId: data?.user?.id || null,
                    rolename: data?.user?.rolename || null,
                    profilePic: data?.user?.profile_pic || null,
                    username: data?.user?.first_name || null,
                });
            },

            logout: () => {
                set({
                    token: null,
                    userId: null,
                    rolename: null,
                    profilePic: null,
                    username: null,
                })
            },

            setProfilePic: (pic) => set({ profilePic: pic }),
            setUsername: (name) => set({ username: name }),

        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);