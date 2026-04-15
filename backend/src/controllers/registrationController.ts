import { Response } from 'express';
import type { Request } from 'express';
import { sendSuccess, sendError } from '../utils/helpers';
import { prisma } from '../index';
import { generateCertificate } from '../utils/certificate';

export class RegistrationController {

  // ============ CREATE REGISTRATION + GENERATE CERTIFICATE ============
  static createRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;
      const { workshopId } = req.body;

      if (!userId) {
        sendError(res, 401, 'Unauthorized');
        return;
      }

      if (!workshopId) {
        sendError(res, 400, 'Workshop ID is required');
        return;
      }

      // Check if already registered
      const existing = await prisma.registration.findFirst({
        where: { userId, workshopId },
      });

      if (existing) {
        sendError(res, 400, 'Already registered for this workshop');
        return;
      }

      // Get user and workshop details
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const workshop = await prisma.workshop.findUnique({ where: { id: workshopId } });

      if (!user || !workshop) {
        sendError(res, 404, 'User or Workshop not found');
        return;
      }

      // Generate unique certificate ID
      const certificateId = `CTF-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Generate PDF and upload to Azure
      const url = await generateCertificate({
        userName: user.name,
        workshopTitle: workshop.title,
        dateIssued: new Date().toISOString().split('T')[0],
        certificateId,
      });

      // Store in DB
      const registration = await prisma.registration.create({
        data: {
          certificateId,
          url,
          status: 'CONFIRMED',
          userId,
          workshopId,
        },
      });

      sendSuccess(res, 201, { registration }, 'Registered successfully');
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ GET MY REGISTRATIONS ============
  static getMyRegistrations = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        sendError(res, 401, 'Unauthorized');
        return;
      }

      const registrations = await prisma.registration.findMany({
        where: { userId },
        include: {
          workshop: {
            select: {
              title: true,
              date: true,
              location: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      sendSuccess(res, 200, { registrations });
    } catch (error: any) {
      console.error('❌ Get registrations error:', error);
      sendError(res, 500, error.message);
    }
  };

  // ============ GET ALL REGISTRATIONS (ADMIN) ============
  static getAllRegistrations = async (req: Request, res: Response): Promise<void> => {
    try {
      const registrations = await prisma.registration.findMany({
        include: {
          user: { select: { name: true, email: true } },
          workshop: { select: { title: true, date: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      sendSuccess(res, 200, { registrations, total: registrations.length });
    } catch (error: any) {
      console.error('❌ Get all registrations error:', error);
      sendError(res, 500, error.message);
    }
  };
}