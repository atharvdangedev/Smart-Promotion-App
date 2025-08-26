export default {
  prefixes: ['demo://app'],
  config: {
    screens: {
      ResetPassword: {
        path: 'reset-password',
        parse: {
          token: token => token,
        },
      },
    },
  },
};
