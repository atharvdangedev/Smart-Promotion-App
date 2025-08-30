import { api } from '../utils/api';

export const fetchContacts = async user => {
  try {
    const endpoint = 'vendor/contact/vendor';
    const response = await api.get(endpoint);
    return response.data.vendor_contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const fetchContactDetails = async (id, activeUser) =>{
  try {
    const endpoint =
      activeUser === 'agent'
        ? `agent/contacts/${id}`
        : `vendor/contacts/${id}`;
    const response = await api.get(endpoint);
    return response.data.contact;
  } catch (error) {
    console.log('Error fetching contact details', (error));
    throw error;
  }
}

export const importContacts = async (selectedContacts, user) => {
  // const payload = {
  //   selectedContacts,
  // };

  try {
    const endpoint =
      user === 'agent'
        ? 'agent/contacts/import-app-contacts'
        : 'vendor/contacts/import-app-contacts';
    const response = await api.post(endpoint, selectedContacts);
    return response.data;
  } catch (error) {
    console.log('Error importing contacts', error);
    throw error;
  }
};

