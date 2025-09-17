import { Request, Response } from 'express';
import { IUser } from '../types/user';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.TOKEN_SECRET || "supersecret";



export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role} = req.body as IUser;

    // Validate Input
    if(!username || !email || !password) {
      return res.status(400).json({
        message: "Al fields are required"
      })
    }

    // Check if email already exists
    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      })
    }

    // Create new user (password hashes automatically in pre save)
    const newUser = new User({username, email, password, role});
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
    const {email, password} = req.body;

    // Validate Input
    if(!email || !password) {
      return res.status(400).json({
        message:  "Email and Password are required"
      });
    }

    // check if user exists
      const user = await User.findOne({email});
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
        JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      res.status(200).json({
        message: "Login Successful",
        token
      })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error" 
    });
  }
};