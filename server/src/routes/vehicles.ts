import express, { Request, Response } from "express";
import { PrismaClient, VehicleType } from "../generated/prisma";
import { VehicleFilters, ApiResponse, CreateVehicleInput } from "../types.js";

const router = express.Router();
const prisma = new PrismaClient();

router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

router.get(
  "/",
  async (
    req: Request<{}, {}, {}, VehicleFilters>,
    res: Response<ApiResponse>
  ) => {
    try {
      const { type, search, minPrice, maxPrice, location } = req.query;

      const where: any = { isAvailable: true };

      if (type) {
        where.type = type as VehicleType;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
          { model: { contains: search, mode: "insensitive" } },
        ];
      }

      if (minPrice || maxPrice) {
        where.pricePerDay = {};
        if (minPrice) where.pricePerDay.gte = parseFloat(minPrice.toString());
        if (maxPrice) where.pricePerDay.lte = parseFloat(maxPrice.toString());
      }

      if (location) {
        where.location = { contains: location, mode: "insensitive" };
      }

      const vehicles = await prisma.vehicle.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      res.json({ success: true, data: vehicles });
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

router.get("/all", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: vehicles });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      return res
        .status(404)
        .json({ success: false, error: "Vehicle not found" });
    }

    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response<ApiResponse>) => {
  try {
    console.log("Request body received:", req.body);
    console.log("Request headers:", req.headers);

    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body is empty or missing",
      });
    }

    const vehicleData: CreateVehicleInput = req.body;

    console.log("Parsed vehicle data:", vehicleData);

    // Validate required fields
    if (!vehicleData.name?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Vehicle name is required",
      });
    }

    if (!vehicleData.brand?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Brand is required",
      });
    }

    if (!vehicleData.model?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Model is required",
      });
    }

    if (!vehicleData.image?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Main image URL is required",
      });
    }

    if (!vehicleData.pricePerDay || vehicleData.pricePerDay <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid price per day is required",
      });
    }

    // Validate stock
    if (vehicleData.stock === undefined || vehicleData.stock < 0) {
      return res.status(400).json({
        success: false,
        error: "Valid stock quantity is required",
      });
    }

  
    const vehicle = await prisma.vehicle.create({
      data: {
        name: vehicleData.name.trim(),
        type: vehicleData.type || "SEDAN",
        brand: vehicleData.brand.trim(),
        model: vehicleData.model.trim(),
        year: vehicleData.year || new Date().getFullYear(),
        pricePerDay: vehicleData.pricePerDay,
        image: vehicleData.image.trim(),
        images: vehicleData.images || [],
        seats: vehicleData.seats || 5,
        fuelType: vehicleData.fuelType || "Gasoline",
        transmission: vehicleData.transmission || "Automatic",
        mileage: vehicleData.mileage || "Unlimited",
        features: vehicleData.features || [],
        location: vehicleData.location || null,
        stock: vehicleData.stock,
        isAvailable: vehicleData.stock > 0, 
        rating: 0.0,
        reviewCount: 0,
      },
    });

    console.log("Vehicle created successfully:", vehicle);

    res.status(201).json({ success: true, data: vehicle });
  } catch (error: any) {
    console.error("Error creating vehicle:", error);


    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        error: "A vehicle with similar details already exists",
      });
    }

    res.status(400).json({
      success: false,
      error: error.message || "Error creating vehicle",
    });
  }
});

router.put("/:id", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

  
    if (updateData.stock !== undefined) {
      updateData.isAvailable = updateData.stock > 0;
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: updateData,
    });

    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(400).json({ success: false, error: "Error updating vehicle" });
  }
});

router.patch("/:id/stock", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const { stock, operation } = req.body; 

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        error: "Valid stock quantity is required",
      });
    }

    let updateData: any = {};

    if (operation === 'increment') {
      updateData = {
        stock: { increment: stock }
      };
    } else if (operation === 'decrement') {
      updateData = {
        stock: { decrement: stock }
      };
    } else {
   
      updateData = {
        stock: stock
      };
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...updateData,
        isAvailable: operation === 'set' ? stock > 0 : undefined
      },
    });

    if (operation === 'increment' || operation === 'decrement') {
      const updatedVehicle = await prisma.vehicle.update({
        where: { id },
        data: {
          isAvailable: vehicle.stock > 0
        },
      });
      return res.json({ success: true, data: updatedVehicle });
    }

    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error("Error updating vehicle stock:", error);
    res.status(400).json({ success: false, error: "Error updating vehicle stock" });
  }
});

router.delete("/:id", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    await prisma.vehicle.delete({
      where: { id },
    });

    res.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(400).json({ success: false, error: "Error deleting vehicle" });
  }
});

router.get("/alerts/low-stock", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { threshold = 3 } = req.query; 

    const lowStockVehicles = await prisma.vehicle.findMany({
      where: {
        stock: {
          lte: parseInt(threshold.toString())
        }
      },
      orderBy: { stock: 'asc' },
    });

    res.json({ 
      success: true, 
      data: {
        vehicles: lowStockVehicles,
        count: lowStockVehicles.length,
        threshold: parseInt(threshold.toString())
      }
    });
  } catch (error) {
    console.error("Error fetching low stock vehicles:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/stats/overview", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const totalVehicles = await prisma.vehicle.count();
    const availableVehicles = await prisma.vehicle.count({
      where: { isAvailable: true }
    });
    const outOfStockVehicles = await prisma.vehicle.count({
      where: { stock: 0 }
    });
    const lowStockVehicles = await prisma.vehicle.count({
      where: {
        stock: {
          lte: 3,
          gt: 0
        }
      }
    });

    const vehiclesByType = await prisma.vehicle.groupBy({
      by: ['type'],
      _count: {
        id: true
      },
      _sum: {
        stock: true
      }
    });

    res.json({
      success: true,
      data: {
        totalVehicles,
        availableVehicles,
        outOfStockVehicles,
        lowStockVehicles,
        vehiclesByType
      }
    });
  } catch (error) {
    console.error("Error fetching vehicle statistics:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;