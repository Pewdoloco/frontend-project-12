export default {
  translation: {
    common: {
      logout: 'Logout',
      loading: 'Loading...',
      disconnected: 'Disconnected from server. Reconnecting...',
      error: 'Error',
      connectionError: 'Connection error',
      unauthorized: 'Unauthorized',
    },
    header: {
      appName: 'Hexlet Chat',
    },
    home: {
      channels: 'Channels',
      addChannel: '+',
      chat: 'Chat',
      send: 'Send',
      typeMessage: 'Type a message...',
      channelManagement: 'Channel management',
    },
    modals: {
      addChannel: 'Add channel',
      removeChannel: 'Remove channel',
      renameChannel: 'Rename channel',
      channelName: 'Channel name',
      cancel: 'Cancel',
      add: 'Add',
      remove: 'Remove',
      rename: 'Rename',
      confirmRemove: 'Are you sure you want to remove this channel?',
      required: 'Required field',
      uniqueName: 'Must be unique',
      nameLength: 'Between 3 and 20 characters',
    },
    login: {
      title: 'Login',
      username: 'Username',
      // sonar-disable-next-line javascript:S2068
      password: 'Password', // NOSONAR
      login: 'Login',
      noAccount: 'No account? ',
      signup: 'Sign up',
      invalidCredentials: 'Invalid username or password',
    },
    signup: {
      title: 'Sign up',
      username: 'Username',
      // sonar-disable-next-line javascript:S2068
      password: 'Password',// NOSONAR
      // sonar-disable-next-line javascript:S2068
      confirmPassword: 'Confirm password',// NOSONAR
      signup: 'Register',
      haveAccount: 'Already have an account? ',
      login: 'Login',
      userExists: 'User already exists',
      registrationFailed: 'Registration failed. Try again.',
      // sonar-disable-next-line javascript:S2068
      passwordMatch: 'Passwords must match',// NOSONAR
      // sonar-disable-next-line javascript:S2068
      minPasswordLength: 'At least 6 characters',// NOSONAR
      nameLength: 'Between 3 and 20 characters',
      success: 'Registration successful',
    },
    notFound: {
      title: '404 - Page Not Found',
      message: 'Sorry, the requested page does not exist.',
    },
    toast: {
      error: 'An error occurred: {{error}}',
      networkError: 'No connection to server',
      channelAdded: 'Channel added',
      channelRenamed: 'Channel renamed',
      channelRemoved: 'Channel removed',
      profanityDetected: 'Profanity detected in "{{name}}"! Action cancelled.',
      fetchChannelsFailed: 'Failed to load channels',
      fetchMessagesFailed: 'Failed to load messages',
      removeChannelFailed: 'Failed to remove channel',
      renameChannelFailed: 'Failed to rename channel',
      sendMessageFailed: 'Failed to send message',
      addChannelFailed: 'Failed to add channel',
    },
  },
}
