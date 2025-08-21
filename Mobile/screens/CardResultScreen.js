import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import { Phone } from 'lucide-react-native';
import Contacts from 'react-native-contacts';
import Toast from 'react-native-toast-message';
import SubHeader from '../components/SubHeader';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

export default function CardResultScreen({ route }) {
  const { fullText, numbers, name } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const [contactName, setContactName] = useState(name);
  const [selectedNumber, setSelectedNumber] = useState(numbers[0]);

  const saveContact = async () => {
    if (!selectedNumber || !contactName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation',
        text2: 'Name and number are required',
        position: 'top',
      });
      return;
    }

    const contact = {
      givenName: contactName.trim(),
      phoneNumbers: [selectedNumber],
    };

    try {
      await Contacts.addContact(contact);
      Toast.show({
        type: 'success',
        text1: 'Saved!',
        text2: `Contact "${contactName}" saved`,
        position: 'top',
      });
      setIsSaved(true);
    } catch (error) {
      console.error('Save Contact Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: 'Failed to save contact',
        position: 'top',
      });
    }
  };

  return (
    <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background p-4">
      <SubHeader title="Scan Result" />
      <Text className="text-light-text dark:text-dark-text text-lg font-semibold mt-6">
        Scanned Text:
      </Text>
      <View className="bg-zinc-800 p-4 rounded-2xl mt-2 max-h-60">
        <ScrollView>
          <Text className="text-white whitespace-pre-line">{fullText}</Text>
        </ScrollView>
      </View>

      <Text className="text-light-text dark:text-dark-text text-lg font-semibold mt-4">
        Contact Name
      </Text>
      <View className="bg-zinc-800 rounded-xl px-4 py-1 mb-4">
        <TextInput
          placeholder="Enter contact name"
          placeholderTextColor="#aaa"
          className="text-white text-base"
          value={contactName}
          onChangeText={setContactName}
        />
      </View>

      <Text className="text-light-text dark:text-dark-text text-lg font-semibold mb-2">
        Select Number
      </Text>

      {numbers.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => setSelectedNumber(item)}
          className={`flex-row items-center px-4 py-3 rounded-xl mb-2 ${
            selectedNumber?.number === item.number
              ? 'bg-sky-600'
              : 'bg-zinc-700'
          }`}
        >
          <Phone color="white" size={18} className="mr-2" />
          <Text className="text-white text-base">{item.number}</Text>
        </Pressable>
      ))}

      <Text className="text-light-text dark:text-dark-text my-3">
        Note : Only valid Indian (+91) numbers can be saved
      </Text>
      <TouchableOpacity
        onPress={saveContact}
        className={`rounded-2xl px-4 py-3 flex-row items-center justify-center mb-4 w-full ${isSaved ? 'bg-zinc-600' : 'bg-[#A8E6CF]'}`}
        disabled={isSaved}
      >
        <Text
          className={`text-center ${isSaved ? `text-[#E0E0E0]` : `text-[#333333]`} text-base font-medium`}
        >
          {isSaved ? 'Contact Saved' : 'Save Contact'}
        </Text>
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
}
