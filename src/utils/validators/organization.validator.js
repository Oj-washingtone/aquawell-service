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

// update organization
export const updateOrganizationValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().min(10).optional(),
    address: Joi.string().min(3).optional(),
  });

  return schema.validate(data);
};
