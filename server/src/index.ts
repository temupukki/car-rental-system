import express, { Request, Response } from "express";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import vehicleRoutes from './routes/vehicles';
import orderRoutes from './routes/orders';

const app = express();
const PORT = 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH"],
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


app.get("/", (req: Request, res: Response) => {
  res.json("Abebe tests server now ");
});
app.listen(PORT, () => {
  console.log(`app is runnig On ${PORT}`);
});
