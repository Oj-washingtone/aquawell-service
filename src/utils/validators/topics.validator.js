import Joi from "joi";

export const createTopicValidator = (data) => {
  const schema = Joi.object({
    appId: Joi.string().required(),
    topic: Joi.string().required(),
    type: Joi.string().valid("sub", "pub").required(),
  });
  return schema.validate(data);
};
