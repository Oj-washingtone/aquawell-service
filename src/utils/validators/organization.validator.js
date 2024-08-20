import Joi from "joi";

export const createOrganizationValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).required(),
    address: Joi.string().min(3).required(),
  });

  return schema.validate(data);
};
