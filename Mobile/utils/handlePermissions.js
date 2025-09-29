import { Linking, Platform } from "react-native";
import { PERMISSIONS, check, request, RESULTS } from "react-native-permissions";

const mapPermissions = {
  phone: PERMISSIONS.ANDROID.READ_PHONE_STATE,
  callLogs: PERMISSIONS.ANDROID.READ_CALL_LOG,
  contacts: PERMISSIONS.ANDROID.READ_CONTACTS,
  contactsWrite: PERMISSIONS.ANDROID.WRITE_CONTACTS,
  camera: PERMISSIONS.ANDROID.CAMERA,
  notifications:
    Platform.Version >= 33 ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS : undefined,
};

export const requestPermission = async (type) => {
  const permission = mapPermissions[type];
  if (!permission) return false;

  try {
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  } catch (err) {
    console.warn("Permission request error:", type, err);
    return false;
  }
};

export const checkPermission = async (type) => {
  const permission = mapPermissions[type];
  if (!permission) return false;

  try {
    const result = await check(permission);
    return result === RESULTS.GRANTED;
  } catch (err) {
    console.warn("Permission check error:", type, err);
    return false;
  }
};

export const checkAllPermissions = async () => {
  const statuses = {};
  for (const key in mapPermissions) {
    if (!mapPermissions[key]) {
      statuses[key] = true; 
      continue;
    }
    statuses[key] = await checkPermission(key);
  }
  return statuses;
};

export const openAppSettings = () => {
  Linking.openSettings().catch(() => {
    console.warn("Unable to open app settings");
  });
};