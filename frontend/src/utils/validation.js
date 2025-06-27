import * as Yup from 'yup';

export const getChannelValidationSchema = (channels, channelId = null) => {
  return Yup.object({
    name: Yup.string()
      .min(3, 'modals.nameLength')
      .max(20, 'modals.nameLength')
      .required('modals.required')
      .test('unique-name', 'modals.uniqueName', (value) => {
        return channelId
          ? !channels.some((channel) => channel.name === value && channel.id !== channelId)
          : !channels.some((channel) => channel.name === value);
      }),
  });
};