import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (currentUser.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { user_type } = await req.json();
        const { id } = await params;
        const userId = parseInt(id);

        // Validate user_type
        if (!['prepaid', 'postpaid'].includes(user_type)) {
            return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
        }

        const updatedUser = await prisma.vp_user.update({
            where: { id: userId },
            data: { user_type },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                user_type: true,
                balance: true,
                created_at: true,
            },
        });

        return NextResponse.json({ 
            user: {
                ...updatedUser,
                phone_number: updatedUser.phone,
            }
        });
    } catch (error) {
        console.error('Error updating user type:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
