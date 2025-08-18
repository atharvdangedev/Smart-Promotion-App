
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
            contactPopup: null,

            setAuth: (data = {}) => {
                set({
                    token: data?.token || null,
                    userId: data?.user?.id || null,
                    rolename: data?.user?.rolename || null,
                    profilePic: data?.user?.profile_pic || null,
                    username: data?.user?.first_name || null,
                    contactPopup: false,
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

        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)