import { useState, useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

// (DO NOT MESS WITH THIS FILE)

export function usePermissions() {
  const [status, setStatus] = useState('pending');

  const permissions = [
    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
  ];

  if (Number(Platform.Version) >= 33) {
    permissions.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }

  useEffect(() => {
    (async () => {
      try {
        const results = await Promise.all(
          permissions.map(p => PermissionsAndroid.check(p)),
        );
        const granted = results.every(Boolean);
        setStatus(granted ? 'granted' : 'denied');
      } catch (err) {
        console.error('Permission check failed:', err);
        setStatus('denied');
      }
    })();
  }, []);

  const request = useCallback(async () => {
    try {
      const result = await PermissionsAndroid.requestMultiple(permissions);
      const denied = Object.entries(result)
        .filter(([_, v]) => v !== PermissionsAndroid.RESULTS.GRANTED)
        .map(([k]) => k);

      if (denied.length === 0) {
        setStatus('granted');
        return true;
      }

      setStatus('denied');
      console.warn('Missing permissions:', denied);
      return false;
    } catch (err) {
      setStatus('denied');
      console.error('Permission request error:', err);
      return false;
    }
  }, []);

  return { status, request };
}
