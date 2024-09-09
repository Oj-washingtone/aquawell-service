import Joi from "joi";

export const dispenserValidator = (data) => {
  const schema = Joi.object({
    amount: Joi.number().required().min(0.01),
  });

  return schema.validate(data);
};
