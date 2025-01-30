import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users: { username: string; password: string }[] = [];

export async function register(req: Request, res: Response) {
  const { username, password } = req.body;

  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.json({ message: "User registered" });
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  res.json({ token });
}

export function protectedRoute(req: Request, res: Response) {
  res.json({ message: "Protected data accessed" });
}
