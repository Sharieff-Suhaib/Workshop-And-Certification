import express from "express";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());
export const prisma = new PrismaClient();

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.listen(5000, async () => {
  console.log("Server running on port 5000");
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});
