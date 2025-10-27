"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../generated/prisma");
const router = express_1.default.Router();
const prisma = new prisma_1.PrismaClient();
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        const where = {};
        if (userId && typeof userId === "string") {
            where.userId = userId;
        }
        const orders = await prisma.order.findMany({
            where,
            include: {
                vehicle: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, data: orders });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
router.post("/", async (req, res) => {
    try {
        const { userId, vehicleId, startDate, endDate, customerName, customerEmail, customerPhone, customerLicense, pickupLocation, dropoffLocation, } = req.body;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (totalDays <= 0) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid date range" });
        }
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId },
        });
        if (!vehicle) {
            return res
                .status(404)
                .json({ success: false, error: "Vehicle not found" });
        }
        const totalAmount = vehicle.pricePerDay * totalDays;
        const order = await prisma.order.create({
            data: {
                userId,
                vehicleId,
                startDate: start,
                endDate: end,
                totalDays,
                dailyRate: vehicle.pricePerDay,
                totalAmount,
                customerName,
                customerEmail,
                customerPhone,
                customerLicense,
                pickupLocation,
                dropoffLocation,
                status: "COMPLETED",
            },
            include: {
                vehicle: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(201).json({ success: true, data: order });
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(400).json({ success: false, error: "Error creating order" });
    }
});
router.patch("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                vehicle: true,
            },
        });
        if (status === "COMPLETED" || status === "CANCELLED") {
            await prisma.vehicle.update({
                where: { id: order.vehicleId },
                data: { isAvailable: true },
            });
        }
        res.json({ success: true, data: order });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res
            .status(400)
            .json({ success: false, error: "Error updating order status" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                vehicle: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
        if (!order) {
            return res.status(404).json({ success: false, error: "Order not found" });
        }
        res.json({ success: true, data: order });
    }
    catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
