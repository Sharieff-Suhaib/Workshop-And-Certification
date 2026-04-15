import { prisma } from '../index';
import { Role } from '@prisma/client';

export class AdminService {
  // ============ GET DASHBOARD DATA ============
  static getDashboardData = async () => {
    console.log('📌 Service: Getting dashboard data');

    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({
      where: { role: 'SUPER_ADMIN' },
    });

    console.log('📊 Service: Dashboard stats - Total Users:', totalUsers, 'Admin Users:', adminUsers);

    return {
      totalUsers,
      adminUsers,
      message: 'Dashboard data retrieved successfully',
    };
  };

  // ============ GET ALL USERS ============
  static getAllUsers = async () => {
    console.log('📌 Service: Getting all users');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('📌 Service: Found', users.length, 'users');

    return {
      users,
      total: users.length,
    };
  };

  // ============ UPDATE USER ROLE ============
  static updateUserRole = async (userId: string, role: string) => {
    console.log('📌 Service: Updating user role for userId:', userId, 'to role:', role);

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Validate role is a valid enum value
    const validRoles: Role[] = ['USER', 'MODERATOR', 'SUPER_ADMIN'];
    if (!validRoles.includes(role as Role)) {
      throw new Error('Invalid role. Must be USER, MODERATOR, or SUPER_ADMIN');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: role as Role }, // ← Cast to Role enum
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    console.log(`✅ Service: User role updated: ${user.email} to ${role}`);

    return {
      user,
      message: 'User role updated successfully',
    };
  };

  // ============ DELETE USER ============
  static deleteUser = async (userId: string) => {
    console.log('📌 Service: Deleting user:', userId);

    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await prisma.user.delete({
      where: { id: userId },
      select: { email: true, name: true },
    });

    console.log(`✅ Service: User deleted: ${user.email}`);

    return {
      message: 'User deleted successfully',
    };
  };

  // ============ GET LOGS ============
  static getLogs = async () => {
    console.log('📌 Service: Getting logs');

    return {
      message: 'Logs retrieved successfully',
      logs: [],
    };
  };

  // ============ GET ALL WORKSHOPS ============
  static getWorkshops = async () => {
    console.log('📌 Service: Getting all workshops');

    const workshops = await prisma.workshop.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log('📌 Service: Found', workshops.length, 'workshops');

    return {
      workshops,
      total: workshops.length,
    };
  };

  // ============ CREATE WORKSHOP ============
  static createWorkshop = async (
    title: string,
    description: string | undefined,
    category: string | undefined,
    date: string,
    time: string,
    location: string | undefined,
    capacity: string | undefined
  ) => {
    console.log('📌 Service: Creating workshop:', title);

    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new Error('Workshop title is required');
    }

    if (!date) {
      throw new Error('Workshop date is required');
    }

    if (!time) {
      throw new Error('Workshop time is required');
    }

    const workshop = await prisma.workshop.create({
      data: {
        title: title.trim(),
        description: description || null,
        category: category || 'Technical',
        date: new Date(`${date}T${time}:00`),
        time: time,
        location: location || null,
        capacity: capacity ? parseInt(capacity) : null,
      },
    });

    console.log(`✅ Service: Workshop created: ${workshop.title}`);

    return workshop;
  };

  // ============ UPDATE WORKSHOP ============
  static updateWorkshop = async (
    workshopId: string,
    title: string,
    description: string | undefined,
    category: string | undefined,
    date: string,
    time: string,
    location: string | undefined,
    capacity: string | undefined
  ) => {
    console.log('📌 Service: Updating workshop:', workshopId);

    if (!workshopId) {
      throw new Error('Workshop ID is required');
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new Error('Workshop title is required');
    }

    if (!time) {
      throw new Error('Workshop time is required');
    }

    const workshop = await prisma.workshop.update({
      where: { id: workshopId },
      data: {
        title: title.trim(),
        description: description || null,
        category: category || 'Technical',
        date: new Date(`${date}T${time}:00`),
        time: time,
        location: location || null,
        capacity: capacity ? parseInt(capacity) : null,
      },
    });

    console.log(`✅ Service: Workshop updated: ${workshop.title}`);

    return workshop;
  };

  // ============ DELETE WORKSHOP ============
  static deleteWorkshop = async (workshopId: string) => {
    console.log('📌 Service: Deleting workshop:', workshopId);

    if (!workshopId) {
      throw new Error('Workshop ID is required');
    }

    await prisma.workshop.delete({
      where: { id: workshopId },
    });

    console.log(`✅ Service: Workshop deleted: ${workshopId}`);

    return {
      message: 'Workshop deleted successfully',
    };
  };
}