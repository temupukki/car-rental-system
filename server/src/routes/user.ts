import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { ApiResponse } from "../types.js";

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/users/phone - Save phone number
router.post(
  "/phone",
  async (
    req: Request,
    res: Response<ApiResponse>
  ) => {
    try {
      const { email, phone } = req.body;

      if (!email || !phone) {
        return res.status(400).json({ 
          success: false, 
          error: "Email and phone are required" 
        });
      }

      // Validate phone number format
      const phoneRegex = /^\+?[\d\s-()]{10,}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid phone number format" 
        });
      }

      // Update user's phone number
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { phone },
      });

      res.json({ 
        success: true, 
        data: { 
          email: updatedUser.email, 
          phone: updatedUser.phone 
        } 
      });
    } catch (error: any) {
      console.error("Error saving phone number:", error);

      if (error.code === 'P2025') {
        return res.status(404).json({ 
          success: false, 
          error: "User not found" 
        });
      }

      res.status(500).json({ 
        success: false, 
        error: "Failed to save phone number" 
      });
    }
  }
);

// GET /api/users - Get all users
router.get("/", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});



// PATCH /api/users/:id - Update user
router.patch("/:id", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error("Error updating user:", error);

    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(400).json({ success: false, error: "Error updating user" });
  }
});

export default router;