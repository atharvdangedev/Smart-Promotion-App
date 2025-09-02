/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import notifee from '@notifee/react-native';
import { name as appName } from './app.json';
import './global.css';

import { notificationBackgroundHandler } from './utils/notificationHandler';

// (DO NOT MESS WITH THIS FILE)

notifee.onBackgroundEvent(notificationBackgroundHandler);

AppRegistry.registerComponent(appName, () => App);
