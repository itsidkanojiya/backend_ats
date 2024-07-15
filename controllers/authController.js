const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/SendEmail");
const { use } = require("passport");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(`name: ${name}, email: ${email} and password: ${password}`);

    if (!user || !password || !name) {
      return res.status(401).json({ message: "Please fill all the details" });
    }

    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ email, name, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token, message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email + " and " + password);
    const user = await User.findOne({ email: email });
    console.log("user: " + user);
    if (!user || !password) {
      return res.status(401).json({ message: "Email or Password is not provided." });
    }
    if (!user) {
      return res.status(401).json({ message: "User Does not exist." });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Incorrect Password." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, message: "User Login successfully" });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log("User Email: " + email);

    // check if email is empty
    if (!email) {
      return res.status(404).json({ message: "No Email is provided." });
    }
    const user = await User.findOne({ email: email });
    console.log("User: " + user);
    // check if user is empty
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create reset token
    const resetToken = jwt.sign({ id: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Token: " + resetToken);

    // Send email with reset token
    const resetURL = `http://localhost:5173/api/auth/resetPassword/${resetToken}`;
    const message = `You requested a password reset. Click the link to reset your password: ${resetURL}`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });

    return res
      .status(200)
      .json({ message: "Password reset link sent to email" });
  } catch (error) {
    return error;
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(401).json({ message: "Token or Password is not provided." });
    }

    // Verify token
    const decodedEmail = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Email: " + decodedEmail.id);
    if (!decodedEmail) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find user by decoded ID
    const user = await User.findOne({ email: decodedEmail.id });
    console.log("User: " + user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Error: " + error);
  }
};
