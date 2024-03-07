import Joi from 'joi';

export const environmentValues = () => ({
  env: {
    jwtSecret: process.env.JWT_SECRET,
  },
});
export const environmentValidationSchema = Joi.object({
  JWT_SECRET: Joi.required(),
});
export type TEnvironmentValues = ReturnType<typeof environmentValues>['env'];
