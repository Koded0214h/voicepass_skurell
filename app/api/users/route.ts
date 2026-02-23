import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';
import { hashPassword } from '@/lib/encryption';
import { db } from '@/lib/db';
import { generateApiKey } from '@/lib/utils';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only admins can view all users
        if (currentUser.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const role = searchParams.get('role');
        const skip = (page - 1) * limit;

        const where: any = {};
        if (role && role !== 'ALL') {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            prisma.vp_user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    role: true,
                    user_type: true,
                    balance: true,
                    created_at: true,
                    updated_at: true,
                    name: true,
                    company: true,
                    is_active: true,
                },
                orderBy: { created_at: 'desc' },
                skip,
                take: limit,
            }),
            prisma.vp_user.count({ where }),
        ]);

        // Transform to match frontend expectations
        const transformedUsers = users.map(user => ({
            id: user.id,
            name: user.name || null,
            company: user.company || null,
            email: user.email || '',
            phone_number: user.phone || '',
            role: user.role || 'user',
            user_type: user.user_type || 'prepaid',
            balance: user.balance || 0,
            is_active: user.is_active,
            created_at: user.created_at?.toISOString() || new Date().toISOString(),
            last_login: user.updated_at?.toISOString() || null,
        }));

        return NextResponse.json({
            users: transformedUsers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email, password, name, company, phone_number, role, user_type } = await req.json();

        // Check if user exists
        const existing = await db.vp_user.findUnique({
          where: { email },
        });

        if (existing) {
          return NextResponse.json(
            { error: 'Email already registered' },
            { status: 400 }
          );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user with generated API key
        const user = await db.vp_user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            company,
            phone: phone_number,
            role: role || 'user',
            user_type: user_type || 'prepaid',
            is_active: true,
            api_key: generateApiKey(),
          },
        });

        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            user_type: user.user_type,
            company: user.company,
            phone_number: user.phone,
          },
        });
    } catch (error: any) {
        console.error('User creation error:', error);
        return NextResponse.json(
            { error: error.message || 'User creation failed' },
            { status: 500 }
        );
    }
}
