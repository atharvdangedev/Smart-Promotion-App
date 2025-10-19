import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { API_PROFILE } from '@env';
import { Menu, User, ArrowLeft } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import useThemeColors from '../hooks/useThemeColor';

export default function Header({ title = 'SmartPromotions' }) {
  const navigation = useNavigation();
  const theme = useColorScheme();

  const profile_pic = useAuthStore(state => state.profilePic);

  let sidebarcolor = '';
  if (theme === 'light') {
    sidebarcolor = '#333333';
  } else {
    sidebarcolor = '#E0E0E0';
  }
  const colors = useThemeColors();

  // Check if we're in a drawer navigator context
  const state = navigation.getState();
  const isInDrawer = state.type === 'drawer';

  const handleLeftButtonPress = () => {
    if (isInDrawer) {
      navigation.dispatch(DrawerActions.openDrawer());
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      className="flex-row justify-between items-center py-5 p-4 mb-6"
      style={{ backgroundColor: colors.headerBg }}
    >
      {/* Navigation button - Drawer or Back */}
      <TouchableOpacity className="pl-2" onPress={handleLeftButtonPress}>
        {isInDrawer ? (
          <Menu size={26} color="white" />
        ) : (
          <ArrowLeft size={26} color="white" />
        )}
      </TouchableOpacity>

      {/* App Title */}
      <Text className="text-2xl font-extrabold text-white">{title}</Text>

      {/* Profile icon */}
      {profile_pic ? (
        <TouchableOpacity
          className="border border-gray-700 rounded-full mr-2"
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Image
            source={{ uri: `${API_PROFILE}/${profile_pic}` }}
            className="w-8 h-8 rounded-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="border border-gray-700 rounded-full p-1"
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <User size={24} color={sidebarcolor} />
        </TouchableOpacity>
      )}
    </View>
  );
}
