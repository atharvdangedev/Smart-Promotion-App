import { create } from "zustand";

export const usePermissionStore = create((set) => ({
  permissions: {
    phone: false,
    callLogs: false,
    contacts: false,
    camera: false,
    notifications: false,
  },
  setPermission: (name, value) =>
    set((state) => ({
      permissions: { ...state.permissions, [name]: value },
    })),
}));
