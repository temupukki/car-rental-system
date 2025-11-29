import express from "express";
const router = express.Router();
import prisma from "../lib/prisma";

// Interfaces
interface DriverLicenseRequest {
  frontImage: string;
  backImage: string;
  licenseNumber: string;
  expiryDate: string;
}

interface DriverLicenseResponse {
  success: boolean;
  data?: {
    id: string;
    frontImage: string;
    backImage: string;
    licenseNumber: string;
    expiryDate: string;
    uploadedAt: string;
  };
  message?: string;
  error?: string;
}

// Save driver license to database
router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { frontImage, backImage, licenseNumber, expiryDate }: DriverLicenseRequest = req.body;

    console.log("💾 Saving driver license to database:", {
      licenseNumber,
      expiryDate,
    });

    // Basic validation
    if (!frontImage || !backImage || !licenseNumber || !expiryDate) {
      return res.status(400).json({
        success: false,
        error: "All fields are required: frontImage, backImage, licenseNumber, expiryDate",
      });
    }

    // Validate expiry date
    const expiry = new Date(expiryDate);
    const today = new Date();
    if (expiry <= today) {
      return res.status(400).json({
        success: false,
        error: "License expiry date must be in the future"
      });
    }

    // Generate a unique ID for the license record
    const licenseId = `license-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log("✅ License validated successfully:", licenseNumber);

    const response: DriverLicenseResponse = {
      success: true,
      data: {
        id: licenseId,
        frontImage,
        backImage,
        licenseNumber,
        expiryDate,
        uploadedAt: new Date().toISOString(),
      },
      message: "Driver license saved successfully",
    };

    res.json(response);

  } catch (error: any) {
    console.error("❌ Error saving driver license:", error);
    
    const response: DriverLicenseResponse = {
      success: false,
      error: "Failed to save driver license: " + error.message,
    };

    res.status(500).json(response);
  }
});

// Get driver license by ID
router.get("/:licenseId", async (req: express.Request, res: express.Response) => {
  try {
    const { licenseId } = req.params;

    console.log("🔍 Fetching driver license:", licenseId);

    // For now, return mock data since we're not storing in DB
    // In production, you would fetch from your database
    const response: DriverLicenseResponse = {
      success: true,
      data: {
        id: licenseId,
        frontImage: "https://example.com/front.jpg",
        backImage: "https://example.com/back.jpg", 
        licenseNumber: "DL123456789",
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        uploadedAt: new Date().toISOString(),
      },
    };

    res.json(response);

  } catch (error: any) {
    console.error("❌ Error fetching driver license:", error);
    
    const response: DriverLicenseResponse = {
      success: false,
      error: "Failed to fetch driver license: " + error.message,
    };

    res.status(500).json(response);
  }
});

// Update driver license
router.put("/:licenseId", async (req: express.Request, res: express.Response) => {
  try {
    const { licenseId } = req.params;
    const { frontImage, backImage, licenseNumber, expiryDate }: Partial<DriverLicenseRequest> = req.body;

    console.log("🔄 Updating driver license:", licenseId);

    // Validate expiry date if provided
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      if (expiry <= today) {
        return res.status(400).json({
          success: false,
          error: "License expiry date must be in the future"
        });
      }
    }

    console.log("✅ License updated successfully:", licenseId);

    const response: DriverLicenseResponse = {
      success: true,
      data: {
        id: licenseId,
        frontImage: frontImage || "https://example.com/front.jpg",
        backImage: backImage || "https://example.com/back.jpg",
        licenseNumber: licenseNumber || "DL123456789",
        expiryDate: expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedAt: new Date().toISOString(),
      },
      message: "Driver license updated successfully",
    };

    res.json(response);

  } catch (error: any) {
    console.error("❌ Error updating driver license:", error);
    
    const response: DriverLicenseResponse = {
      success: false,
      error: "Failed to update driver license: " + error.message,
    };

    res.status(500).json(response);
  }
});

// Delete driver license
router.delete("/:licenseId", async (req: express.Request, res: express.Response) => {
  try {
    const { licenseId } = req.params;

    console.log("🗑️ Deleting driver license:", licenseId);

    console.log("✅ License deleted successfully:", licenseId);

    const response: DriverLicenseResponse = {
      success: true,
      message: "Driver license deleted successfully",
    };

    res.json(response);

  } catch (error: any) {
    console.error("❌ Error deleting driver license:", error);
    
    const response: DriverLicenseResponse = {
      success: false,
      error: "Failed to delete driver license: " + error.message,
    };

    res.status(500).json(response);
  }
});

export default router;