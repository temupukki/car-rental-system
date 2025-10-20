import express, { Request, Response } from "express";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import vehicleRoutes from './routes/vehicles';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payment';

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


app.use((req: Request, res: Response, next) => {
  console.log(`📍 ${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('📦 Body received:', req.body);
  console.log('📦 Content-Type:', req.headers['content-type']);
  console.log('---');
  next();
});

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

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: "Server is running on port 3000!",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/debug", (req: Request, res: Response) => {
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

app.get("/", (req: Request, res: Response) => {
  res.json("Abebe tests server now ");
});

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  
});