import {
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
} from 'lucide-react-native';

export const callTypeColors = {
  missed: '#f87171',
  incoming: '#4ade80',
  outgoing: '#60a5fa',
  rejected: '#a78bfa',
  default: '#0284c7',
};

export const businessTypes = [
  { value: 'private-limited', label: 'Private Limited' },
  { value: 'limited', label: 'Limited' },
  { value: 'llp', label: 'LLP' },
  { value: 'proprietor', label: 'Proprietor' },
];

export const getCallIcon = type => {
  if (!type) return null;
  switch (type.toLowerCase().trim()) {
    case 'missed':
      return <PhoneMissed size={20} color="#f87171" />;
    case 'incoming':
      return <PhoneIncoming size={20} color="#34d399" />;
    case 'outgoing':
      return <PhoneOutgoing size={20} color="#60a5fa" />;
    case 'rejected':
      return <PhoneOff size={20} color="#a855f7" />;
    default:
      return null;
  }
};

export const callTypes = [
  'Incoming',
  'Outgoing',
  'Missed',
  'Rejected',
  'Review',
];
