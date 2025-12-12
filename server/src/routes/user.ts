import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { ApiResponse } from "../types.js";

const router = express.Router();
const prisma = new PrismaClient();


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

    
      const phoneRegex = /^\+?[\d\s-()]{10,}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid phone number format" 
        });
      }

   
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


router.get(
  "/check-phone",
  async (
    req: Request,
    res: Response<ApiResponse>
  ) => {
    try {
      const { phone } = req.query;

      if (!phone) {
        return res.status(400).json({ 
          success: false, 
          error: "Phone number is required" 
        });
      }

      const cleanPhone = String(phone).replace(/\D/g, '');

      if (cleanPhone.length !== 10) {
        return res.status(400).json({ 
          success: false, 
          error: "Phone number must be 10 digits" 
        });
      }

      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          phone: true,
          name: true,
        },
      });

  
      const existingUser = users.find(user => {
        if (!user.phone) return false;
        const userCleanPhone = user.phone.replace(/\D/g, '');
        return userCleanPhone === cleanPhone;
      });

      res.json({ 
        success: true, 
        data: { 
          exists: !!existingUser,
          user: existingUser || null
        } 
      });
    } catch (error: any) {
      console.error("Error checking phone number:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to check phone number" 
      });
    }
  }
);


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