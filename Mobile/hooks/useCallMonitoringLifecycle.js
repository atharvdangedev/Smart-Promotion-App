import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useMonitoringStore } from '../store/useMonitoringStore';
import { usePermissions } from './usePermissions';

export function useCallMonitoringLifecycle() {
  const appState = useRef(AppState.currentState);

  const startMonitoringAction = useMonitoringStore(
    state => state.startMonitoring,
  );
  const stopMonitoringAction = useMonitoringStore(
    state => state.stopMonitoring,
  );

  const { request: requestCorePermissions } = usePermissions();

  useEffect(() => {
    const handleAppChange = nextState => {
      const prev = appState.current;
      appState.current = nextState;

      if (prev.match(/inactive|background/) && nextState === 'active') {
        console.log('[CallMonitor] App active. Starting monitoring.');
        startMonitoringAction(requestCorePermissions);
      }
    };

    console.log('[CallMonitor] Initializing. Starting monitoring.');
    startMonitoringAction(requestCorePermissions);

    const sub = AppState.addEventListener('change', handleAppChange);

    return () => {
      sub.remove();
      stopMonitoringAction();
      console.log('[CallMonitor] Monitoring stopped on cleanup.');
    };
  }, [startMonitoringAction, stopMonitoringAction, requestCorePermissions]);
}
