import { prisma } from '../index';
import { generateCertificate } from '../utils/certificate';

export class RegistrationService {
  // ============ CREATE REGISTRATION + GENERATE CERTIFICATE ============
  static createRegistration = async (userId: string, workshopId: string) => {
    console.log('📌 Service: Creating registration for userId:', userId, 'workshopId:', workshopId);

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!workshopId) {
      throw new Error('Workshop ID is required');
    }

    // Check if already registered
    const existing = await prisma.registration.findFirst({
      where: { userId, workshopId },
    });

    if (existing) {
      throw new Error('Already registered for this workshop');
    }

    // Get user and workshop details
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const workshop = await prisma.workshop.findUnique({ where: { id: workshopId } });

    if (!user || !workshop) {
      throw new Error('User or Workshop not found');
    }

    console.log('✅ Service: User found:', user.email);
    console.log('✅ Service: Workshop found:', workshop.title);

    // Generate unique certificate ID
    const certificateId = `CTF-${new Date().getFullYear()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    console.log('📌 Service: Generated certificate ID:', certificateId);

    // Generate PDF and upload to Azure
    const url = await generateCertificate({
      userName: user.name,
      workshopTitle: workshop.title,
      dateIssued: new Date().toISOString().split('T')[0],
      certificateId,
    });

    console.log('✅ Service: Certificate generated, URL:', url);

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

    console.log('✅ Service: Registration created:', registration.id);

    return registration;
  };

  // ============ GET MY REGISTRATIONS ============
  static getMyRegistrations = async (userId: string) => {
    console.log('📌 Service: Getting registrations for userId:', userId);

    if (!userId) {
      throw new Error('User ID is required');
    }

    const registrations = await prisma.registration.findMany({
      where: { userId },
      include: {
        workshop: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('📌 Service: Found', registrations.length, 'registrations for user');

    return { registrations };
  };

  // ============ GET ALL REGISTRATIONS (ADMIN) ============
  static getAllRegistrations = async () => {
    console.log('📌 Service: Getting all registrations (Admin)');

    const registrations = await prisma.registration.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        workshop: { select: { id: true, title: true, date: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('📌 Service: Found', registrations.length, 'total registrations');

    return {
      registrations,
      total: registrations.length,
    };
  };
}