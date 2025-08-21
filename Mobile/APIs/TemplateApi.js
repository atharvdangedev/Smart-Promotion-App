import { api } from '../utils/api';

export const TemplateApis = {
  fetchTemplate: user => {
    const endpoint = user === 'agent' ? 'agent/templates' : 'vendor/templates';

    const response = api.get(endpoint);

    return response;
  },

  deleteTemplate: id => {
    const response = api.delete(`vendor/templates/${id}`);
    return response;
  },

  toggleStatus: (token, id) => {
    const response = api.put(`vendor/update-template-status/${id}`, {});
    return response;
  },

  templateDetails: (templateId, ActiveUser) => {
    const endpoint =
      ActiveUser === 'agent'
        ? `agent/templates/${templateId}`
        : `vendor/templates/${templateId}`;

    const response = api.get(endpoint);
    return response;
  },
};
