import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Settings from "../models/Settings.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// When Firewall Protection is ON, track brute-force login attempts (in-memory)
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const failedLoginAttempts = new Map(); // email -> { count, blockedUntil }

async function isFirewallEnabled() {
  const settings = await Settings.findOne({ key: "site_settings" });
  return settings?.features?.security ?? true;
}

function registerFailedAttempt(email) {
  const record = failedLoginAttempts.get(email) || { count: 0, blockedUntil: null };
  record.count += 1;
  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.blockedUntil = Date.now() + BLOCK_DURATION_MS;
  }
  failedLoginAttempts.set(email, record);
}

function clearFailedAttempts(email) {
  failedLoginAttempts.delete(email);
}

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashPassword,
        });

        // await newUser.save(); 
        
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const firewallEnabled = await isFirewallEnabled();

        if (firewallEnabled) {
            const record = failedLoginAttempts.get(email);
            if (record?.blockedUntil && record.blockedUntil > Date.now()) {
                const minutesLeft = Math.ceil((record.blockedUntil - Date.now()) / 60000);
                return res.status(429).json({
                    success: false,
                    message: `Too many failed attempts. Try again in ${minutesLeft} minute(s).`,
                });
            }
        }

        const user = await User.findOne({ email });

        if (!user) {
            if (firewallEnabled) registerFailedAttempt(email);
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            if (firewallEnabled) registerFailedAttempt(email);
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        if (firewallEnabled) clearFailedAttempts(email);

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res
        .cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/", 

            })
            .status(200)
            .json({
                success: true,
                message: "Login successful",
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                },
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })
    .status(200)
    .json({
      success: true,
      message: "Logout successful" });
};

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

//   console.log("COOKIES:", req.cookies); 

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
export { registerUser, loginUser, logoutUser, authMiddleware };
