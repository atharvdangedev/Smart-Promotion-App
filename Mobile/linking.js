export default {
    prefixes: ['demo://app'],
    config: {
        screens: {
            ResetPassword: {
                path: 'reset-password',
                parse: {
                    token: (token) => token,
                },
            },
            // Optional: Add other screen mappings here if you want to support linking
            // Welcome: 'welcome',
            // SignIn: 'signin',
        },
    },
};
