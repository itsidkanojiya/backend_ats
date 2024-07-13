const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email + " and "+ password)
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token,message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email + " and "+ password)
    const user = await User.findOne({ email: email });
    console.log("user: " +user)
    if (!user) {
      return res.status(401).json({ message: "User Does not exist." });
    }

    if(!(await user.matchPassword(password))){
      return res.status(401).json({ message: "Incorrect Password." })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token ,message: 'User Login successfully'});
  } catch (err) {
    next(err);
  }
};