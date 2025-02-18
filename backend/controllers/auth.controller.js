import { validateEmail, validatePassword } from "../lib/validate.js";
import { generateToken } from "../lib/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Register a new user
export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be 8+ chars with at least one uppercase, one lowercase, and one number.",
      });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      votedJokes: [],
    });

    if (newUser) {
      // Generate and set a JWT token in cookies
      generateToken(newUser._id, res);
      await newUser.save();

      // Respond with user data (excluding password)
      res.status(201).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        votedJokes: [],
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signUp controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login an existing user
export const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if all required fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password format (optional, since it's stored hashed)
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be 8+ chars with at least one uppercase, one lowercase, and one number.",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare entered password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate and set a JWT token in cookies
    generateToken(user._id, res);

    // Respond with user data (excluding password)
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      votedJokes: user.votedJokes,
    });
  } catch (error) {
    console.error("Error in logIn controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout user (clear JWT token)
export const logOut = async (req, res) => {
  try {
    // Clear the authentication token by setting an empty cookie
    res.cookie("access_token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logOut controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Check if a user is authenticated
export const checkAuth = async (req, res) => {
  try {
    // Return user data if authentication middleware is passed
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
