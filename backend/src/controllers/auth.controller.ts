import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      username: string;
      fullname: string;
      profilePic: string;
    };
  }
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/document

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
      data: {
        fullname: fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      },
    });

    if (newUser) {
      //generate token
      generateToken(res, newUser.id);

      return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        fullname: newUser.fullname,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(500).json({ message: "Invalid user data" });
    }
  } catch (error: any) {
    console.log("error while signing up", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    const isValidPassword = await bcryptjs.compare(
      password,
      user?.password || ""
    );
    if (!user || !isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(res, user.id);
    return res.status(200).json({
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      profilePic: user.profilePic,
    });
  } catch (error: any) {
    console.log("error while logging in", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    console.log("error while logging out", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        profilePic: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; // Add return to stop further execution
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      profilePic: user.profilePic,
    });
  } catch (error: any) {
    console.error("Error while getting user:", error.message);
    res.status(500).json({ message: "Internal server error" });
    return; // Ensure the function doesn't continue
  }
};
