const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register user & send OTP (Does NOT return JWT token)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP & 10-minute expiration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    // Create user as unverified with OTP details stored
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpire,
    });

    if (user) {
      console.log(`\n========================================`);
      console.log(`👉 [ShopNest OTP] Generated for ${user.email}: ${otp}`);
      console.log(`========================================\n`);

      const message = `
        <h2>Welcome to ShopNest, ${name}!</h2>
        <p>Thank you for registering on our platform.</p>
        <p>Your one-time account verification OTP code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `;

      console.log(`[Email Attempt] Sending OTP email to: ${user.email}`);

      try {
        await sendEmail({
          email: user.email,
          subject: "Welcome to ShopNest - Verify Your Account",
          message,
          otp, // 👈 Explicitly passed to sendEmail
        });
        console.log(`[Email Success] Verification OTP sent to: ${user.email}`);
      } catch (emailErr) {
        console.error(`[Email Error] Failed to send email:`, emailErr.message);
      }

      res.status(201).json({
        message:
          "Registration Successful! Please check your email for the OTP.",
        email: user.email,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(`[Register Error]:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and return JWT Token
// @route   POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (user.otpExpire < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Mark account verified and clear OTP credentials
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login User (Sends new OTP if account is unverified)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // If account is unverified, generate a fresh OTP and send it via email
      if (!user.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        console.log(`\n========================================`);
        console.log(`👉 [ShopNest OTP] Generated for ${user.email}: ${otp}`);
        console.log(`========================================\n`);

        const message = `
          <h2>ShopNest Verification</h2>
          <p>Your new account verification OTP code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        `;

        console.log(
          `[Email Attempt] Resending OTP to unverified user: ${user.email}`,
        );

        try {
          await sendEmail({
            email: user.email,
            subject: "ShopNest - Verify Your Account",
            message,
            otp, // 👈 Explicitly passed to sendEmail
          });
          console.log(
            `[Email Success] Verification OTP sent to: ${user.email}`,
          );
        } catch (emailErr) {
          console.error(
            `[Email Error] Failed to send email:`,
            emailErr.message,
          );
        }

        return res.status(401).json({
          message:
            "Account not verified. A new OTP has been sent to your email.",
          needsVerification: true,
          email: user.email,
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, verifyOtp, loginUser, getUsers };
