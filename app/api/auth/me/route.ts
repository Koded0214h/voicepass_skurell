import { getCurrentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const userFromDb = await db.vp_user.findUnique({ where: { id: user.id } });
    return NextResponse.json(userFromDb);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }
        
        const body = await req.json();
        const { name, email, company, phone } = body;

        const updatedUser = await db.vp_user.update({
            where: { id: user.id },
            data: {
                name,
                email,
                company,
                phone,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
