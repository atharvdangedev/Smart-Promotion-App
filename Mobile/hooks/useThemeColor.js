import { useColorScheme } from 'react-native';

const palette = {
  light: {
    text: '#333333',
    subtext: '#888888',
    background: '#FDFDFD',
    icon: '#333333',
    primaryAccent: '#A8E6CF',
    secondaryAccent: '#DCB2FF',
    tertiaryAccent: '#A0D9FF',
    success: '#A5D6A7',
    warning: '#FFD54F',
    danger: '#FF6B6B',
    border: '#E0E0E0',
    card: '#FFFFFF',
  },
  dark: {
    text: '#E0E0E0',
    subtext: '#A0A0A0',
    background: '#17212b',
    icon: '#F1F5F9',
    primaryAccent: '#7ED9B0',
    secondaryAccent: '#B88BFF',
    tertiaryAccent: '#7AC0E8',
    success: '#C8E6C9',
    warning: '#FFEB3B',
    danger: '#FF8A80',
    border: '#4A5568',
    card: '#3A506B',
  },
};

export default function useThemeColors() {
  const scheme = useColorScheme();
  return palette[scheme] || palette.light;
}
