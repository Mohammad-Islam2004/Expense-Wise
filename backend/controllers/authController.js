const User = require("../models/User");
const jwt = require("jsonwebtoken")

//generate jwt token
const generateToken = (userId) => {
  // 2. SAFETY CHECK: If this logs 'undefined', your .env is not loading!
  console.log("JWT_SECRET check:", process.env.JWT_SECRET ? "Exists" : "MISSING");

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environmental variables");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//register user
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileUserUrl } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileUserUrl,
    });

    // 3. FIX: Passing the _id explicitly
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileUserUrl: user.profileUserUrl,
      },
      token: token,
    });
  } catch (err) {
    // This will now print the REAL error to your VS Code terminal
    console.error("CRASH AT REGISTER:", err); 
    res.status(500).json({ 
      message: "Error registering user", 
      error: err.message 
    });
  }
};

//login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password ) {
    return res.status(400).json({ message: "All fields are required."})
  }
  try{
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials."})
    }
    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    })
  }
  catch (err) {
    res.status(500).json({ message: "Error in logging in user.", error: err.message})
  }
}

//getInfo user
exports.getUserInfo = async (req, res) => {
  try{
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ message : "User not found." })
    }

    res.status(200).json( user )
  }
catch (err) {
    res.status(500).json({ message: "Error in logging in user.", error: err.message})
  }
}