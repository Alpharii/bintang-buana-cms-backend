import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../middleware/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register
export const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
       res.status(404).json({ message: "User not found" }); 
       return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword){
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Change Password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user){
        res.status(404).json({ message: "User not found" });
        return
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword){
        res.status(401).json({ message: "Invalid old password" });
        return
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error });
  }
};

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id, 10); // Gunakan req.params untuk ID dari URL

  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User info fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user info", error });
  }
};


export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ message: "All users fetched successfully", users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all users", error });
  }
};
