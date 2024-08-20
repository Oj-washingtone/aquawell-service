import Joi from "joi";

export const registerUserValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid("system", "super_admin", "admin", "member")
      .required(),
    organizationId: Joi.string().when("role", {
      is: "system",
      then: Joi.string().forbidden(),
      otherwise: Joi.string().required(),
    }),
  });

  return schema.validate(data);
};

export const loginUserValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};
