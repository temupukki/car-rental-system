import express, { Request, Response } from "express";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import vehicleRoutes from './routes/vehicles';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payment';
import contactRoutes from './routes/contact';
import driverLicenseRoutes from './routes/driver-licenses';
import userRoutes from './routes/user';
import prisma from "./lib/prisma";

const app = express();
const PORT = 3000;


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], 
    credentials: true,
  })
);

app.all("/api/auth/*", toNodeHandler(auth));

app.get("/api/me", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});


app.use('/api/vehicles', vehicleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/driver-licenses', driverLicenseRoutes);


app.get("/api/health", (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: "Server is running on port 3000!",
    timestamp: new Date().toISOString()
  });
});


app.get("/api/user", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany(); 
    res.json(users);
  } catch (error) {
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
    const existingUser = await prisma.user.findUnique({
      where: { id: String(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
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
  } catch (error) {
    console.error(" Error updating role:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.json("Abebe tests server now ");
});


app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  
});