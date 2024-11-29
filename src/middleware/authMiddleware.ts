import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "./prisma";

interface RequestWithUser extends Request {
    user?: any;
}

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) : Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user){
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error(error); // Menampilkan kesalahan di console
    res.status(401).json({ message: "Unauthorized" });
  }
};

