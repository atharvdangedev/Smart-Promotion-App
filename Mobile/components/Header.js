import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { API_PROFILE } from '@env';
import { Menu, User } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';

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

  return (
    <View className="flex-row justify-between items-center bg-light-background dark:bg-dark-headerBg pt-8 p-4 mb-6">
      {/* Drawer button */}
      <TouchableOpacity
        className="pl-2"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Menu size={26} color="white" />
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
