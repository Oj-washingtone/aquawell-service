import Organization from "../model/Organization.js";
import {
  createOrganizationValidator,
  updateOrganizationValidator,
} from "../utils/validators/organization.validator.js";

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

export async function updateOrganization(req, res) {
  const organizationId = req.params.organizationId;
  const { name, email, phone, address } = req.body;

  // Validate input
  const { error } = updateOrganizationValidator({
    name,
    email,
    phone,
    address,
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // make sure at least one value is provided
  if (!name && !email && !phone && !address) {
    return res.status(400).json({ message: "At least one field is required" });
  }

  // Filter out undefined fields
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;

  // try {
  const organization = await Organization.findByPk(organizationId);

  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
  }

  await organization.update(updateData);

  return res.status(200).json(organization);

  // } catch (error) {
  //   return res.status(500).json({ message: "An error occurred", error });
  // }
}
