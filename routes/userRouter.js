const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const User  = require('../models/userModel');
const auth = require('../middleware/auth');

// test api
router.get("/test", (req, res) => {
  res.send("Hi there ..");
});

// create a new user
router.post('/register', async (req, res) => {
  let { email, password, verifyPassword, displayName } = req.body;

  try {
    if (password.length < 6 || verifyPassword.length < 6) {
      return res.status(400).json({ error: 'please ensure the password must be at least 6 characters long ..' });
    }
    
    if (password !== verifyPassword) {
      return res.status(400).json({ error: 'please ensure the password and password confirm are matching ..' });
    }
    
    if (!email || !password || !verifyPassword) {
      return res.status(400).json({ error: 'please enter email or password or password confirm correctly ..' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'user has already registered ..' });
    }

    if (!displayName) {
      displayName = email;
    }

    // using bcrypt to encrypt the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUserObject = new User({
      email,
      password: passwordHash,
      displayName
    });

    const saveUser = await newUserObject.save();

    return res.json(saveUser);
  } catch (error) {
    // normally we use catch block is for return server error
    // also can handle try block's error and get displayed in here
    return res.status(500).json({ error: error.message });
  }
});

// login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'please enter email or password value correctly ..' });
    }

    const currentUser = await User.findOne({ email }); // try to find user record from DB

    if (!currentUser) {
      return res.status(400).json({ error: 'Not found this account ..' });
    }

    const isMatch = bcrypt.compare(password, currentUser.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password detected ..' });
    }

    const token = jwt.sign({ id: currentUser._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    return res.json({
      access_token: token,
      user: {
        id: currentUser._id,
        displayName: currentUser.displayName,
        email: currentUser.email,
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// delete a user from database
router.delete('/delete', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Oops, token is invalid, operation halted .." });
    }

    const deleteUser = await User.findByIdAndDelete(req.user);
    return res.json(deleteUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      return res.status(401).json(false);
    }

    const user = await User.findById(verified.id);

    if (!user) {
      return res.status(401).json(false);
    }

    return res.json(true);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
  });
});

module.exports = router;
