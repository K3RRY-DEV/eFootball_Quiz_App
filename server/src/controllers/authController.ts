import { Request, Response } from 'express';
import { IUser } from '../types/user';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// const JWT_SECRET = process.env.JWT_SECRET || "supersecret";




export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role} = req.body as IUser;

    // Validate Input
    if(!username || !email || !password) {
      return res.status(400).json({
        message: "Al fields are required"
      })
    }

    // Strict password rules
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character eg @."
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      })
    }

    // Create new user (password hashes automatically in pre save)
    const newUser = new User({
      username, 
      email, 
      password, 
      role: "user"
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required"
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    console.log("JWT_SECRET used in login:", process.env.JWT_SECRET);


    // Send response based on role
    if (user.role === "admin") {
      return res.status(200).json({
        message: `Welcome Admin ${user.username}`,
        token,
        role: user.role
      });
    } else {
      return res.status(200).json({
        message: `Welcome User ${user.username}`,
        token,
        role: user.role
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const verifyAuth = async (req: Request, res: Response) => {
   try {
    console.log("Verify route hit");
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT with your JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
      username: string;
    };

    return res.json({
      valid: true,
      role: decoded.role,
      userId: decoded.userId,
      username: decoded.username,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};