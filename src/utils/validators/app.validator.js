import Joi from "joi";

export const createAppValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    organizationId: Joi.string().required(),
  });

  return schema.validate(data);
};

export const refreshAppKeyValidator = (data) => {
  const schema = Joi.object({
    appId: Joi.string().required(),
    organizationId: Joi.string().required(),
  });

  return schema.validate(data);
};
