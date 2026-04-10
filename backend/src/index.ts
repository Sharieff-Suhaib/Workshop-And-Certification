import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// INSERT TEST
app.post("/test", async (req, res) => {
  try {
    const title = req.body.title;
    const workshop = await prisma.workshop.create({
      data: {
        title: title,
      },
    });

    res.json({
      message: "Inserted successfully ✅",
      data: workshop,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});

// FETCH TEST
app.get("/workshops", async (req, res) => {
  try {
    const data = await prisma.workshop.findMany();
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
