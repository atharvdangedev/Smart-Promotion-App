import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Contacts from 'react-native-contacts';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SubHeader from '../components/SubHeader';
import { useMutation, useQuery } from '@tanstack/react-query';
import { importContacts } from '../apis/ContactsApi';
import { useAuthStore } from '../store/useAuthStore';
import { handleApiError } from '../utils/handleApiError';
import { handleApiSuccess } from '../utils/handleApiSuccess';

export default function SelectContacts() {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const user = useAuthStore(state => state.rolename);

  useEffect(() => {
    getContacts();
  }, []);

  const submitContacts = useMutation({
    mutationFn: ({selectedContacts, user}) =>
      importContacts(selectedContacts, user),
    onSuccess: data => {
      handleApiSuccess(data.message, 'Contacts Updated');
    },
    onError: error => {
      handleApiError(error.message, 'updating Contacts');
    },
  });

  const getContacts = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Contacts permission denied');
        return;
      }
    }
    Contacts.getAll()
      .then(contactsList => {
        const sortedContacts = contactsList.sort((a, b) =>
          a.displayName.localeCompare(b.displayName),
        );
        setContacts(sortedContacts);
      })
      .catch(err => console.error(err));
  };

  const toggleSelect = contact => {
    const phoneNumber = contact.phoneNumbers?.[0]?.number || 'No number';

    const exists = selectedContacts.find(
      c => typeof c === 'object' && c.recordID === contact.recordID,
    );

    if (exists) {
      setSelectedContacts(prev =>
        prev.filter(c => c.recordID !== contact.recordID),
      );
    } else {
      setSelectedContacts(prev => [
        ...prev,
        {
          recordID: contact.recordID,
          name: contact.displayName,
          number: phoneNumber,
        },
      ]);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedContacts.some(c => c.recordID === item.recordID);
    const phoneNumber = item.phoneNumbers?.[0]?.number || 'No number';

    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item)}
        className={`flex-row justify-between items-center p-4 border-b border-gray-300 ${
          isSelected ? 'bg-sky-100' : 'bg-white'
        }`}
      >
        <View>
          <Text className="text-black">{item.displayName}</Text>
          <Text className="text-gray-500 text-sm">{phoneNumber}</Text>
        </View>
        {isSelected && <Text className="text-sky-600 font-bold">✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaWrapper className="bg-light-background dark:bg-dark-background">
      <SubHeader title="Contacts selection" />
      <View className="flex-1 px-4">
        <View className="flex-1 rounded-xl p-2">
          <View className="p-4 bg-light-card dark:bg-dark-card rounded-xl ">
            <Text className="text-light-text dark:text-dark-text text-lg text-center font-bold">
              Select Contacts To Add
            </Text>
          </View>

          <FlatList
            data={contacts}
            keyExtractor={item => item.recordID}
            renderItem={renderItem}
          />

          <TouchableOpacity
            onPress={() => submitContacts.mutate({selectedContacts, user})}
            // onPress={() => console.log(selectedContacts)}
            className="m-4 bg-sky-600 p-4 rounded-xl"
          >
            <Text className="text-center text-white font-bold">
              Done ({selectedContacts.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
