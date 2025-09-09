import notifee, { EventType } from '@notifee/react-native';
import { openWhatsApp, openSMS } from './Messaging';
import { fetchTemplate } from '../apis/TemplateApi';
import { vendorCallLog } from '../apis/ContactsApi';
import { useAuthStore } from '../store/useAuthStore';
import { useMonitoringStore } from '../store/useMonitoringStore';
import { saveRecentMessage } from '../apis/ProfileApi';

function getPrimaryTemplateForCall(call, templates) {
  return templates.find(
    t => t.template_type === call.type && t.is_primary === '1',
  );
}

export async function notificationBackgroundHandler({ type, detail }) {
  const { token, rolename } = useAuthStore.getState();
  if (!token) {
    if (detail.notification) {
      await notifee.cancelNotification(detail.notification.id);
    }
    return;
  }
  const { notification, pressAction } = detail;

  if (!notification || !pressAction) return;

  const callDataString = notification.data?.callData;
  if (!callDataString) return;

  const call = JSON.parse(callDataString);

  switch (type) {
    case EventType.ACTION_PRESS:
      switch (pressAction.id) {
        case 'no_client':
          useMonitoringStore.getState().addToBlacklist(call.number);
          await notifee.cancelNotification(notification.id);
          console.log(
            `Headless Task: User chose NO for client: ${call.number}. Added to blacklist.`,
          );
          break;

        case 'send_whatsapp':
        case 'send_sms':
          let templates = [];
          try {
            const data = await fetchTemplate('vendor');
            templates = data ?? [];
          } catch (e) {
            console.error('Failed to fetch templates:', e);
          }

          const template = getPrimaryTemplateForCall(call, templates);
          const message = template
            ? template.description
            : 'Hello! We recently had a call. How can I help you today?';

          if (template) {
            await vendorCallLog(call);
            const payload = {
              contact_no: call.number,
              message_sent: message,
              timestamp: call.timestamp,
            };
            await saveRecentMessage(rolename, payload);
          } else {
            console.log(
              `No matching primary template found for call type: ${call.type}, sending fallback message.`,
            );
          }

          if (pressAction.id === 'send_whatsapp') {
            await openWhatsApp(call.number, message);
          } else {
            await openSMS(call.number, message);
          }

          // Log that a message was sent to this number for the cooldown timer
          useMonitoringStore.getState().logSentMessage(call.number);

          await notifee.cancelNotification(notification.id);
          break;
      }
      return Promise.resolve();

    case EventType.PRESS:
      return Promise.resolve();

    default:
      return Promise.resolve();
  }
}
