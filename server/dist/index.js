"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_1 = require("better-auth/node");
const auth_1 = require("./lib/auth");
const vehicles_1 = __importDefault(require("./routes/vehicles"));
const orders_1 = __importDefault(require("./routes/orders"));
const payment_1 = __importDefault(require("./routes/payment"));
const contact_1 = __importDefault(require("./routes/contact"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
app.use((req, res, next) => {
    console.log(`📍 ${new Date().toISOString()} ${req.method} ${req.url}`);
    console.log('📦 Body received:', req.body);
    console.log('📦 Content-Type:', req.headers['content-type']);
    console.log('---');
    next();
});
app.all("/api/auth/*", (0, node_1.toNodeHandler)(auth_1.auth));
app.get("/api/me", async (req, res) => {
    const session = await auth_1.auth.api.getSession({
        headers: (0, node_1.fromNodeHeaders)(req.headers),
    });
    return res.json(session);
});
app.use('/api/vehicles', vehicles_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/payment', payment_1.default);
app.use('/api/contact', contact_1.default);
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running on port 3000!",
        timestamp: new Date().toISOString()
    });
});
app.post("/api/debug", (req, res) => {
    console.log('=== 🐛 DEBUG ENDPOINT ===');
    console.log('📍 Headers:', req.headers);
    console.log('📍 Body:', req.body);
    console.log('📍 Body type:', typeof req.body);
    console.log('=== END DEBUG ===');
    res.json({
        success: true,
        message: "Debug received",
        body: req.body,
        bodyType: typeof req.body
    });
});
app.get("/api/user", async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany();
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
app.patch("/api/user/:id/role", async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({ error: "Role is required" });
        }
        const validRoles = ["USER", "ADMIN", "NATURAL", "SOCIAL", "BOTH"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                error: "Invalid role",
                validRoles: validRoles,
            });
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { id: String(id) },
        });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id: String(id) },
            data: {
                role,
                updatedAt: new Date(),
            },
        });
        res.json({
            message: "User role updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("❌ Error updating role:", error);
        res.status(500).json({ error: "Failed to update role" });
    }
});
app.get("/", (req, res) => {
    res.json("Abebe tests server now ");
});
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});
