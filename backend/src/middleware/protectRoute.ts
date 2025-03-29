import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma"; // Ensure the path is correct

interface DecodedToken extends JwtPayload {
  userId: string;
}

// Extending the Request interface
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

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return; // Ensure response ends here
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded?.userId) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, fullname: true, profilePic: true },
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    req.user = user;

    next(); // Move to the next middleware without returning anything
  } catch (error: any) {
    console.error("Error verifying token:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default protectRoute;
