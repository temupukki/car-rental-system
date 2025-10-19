import express, { Request, Response } from 'express';
import { PrismaClient, VehicleType } from '../generated/prisma';
import { VehicleFilters, ApiResponse, CreateVehicleInput } from '../types.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all vehicles with filters
router.get('/', async (req: Request<{}, {}, {}, VehicleFilters>, res: Response<ApiResponse>) => {
  try {
    const { type, search, minPrice, maxPrice, location } = req.query;
    
    const where: any = { isAvailable: true };
    
    if (type ) {
      where.type = type as VehicleType;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay.gte = parseFloat(minPrice.toString());
      if (maxPrice) where.pricePerDay.lte = parseFloat(maxPrice.toString());
    }
    
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    
    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get vehicle by ID
router.get('/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    });
    
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }
    
    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Create new vehicle (Admin only)
router.post('/', async (req: Request<{}, {}, CreateVehicleInput>, res: Response<ApiResponse>) => {
  try {
    const vehicleData = req.body;
    const vehicle = await prisma.vehicle.create({
      data: vehicleData
    });
    
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(400).json({ success: false, error: 'Error creating vehicle' });
  }
});

// Update vehicle
router.put('/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: req.body
    });
    
    res.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(400).json({ success: false, error: 'Error updating vehicle' });
  }
});

// Delete vehicle
router.delete('/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    await prisma.vehicle.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(400).json({ success: false, error: 'Error deleting vehicle' });
  }
});

export default router;