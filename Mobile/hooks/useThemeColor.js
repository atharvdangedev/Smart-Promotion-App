import { useColorScheme } from 'react-native';

const palette = {
  light: {
    text: '#226B8F',
    headingText: '#226B8F',
    subtext: '#888888',
    background: '#FFFFFF',
    btnBackground: '#FF5604',
    inputBg: '#E6F0F5',
    headerBg: '#226B8F',
    icon: '#FFFFFF',
    primaryAccent: '#A8E6CF',
    secondaryAccent: '#DCB2FF',
    tertiaryAccent: '#A0D9FF',
    success: '#A5D6A7',
    warning: '#FFD54F',
    danger: '#FF6B6B',
    border: '#E0E0E0',
    card: '#FFFFFF',
    orange: '#FF5604',
  },
  dark: {
    text: '#E0E0E0',
    headingText: '#FFFFFF',
    subtext: '#A0A0A0',
    background: '#17212B',
    btnBackground: '#FF5604',
    inputBg: '#E6F0F5',
    headerBg: '#232E3C',
    icon: '#FFFFFF',
    primaryAccent: '#7ED9B0',
    secondaryAccent: '#B88BFF',
    tertiaryAccent: '#7AC0E8',
    success: '#C8E6C9',
    warning: '#FFEB3B',
    danger: '#FF8A80',
    border: '#4A5568',
    card: '#3A506B',
    orange: '#FF5604',
  },
};

export default function useThemeColors() {
  const scheme = useColorScheme();
  return palette[scheme] || palette.light;
}
