import User from "../model/User.js";
import {
  registerUserValidator,
  loginUserValidator,
} from "../utils/validators/user.validator.js";
import bcrypt from "bcrypt";
import jwtProvider from "../services/jwtProvider.js";
import { validate } from "uuid";
import Organization from "../model/Organization.js";

export async function registerUser(req, res) {
  const { error } = registerUserValidator(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { name, email, password, role, organizationId } = req.body;

  // validate organization
  if (organizationId) {
    if (!validate(organizationId)) {
      return res.status(400).json({
        message: "Invalid organization id",
      });
    }
  }

  // check if organization
  if (organizationId) {
    const organization = await Organization.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      return res.status(404).json({
        message: "No such organization Organization",
      });
    }
  }

  try {
    // check if email already exists
    const emailExists = await User.findOne({ where: { email } });

    if (emailExists) {
      return res.status(400).json({
        message: "A user with similar email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      organizationId,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function loginUser(req, res) {
  const { error } = loginUserValidator(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwtProvider.setToken({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    });

    delete user.dataValues.password;

    return res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
