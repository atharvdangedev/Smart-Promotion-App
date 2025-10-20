import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Linking } from 'react-native';
import useThemeColors from '../hooks/useThemeColor';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Header from '../components/Header';
import Toast from 'react-native-toast-message';
import Contacts from 'react-native-contacts';
import { requestPermission } from '../utils/handlePermissions';

export default function RequestReview({ navigation }) {
  const colors = useThemeColors();
  useEffect(() => {
    requestPermission('contacts');
  }, []);

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedName, setSelectedName] = useState('');
  const [selectedPhone, setSelectedPhone] = useState('');
  const [reviewLink, setReviewLink] = useState('https://tinyurl.com/mr3ve9mw');

  const fetchPhonebookContacts = async () => {
    try {
      setLoading(true);
      const phoneContacts = await Contacts.getAll();
      const formatted = phoneContacts
        .filter(c => c.phoneNumbers.length > 0)
        .map(c => ({
          id: c.recordID,
          name: c.displayName,
          contact_no: c.phoneNumbers[0].number.replace(/\s|\-/g, ''),
        }));
      setContacts(formatted);
      setModalVisible(true);
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Failed to load phone contacts' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContact = contact => {
    setSelectedName(contact.name);
    setSelectedPhone(contact.contact_no);
    setModalVisible(false);
  };

  const sendReviewRequest = () => {
    if (!selectedPhone || !reviewLink) {
      return Toast.show({
        type: 'error',
        text1: 'Missing info',
        text2: 'Please select a contact and enter review link',
      });
    }

    const message = `Hi ${selectedName || ''}, thank you for visiting us! Please take a moment to share your experience: ⭐ ${reviewLink}`;

    const formattedPhone = selectedPhone.startsWith('+91')
      ? selectedPhone
      : `+91${selectedPhone.replace(/\D/g, '')}`;

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp not installed');
    });
  };

  return (
    <SafeAreaWrapper
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <Header title="Request Review" />

      <View className="flex-1 mt-6 px-6">
        <Text
          className="text-2xl text-center font-semibold mb-6"
          style={{ color: colors.text }}
        >
          Send Review Request on WhatsApp
        </Text>

        <Text className="font-semibold mb-2" style={{ color: colors.text }}>
          Customer Name
        </Text>
        <TextInput
          placeholder="Customer Name"
          placeholderTextColor="gray"
          value={selectedName}
          onChangeText={setSelectedName}
          className="border border-gray-300 rounded-xl p-3 mb-3 text-black"
          style={{ backgroundColor: colors.inputBg }}
        />

        <Text className="font-semibold mb-2" style={{ color: colors.text }}>
          Customer Number
        </Text>
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="gray"
          keyboardType="phone-pad"
          value={selectedPhone}
          onChangeText={setSelectedPhone}
          className="border border-gray-300 rounded-xl p-3 mb-3 text-black"
          style={{ backgroundColor: colors.inputBg }}
        />

        <Text className="font-semibold mb-2" style={{ color: colors.text }}>
          Review Link
        </Text>
        <TextInput
          placeholder="Enter Review Link"
          placeholderTextColor="gray"
          value={reviewLink}
          onChangeText={setReviewLink}
          className="border border-gray-300 rounded-xl p-3 mb-3 text-black"
          style={{ backgroundColor: colors.inputBg }}
        />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ReviewContact', {
              onSelectContact: contact => {
                setSelectedName(contact.contact_name);
                setSelectedPhone(contact.contact_number);
              },
            })
          }
          className="p-4 my-2 rounded-2xl border"
          style={{ borderColor: colors.text }}
        >
          <Text
            className="text-center font-medium"
            style={{ color: colors.text }}
          >
            Choose from App Contacts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={fetchPhonebookContacts}
          className="p-4 my-2 rounded-2xl border"
          style={{ borderColor: colors.text }}
        >
          <Text
            className="text-center font-medium"
            style={{ color: colors.text }}
          >
            Choose from Phonebook
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={sendReviewRequest}
          className="p-4 my-3 rounded-2xl"
          style={{ backgroundColor: colors.orange }}
        >
          <Text className="text-white text-center font-medium">
            Send on WhatsApp
          </Text>
        </TouchableOpacity>

        <Text
          className="text-start font-thin my-2"
          style={{ color: colors.text }}
        >
          {' '}
          Note: Please allow all the permissions in settings before sending
          review request.
        </Text>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaWrapper
          className="flex-1"
          style={{ backgroundColor: colors.background }}
        >
          <View className="p-2" style={{ backgroundColor: colors.inputBg }}>
            <Text className="text-2xl text-center mt-4 mb-3 text-black font-semibold">
              Contacts from Phonebook{' '}
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.orange}
              className="mt-10"
            />
          ) : (
            <FlatList
              data={contacts}
              keyExtractor={item => item.id?.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectContact(item)}
                  className="p-4 border-b border-gray-300"
                >
                  <Text
                    className="text-lg font-medium"
                    style={{ color: colors.text }}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ color: colors.text, opacity: 0.7 }}>
                    {item.contact_no}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="p-4 m-4 rounded-2xl"
            style={{ backgroundColor: colors.orange }}
          >
            <Text className="text-white text-center font-medium">Close</Text>
          </TouchableOpacity>
        </SafeAreaWrapper>
      </Modal>
    </SafeAreaWrapper>
  );
}
