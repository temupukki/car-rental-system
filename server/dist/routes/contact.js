"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                error: "Missing required fields: name, email, subject, message",
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Invalid email format",
            });
        }
        const contact = await prisma_1.default.contact.create({
            data: {
                name,
                email,
                phone: phone || null,
                subject,
                message,
                status: "pending",
            },
        });
        console.log("New contact form submission:", {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            subject: contact.subject,
        });
        res.status(201).json({
            message: "Contact form submitted successfully",
            contact: {
                id: contact.id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                createdAt: contact.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Error submitting contact form:", error);
        res.status(500).json({
            error: "Internal server error",
        });
    }
});
router.get("/", async (req, res) => {
    try {
        const contacts = await prisma_1.default.contact.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                subject: true,
                message: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(contacts);
    }
    catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({
            error: "Internal server error",
        });
    }
});
router.patch("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["pending", "replied", "resolved"].includes(status)) {
            return res.status(400).json({
                error: "Invalid status. Must be: pending, replied, or resolved",
            });
        }
        const contact = await prisma_1.default.contact.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        res.json({
            message: "Contact status updated successfully",
            contact,
        });
    }
    catch (error) {
        console.error("Error updating contact status:", error);
        res.status(500).json({
            error: "Internal server error",
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await prisma_1.default.contact.findUnique({
            where: { id: parseInt(id) },
        });
        if (!contact) {
            return res.status(404).json({
                error: "Contact not found",
            });
        }
        res.json(contact);
    }
    catch (error) {
        console.error("Error fetching contact:", error);
        res.status(500).json({
            error: "Internal server error",
        });
    }
});
exports.default = router;
