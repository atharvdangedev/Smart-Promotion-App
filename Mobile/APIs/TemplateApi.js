import { api } from '../utils/api';

export const fetchTemplate = async user => {
  try {
    const endpoint = user === 'agent' ? 'agent/templates' : 'vendor/templates';
    const response = await api.get(endpoint);
    return response.data.templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const deleteTemplate = async id => {
  try {
    const response = await api.delete(`vendor/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting template with id ${id}:`, error);
    throw error;
  }
};

export const toggleStatus = async id => {
  try {
    const response = await api.put(`vendor/update-template-status/${id}`, {});
    return response.data;
  } catch (error) {
    console.error(`Error toggling status for template with id ${id}:`, error);
    throw error;
  }
};

export const templateDetails = async (templateId, activeUser) => {
  try {
    const endpoint =
      activeUser === 'agent'
        ? `agent/templates/${templateId}`
        : `vendor/templates/${templateId}`;
    const response = await api.get(endpoint);
    return response.data.template;
  } catch (error) {
    console.error(`Error fetching details for template ${templateId}:`, error);
    throw error;
  }
};
