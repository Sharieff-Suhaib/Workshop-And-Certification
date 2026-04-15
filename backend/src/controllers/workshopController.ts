// src/controllers/workshopController.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { RegisterWorkshopSchema } from "../validation/registrationValidation";

const prisma = new PrismaClient();

// ─── GET /api/workshops ───────────────────────────────────────────────────────
export const listWorkshops = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category } = req.query;

    const workshops = await prisma.workshop.findMany({
      where: category
        ? { category: category as string }
        : undefined,
      include: {
        _count: { select: { registrations: true } },
      },
      orderBy: { date: "asc" },
    });

    const data = workshops.map(({ _count, ...w }) => ({
      ...w,
      filled: _count.registrations,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/workshops/:id ───────────────────────────────────────────────────
export const getWorkshop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const workshop = await prisma.workshop.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!workshop) {
      return res.status(404).json({ success: false, error: "Workshop not found" });
    }

    const { _count, ...rest } = workshop;

    return res.status(200).json({
      success: true,
      data: { ...rest, filled: _count.registrations },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/workshops/:id/register ─────────────────────────────────────────
export const registerForWorkshop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Zod validation
    const parsed = RegisterWorkshopSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(422).json({
        success: false,
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      });
    }

    const data = parsed.data;
    const workshopId = req.params.id;
    const userId = (req.user as any)?.id; // from Passport JWT

    // 2. Check workshop exists
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!workshop) {
      return res.status(404).json({ success: false, error: "Workshop not found" });
    }

    // 3. Check seats available
    if (workshop._count.registrations >= workshop.seats) {
      return res.status(409).json({
        success: false,
        error: "This workshop is fully booked.",
      });
    }

    // 4. Create registration (DB @@unique handles duplicates)
    const registration = await prisma.registration.create({
      data: {
        workshopId,
        userId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        college: data.college,
        department: data.department,
        year: data.year,
        experience: data.experience,
      },
      include: {
        workshop: {
          select: { title: true, date: true, time: true, venue: true },
        },
      },
    });

    return res.status(201).json({ success: true, data: registration });
  } catch (error) {
    // Prisma unique constraint → duplicate registration
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        error: "You have already registered for this workshop.",
      });
    }
    next(error);
  }
};

// ─── GET /api/workshops/my-registrations ─────────────────────────────────────
export const getMyRegistrations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as any)?.id;

    const registrations = await prisma.registration.findMany({
      where: { userId },
      include: {
        workshop: true,
      },
      orderBy: { registeredAt: "desc" },
    });

    return res.status(200).json({ success: true, data: registrations });
  } catch (error) {
    next(error);
  }
};
