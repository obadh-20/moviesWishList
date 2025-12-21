import { getPrisma } from "../lib/prisma.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const prisma = getPrisma();

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const token = generateToken(newUser.id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "Registered successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("register error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const prisma = getPrisma();

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!existingUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(existingUser.id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Logged in successfully",
            user: {
                id: existingUser.id,
                email: existingUser.email,
            },
        });
    } catch (error) {
        console.error("login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.json({ message: "Logged out successfully" });
};

   
