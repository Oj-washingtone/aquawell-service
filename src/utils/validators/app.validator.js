import Joi from "joi";

export const createAppValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    organizationId: Joi.string().required(),
  });

  return schema.validate(data);
};
