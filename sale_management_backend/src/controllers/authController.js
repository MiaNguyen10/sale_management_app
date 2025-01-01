// register and login controller

const Organization = require("../models/organizationModel");
const bcrypt = require("bcrypt"); // for hashing passwords
const jwt = require("jsonwebtoken"); // to generate a token
const { saltRounds } = require("../utils/Constant");

/**
 * Register a new organization
 */
exports.register = async (req, res) => {
  const { name, address, phoneNumber, email, username, password } = req.body;

  if (!name || !address || !phoneNumber || !email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    //check if username already exists
    const existingUsername = await Organization.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //check if email already exists
    const existingEmail = await Organization.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //hash the password
    const passwordHash = await bcrypt.hash(password, saltRounds);

    //create the organization
    const organization_id = await Organization.create(
      name,
      address,
      phoneNumber,
      email,
      username,
      passwordHash
    );

    res
      .status(201)
      .json({ message: "Organization created successfully", organization_id });
  } catch (error) {
    console.log("Register error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Login an organization
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    //find organization by username
    const organization = await Organization.findByUsername(username);
    if (!organization) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //convert the password buffer to a string
    const storedPasswordHash = organization.PasswordHash;

    //compare the password
    const isMatch = await bcrypt.compare(password, storedPasswordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //generate a token
    const token = jwt.sign(
      {
        organization_id: organization.OrganizationID,
        name: organization.Name,
        username: organization.Username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};