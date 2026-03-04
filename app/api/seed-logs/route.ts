import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function randomPhone() {
  return "+23480" + Math.floor(10000000 + Math.random() * 89999999);
}

function randomAmount(min = 10, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await db.vp_user.findUnique({
      where: { id: Number(userId) }, // Corrected: Convert string to number
    });

    if (!user) {
      return NextResponse.json({ error: `User with ID ${userId} not found` }, { status: 404 });
    }

    console.log(`🌱 Seeding 5 call logs for User #${userId}...`);
    for (let c = 1; c <= 5; c++) {
      const status = c % 3 === 0 ? "FAILED" : "ANSWERED";
      const cost = status !== "ANSWERED" ? 0 : 3.5;

      await db.vp_call_log.create({
        data: {
          user_id: Number(userId),
          call_id: `SEED-${Date.now()}-${c}`,
          cost: cost,
          phone_number: randomPhone(),
          otp: Math.floor(100000 + Math.random() * 900000).toString(),
          status: status,
          duration: status === "FAILED" ? "0" : `${randomAmount(15, 120)}`,
          created_at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ success: true, message: `Seeded 5 logs for user ${userId}` });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}