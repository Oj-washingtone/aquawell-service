import Organization from "../model/Organization.js";
import { createOrganizationValidator } from "../utils/validators/organization.validator.js";

export const createOrganization = async (req, res) => {
  const { error } = createOrganizationValidator(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { name, email, phone, address } = req.body;

  try {
    const organization = await Organization.create({
      name,
      email,
      phone,
      address,
    });

    return res.status(201).json(organization);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export async function getOrganizations(req, res) {
  try {
    const organizations = await Organization.findAll();
    return res.status(200).json(organizations);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
