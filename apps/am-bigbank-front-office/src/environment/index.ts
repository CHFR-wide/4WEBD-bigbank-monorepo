import Joi from 'joi';

export const environmentValues = () => ({
  env: {
    jwtSecret: process.env.JWT_SECRET,
    msNotification: {
      host: process.env.MS_NOTIFICATION_HOST,
      port: process.env.MS_NOTIFICATION_PORT,
    },
    msBankAccount: {
      host: process.env.MS_BANK_ACCOUNT_HOST,
      port: process.env.MS_BANK_ACCOUNT_PORT,
    },
    msUser: {
      host: process.env.MS_USER_HOST,
      port: process.env.MS_USER_PORT,
    },
    msTransaction: {
      host: process.env.MS_TRANSACTION_HOST,
      port: process.env.MS_TRANSACTION_PORT,
    },
  },
});
export const environmentValidationSchema = Joi.object({
  JWT_SECRET: Joi.required(),
  MS_NOTIFICATION_HOST: Joi.required(),
  MS_NOTIFICATION_PORT: Joi.required(),
  MS_BANK_ACCOUNT_HOST: Joi.required(),
  MS_BANK_ACCOUNT_PORT: Joi.required(),
});
export type TEnvironmentValues = ReturnType<typeof environmentValues>['env'];
