import Joi from "joi";

// Helper function to validate date format
const dateFormat = Joi.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .message("Invalid date format. Use YYYY-MM-DD.");

export const mainTankHistory = (data) => {
  const schema = Joi.object({
    startDate: dateFormat.required(),
    endDate: dateFormat.required(),
  }).custom((value, helpers) => {
    // Parse dates from strings
    const { startDate, endDate } = value;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if endDate is the same as or after startDate
    if (end < start) {
      return helpers.message(
        "End date must be the same as or after the start date."
      );
    }

    return value; // Return the validated value
  });

  return schema.validate(data);
};
