import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import { Mail, Phone } from 'lucide-react-native';
import Contacts from 'react-native-contacts';
// import Toast from 'react-native-toast-message';
import SubHeader from '../components/SubHeader';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Toast from 'react-native-toast-message';
import useThemeColors from '../hooks/useThemeColor';
// import { useMutation } from '@tanstack/react-query';
// import { addContact } from '../apis/addContactApi';
import { handleApiError } from '../utils/handleApiError';
import { requestPermission } from '../utils/handlePermissions';

export default function CardResultScreen({ route }) {
  const { fullText, numbers, name, emails, address } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const [contactName, setContactName] = useState(name);
  const [selectedNumber, setSelectedNumber] = useState(numbers[0]);

  const [emailList, setEmailList] = useState(
    Array.isArray(emails) ? emails : emails ? [emails] : []
  );
  const [selectedEmail, setSelectedEmail] = useState(emailList[0] || '');
  const [contactAddress, setContactAddress] = useState(address || '');


  const colors = useThemeColors();

  useEffect(()=>{
      requestPermission("contacts");
    },[]);

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
      emailAddresses: selectedEmail
        ? [{ label: 'work', email: String(selectedEmail) }]
        : [],
      postalAddresses: contactAddress
        ? [
          {
            label: 'home',
            formattedAddress: String(contactAddress),
            street: String(contactAddress),
            city: '',
            state: '',
            postCode: '',
            country: '',
          },
        ]
        : [],
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
    <SafeAreaWrapper className="flex-1" style={{ backgroundColor: colors.background }}>
      <SubHeader title="Scan Result" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='p-4'>
          <Text className="text-lg font-semibold mt-4" style={{ color: colors.text }}>
            Scanned Text:
          </Text>
          <View className="p-4 rounded-2xl mt-2 max-h-60" style={{ backgroundColor: colors.inputBg }}>
            <ScrollView>
              <Text className="text-black whitespace-pre-line">{fullText}</Text>
            </ScrollView>
          </View>

          <Text className="text-lg font-semibold mt-4" style={{ color: colors.text }}>
            Contact Name
          </Text>
          <View className="rounded-xl px-4 py-0 mb-4" style={{ backgroundColor: colors.inputBg }}>
            <TextInput
              placeholder="Enter contact name"
              placeholderTextColor="black"
              className="text-black text-base"
              value={contactName}
              onChangeText={setContactName}
            />
          </View>

          <Text className=" text-lg font-semibold mb-2" style={{ color: colors.text }}>
            Select Number
          </Text>

          {numbers.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedNumber(item)}
              className={`flex-row items-center px-4 py-3 rounded-xl mb-2 ${selectedNumber?.number === item.number
                ? 'bg-sky-600'
                : 'bg-zinc-700'
                }`}
            >
              <Phone color="white" size={18} className="mr-2" />
              <Text className="text-white text-base">{'  '}{item.number}</Text>
            </Pressable>
          ))}

          <Text className="my-2 text-sm" style={{ color: colors.text }}>
            Note : Only valid Indian (+91) numbers can be saved
             </Text>

          <Text className=" text-lg font-semibold mb-2" style={{ color: colors.text }}>
            Email
          </Text>

          <View className='rounded-xl px-4 py-0 mb-2' style={{ backgroundColor: colors.inputBg }}>
            <TextInput
              placeholder="Enter email"
              placeholderTextColor="grey"
              className="text-black text-base py-3 px-1"
              value={selectedEmail}
              onChangeText={setSelectedEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {emailList.length > 1 && (
            <Text className="text-sm mb-2" style={{ color: colors.text }}>
              Other detected emails: {emailList.filter(e => e !== selectedEmail).join(', ')}
            </Text>
          )}


          <Text className="text-lg font-semibold mt-4" style={{ color: colors.text }}>
            Address
          </Text>
          <View className="rounded-xl px-4 py-0 mb-4" style={{ backgroundColor: colors.inputBg }}>
            <TextInput
              placeholder="Enter address"
              placeholderTextColor="grey"
              className="text-black text-base py-3 px-1"
              value={contactAddress}
              onChangeText={setContactAddress}
              multiline
            />
          </View>


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
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
