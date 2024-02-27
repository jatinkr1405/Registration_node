const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require("bcrypt");


exports.signup = async (req, res) => {
  try {
    const { username,email,password } = req.body;
    //console.log(req.body);
   // Hash the password
   const hashedPassword = await bcrypt.hash(password, 10);

   // Create a new user
   const user = new User({
     username:username,
     email:email,
     password: hashedPassword,
   });
    console.log(user);
    await user.save();
    return res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.log("Error: ",error)
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email , password } = req.body;
    const user = await User.findOne({ email:email });
    
    if (user && await bcrypt.compare(password, user.password)) {
      // Create and sign a JWT token
      const token = jwt.sign({ userId: user._id }, config.secretKey, { expiresIn: '1h' });
      console.log(token);
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

