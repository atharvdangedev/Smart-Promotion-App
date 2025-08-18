import { api } from "../utils/api";

export const TemplateApis = {
    fetchTemplate: (user, token) => {
        const endpoint = user === 'agent' ? 'agent/templates' : 'vendor/templates';

        const response = api.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    },

    deleteTemplate: (id, token) => {
        const response = api.delete(`vendor/templates/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    },

    toggleStatus: (token, id) => {
        const response = api.put(
            `vendor/update-template-status/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    },

    templateDetails: (token, templateId, ActiveUser) => {
        const endpoint = ActiveUser === 'agent' ? `agent/templates/${templateId}` : `vendor/templates/${templateId}`;

        const response = api.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    }
}