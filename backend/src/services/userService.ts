import { prisma } from '../index';

export class UserService {
  // ============ GET USER DASHBOARD DATA ============
  static getDashboardData = async (userId: string) => {
    console.log('📌 Service: Getting dashboard data for userId:', userId);

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get ONLY this user's registrations with workshop details
    const userRegistrations = await prisma.registration.findMany({
      where: { userId },
      include: {
        workshop: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('📌 Service: User registrations found:', userRegistrations.length);

    if (userRegistrations.length === 0) {
      console.log('ℹ️  Service: User has no registrations yet');
      return {
        workshops: [],
        stats: {
          totalRegistered: 0,
          attended: 0,
          upcoming: 0,
          certificates: 0,
        },
      };
    }

    // Map user's registrations to workshops with correct status
    const workshops = userRegistrations.map((reg) => {
      const workshop = reg.workshop;
      const workshopDate = new Date(workshop.date);
      const now = new Date();

      // Determine status based on certificate and registration status
      let status: 'Registered' | 'Attended' | 'Certified' = 'Registered';

      if (reg.certificateId && reg.status === 'CONFIRMED') {
        // Has certificate = Certified
        status = 'Certified';
        console.log(`✅ ${workshop.title} - Status: CERTIFIED (has certificate)`);
      } else if (workshopDate < now && reg.status === 'CONFIRMED') {
        // Workshop date has passed and is confirmed = Attended
        status = 'Attended';
        console.log(`✅ ${workshop.title} - Status: ATTENDED (date passed)`);
      } else if (reg.status === 'PENDING') {
        // Still pending = Registered
        status = 'Registered';
        console.log(`✅ ${workshop.title} - Status: REGISTERED (pending)`);
      } else if (reg.status === 'CONFIRMED') {
        // Confirmed but in future = Registered
        status = 'Registered';
        console.log(`✅ ${workshop.title} - Status: REGISTERED (confirmed, future date)`);
      }

      return {
        id: workshop.id,
        title: workshop.title,
        category: workshop.category,
        date: workshop.date.toISOString().split('T')[0],
        time: workshop.time,
        status,
        certificateId: reg.certificateId || null,
      };
    });

    // Calculate statistics (ONLY from THIS USER'S workshops)
    const registered = workshops.filter((w) => w.status === 'Registered');
    const attended = workshops.filter((w) => w.status === 'Attended');
    const certified = workshops.filter((w) => w.status === 'Certified');

    console.log(
      '📊 Service Stats for user',
      userId,
      '- Total:', workshops.length,
      'Registered:', registered.length,
      'Attended:', attended.length,
      'Certified:', certified.length
    );

    return {
      workshops,
      stats: {
        totalRegistered: workshops.length,
        attended: attended.length,
        upcoming: registered.length,
        certificates: certified.length,
      },
    };
  };

  // ============ GET ALL AVAILABLE WORKSHOPS ============
  static getAllWorkshops = async (userId: string) => {
    console.log('📌 Service: Getting all workshops for userId:', userId);

    // Get ALL workshops (for browsing/registration page)
    const allWorkshops = await prisma.workshop.findMany({
      orderBy: { date: 'asc' },
    });

    // Get this specific user's registered workshop IDs
    let userRegistrationIds: string[] = [];
    if (userId) {
      const registrations = await prisma.registration.findMany({
        where: { userId },
        select: { workshopId: true },
      });
      userRegistrationIds = registrations.map((r) => r.workshopId);
      console.log('📌 Service: User registered for:', userRegistrationIds.length, 'workshops');
    }

    const formattedWorkshops = allWorkshops.map((w) => ({
      id: w.id,
      title: w.title,
      description: w.description,
      category: w.category,
      date: w.date.toISOString().split('T')[0],
      time: w.time,
      location: w.location,
      capacity: w.capacity,
      isRegistered: userRegistrationIds.includes(w.id),
    }));

    console.log('📌 Service: Total workshops available:', formattedWorkshops.length);

    return { workshops: formattedWorkshops };
  };

  // ============ GET USER CERTIFICATES ============
  static getUserCertificates = async (userId: string) => {
    console.log('📌 Service: Getting certificates for userId:', userId);

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get ONLY this user's confirmed registrations with certificates
    const certificates = await prisma.registration.findMany({
      where: {
        userId,
        status: 'CONFIRMED',
        certificateId: {
          not: undefined,
        },
      },
      include: {
        workshop: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('📌 Service: Certificates for user', userId, ':', certificates.length);

    const formattedCertificates = certificates.map((cert) => ({
      id: cert.id,
      certificateId: cert.certificateId,
      title: cert.workshop.title,
      date: cert.workshop.date.toISOString().split('T')[0],
      url: cert.url || 'https://example.com/certificate.pdf',
      issuedDate: cert.createdAt.toISOString().split('T')[0],
    }));

    return { certificates: formattedCertificates };
  };
}