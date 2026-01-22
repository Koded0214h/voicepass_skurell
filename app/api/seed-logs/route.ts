import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  const userId = 'cmkng3gbr0003122pr9yiizlq'; // The specified user ID

  try {
    let user = await db.vp_user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Create a dummy user if not found
      console.log(`User ${userId} not found, creating a dummy user.`);
      user = await db.vp_user.create({
        data: {
          id: userId,
          email: `dummy-${userId}@example.com`,
          password: 'dummy_password_hash', // In a real app, hash this or use a proper seeding method
          name: 'Dummy User',
        },
      });
      console.log(`Dummy user ${userId} created.`);
    }

    const dummyCallLogs: Prisma.vp_call_logCreateInput[] = [
      {
        user_id: userId,
        call_id: 'call_1234567890',
        gender: 'male',
        cost: 4.25,
        language: 'en-US',
        phone_number: '+15551234567',
        status: 'COMPLETED',
        duration: 60,
        start_time: new Date(new Date().setHours(8, 0, 0, 0)),
        answer_time: new Date(new Date().setHours(8, 0, 5, 0)),
        end_at: new Date(new Date().setHours(8, 1, 5, 0)),
        ring_time: 5,
      },
      {
        user_id: userId,
        call_id: 'call_0987654321',
        gender: 'female',
        cost: 2.10,
        language: 'es-ES',
        phone_number: '+34600112233',
        status: 'ANSWERED',
        duration: 30,
        created_at: new Date(new Date().setDate(new Date().getDate() - 1)),
        start_time: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(15, 0, 0, 0)),
        answer_time: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(15, 0, 3, 0)),
        end_at: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(15, 0, 33, 0)),
        ring_time: 3,
      },
      {
        user_id: userId,
        call_id: 'call_abcdefghij',
        gender: 'male',
        cost: 0,
        language: 'en-GB',
        phone_number: '+447001234567',
        status: 'FAILED',
        duration: 0,
        created_at: new Date(new Date().setDate(new Date().getDate() - 2)),
        start_time: new Date(new Date(new Date().setDate(new Date().getDate() - 2)).setHours(10, 0, 0, 0)),
        ring_time: 10,
      },
      {
        user_id: userId,
        call_id: 'call_klmnopqrst',
        gender: 'female',
        cost: 0,
        language: 'fr-FR',
        phone_number: '+33601020304',
        status: 'NO ANSWER',
        duration: 0,
        created_at: new Date(new Date().setDate(new Date().getDate() - 3)),
        start_time: new Date(new Date(new Date().setDate(new Date().getDate() - 3)).setHours(12, 0, 0, 0)),
        ring_time: 20,
      },
      {
        user_id: userId,
        call_id: 'call_long_duration',
        gender: 'male',
        cost: 10.00,
        language: 'en-US',
        phone_number: '+15559876543',
        status: 'COMPLETED',
        duration: 180, // 3 minutes
        created_at: new Date(new Date().setDate(new Date().getDate() - 4)),
        start_time: new Date(new Date(new Date().setDate(new Date().getDate() - 4)).setHours(9, 30, 0, 0)),
        answer_time: new Date(new Date(new Date().setDate(new Date().getDate() - 4)).setHours(9, 30, 5, 0)),
        end_at: new Date(new Date(new Date().setDate(new Date().getDate() - 4)).setHours(9, 33, 5, 0)),
        ring_time: 5,
      },
      {
        user_id: userId,
        call_id: 'call_low_cost',
        gender: 'female',
        cost: 1.50,
        language: 'de-DE',
        phone_number: '+4917012345678',
        status: 'ANSWERED',
        duration: 15,
        created_at: new Date(new Date().setDate(new Date().getDate() - 5)),
        start_time: new Date(new Date(new Date().setDate(new Date().getDate() - 5)).setHours(11, 0, 0, 0)),
        answer_time: new Date(new Date(new Date().setDate(new Date().getDate() - 5)).setHours(11, 0, 2, 0)),
        end_at: new Date(new Date(new Date().setDate(new Date().getDate() - 5)).setHours(11, 0, 17, 0)),
        ring_time: 2,
      },
      {
        user_id: userId,
        call_id: 'call_another_success',
        gender: 'male',
        cost: 5.00,
        language: 'en-AU',
        phone_number: '+61412345678',
        status: 'COMPLETED',
        duration: 90,
        created_at: new Date(new Date().setDate(new Date().getDate() - 6)),
        start_time: new Date(new Date(new Date().setDate(new Date().getDate() - 6)).setHours(14, 0, 0, 0)),
        answer_time: new Date(new Date(new Date().setDate(new Date().getDate() - 6)).setHours(14, 0, 4, 0)),
        end_at: new Date(new Date(new Date().setDate(new Date().getDate() - 6)).setHours(14, 1, 34, 0)),
        ring_time: 4,
      },
      // Adding more calls for a full 7-day trend
      {
        user_id: userId,
        call_id: 'call_yesterday_morning',
        gender: 'female',
        cost: 3.00,
        language: 'en-US',
        phone_number: '+15551112222',
        status: 'COMPLETED',
        duration: 45,
        created_at: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(9, 0, 0, 0)),
        start_time: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(9, 0, 0, 0)),
        answer_time: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(9, 0, 3, 0)),
        end_at: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(9, 0, 48, 0)),
        ring_time: 3,
      },
      {
        user_id: userId,
        call_id: 'call_today_evening',
        gender: 'male',
        cost: 6.00,
        language: 'en-US',
        phone_number: '+15553334444',
        status: 'COMPLETED',
        duration: 120,
        created_at: new Date(new Date().setHours(19, 0, 0, 0)),
        start_time: new Date(new Date().setHours(19, 0, 0, 0)),
        answer_time: new Date(new Date().setHours(19, 0, 5, 0)),
        end_at: new Date(new Date().setHours(19, 2, 5, 0)),
        ring_time: 5,
      },
      {
        user_id: userId,
        call_id: 'call_today_midday',
        gender: 'female',
        cost: 3.50,
        language: 'en-US',
        phone_number: '+15555556666',
        status: 'ANSWERED',
        duration: 50,
        created_at: new Date(new Date().setHours(12, 0, 0, 0)),
        start_time: new Date(new Date().setHours(12, 0, 0, 0)),
        answer_time: new Date(new Date().setHours(12, 0, 4, 0)),
        end_at: new Date(new Date().setHours(12, 0, 54, 0)),
        ring_time: 4,
      },
      {
        user_id: userId,
        call_id: 'call_failed_today',
        gender: 'male',
        cost: 0,
        language: 'en-US',
        phone_number: '+15557778888',
        status: 'FAILED',
        duration: 0,
        created_at: new Date(new Date().setHours(10, 0, 0, 0)),
        start_time: new Date(new Date().setHours(10, 0, 0, 0)),
        ring_time: 10,
      },
    ];

    await db.vp_call_log.createMany({
      data: dummyCallLogs,
      skipDuplicates: true, // Avoid issues if run multiple times
    });

    return NextResponse.json({ message: 'Dummy call logs inserted successfully!' });
  } catch (error: any) { // Type 'any' for broader error handling
    console.error('Error inserting dummy call logs:', error.message, error.stack);
    return NextResponse.json({ error: 'Failed to insert dummy call logs', details: error.message }, { status: 500 });
  }
}
