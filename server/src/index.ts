import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
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

app.get("/", (req: Request, res: Response) => {
  res.json("Abebe tests server now ");
});
app.listen(PORT, () => {
  console.log(`app is runnig On ${PORT}`);
});
