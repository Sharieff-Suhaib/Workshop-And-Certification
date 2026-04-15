import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import passport from "passport";
import dotenv from 'dotenv';
dotenv.config();
import './config/passport';
import authRoutes from "./routes/authRoutes";
import oauthRoutes from "./routes/oauthRoutes";
import adminRoutes from "./routes/adminRoutes";
import { Pool } from 'pg';
import pgSession from 'connect-pg-simple';
import session from "express-session";
import registrationRoutes from "./routes/registrationRoutes";
import userRoutes from "./routes/userRoutes";


const app = express();
export const prisma = new PrismaClient();
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const PostgresqlStore = pgSession(session);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new PostgresqlStore({
      pool: pgPool,
      tableName: 'session',
      ttl: 24 * 60 * 60, // 24 hours
    }),
    secret: process.env.SESSION_SECRET || 'your_session_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);
app.use('/oauth', oauthRoutes);
app.use('/admin', adminRoutes);
app.use('/registrations', registrationRoutes);
app.use('/user', userRoutes);


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
