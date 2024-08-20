import Joi from "joi";

export const createSiteValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    url: Joi.string().uri().required(),
    description: Joi.string().min(3).required(),
  });

  return schema.validate(data);
};
