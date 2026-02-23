import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { generateApiKey } from '@/lib/utils';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userFromDb = await db.vp_user.findUnique({
      where: { id: Number(user.id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        user_type: true,
        company: true,
        phone: true,
        balance: true,
        webhook_url: true,
        api_key: true,
      },
    });

    if (!userFromDb) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json(userFromDb);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, company, phone, webhook_url: webhookUrl, regenerate_api_key: regenerateApiKey } = body;

    const data: { name?: string; company?: string; phone?: string; webhook_url?: string | null; api_key?: string } = {};
    if (name !== undefined) data.name = name;
    if (company !== undefined) data.company = company;
    if (phone !== undefined) data.phone = phone;
    if (webhookUrl !== undefined) data.webhook_url = webhookUrl === '' ? null : webhookUrl;
    if (regenerateApiKey === true) data.api_key = generateApiKey();

    const updatedUser = await db.vp_user.update({
      where: { id: Number(user.id) },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        user_type: true,
        company: true,
        phone: true,
        balance: true,
        webhook_url: true,
        api_key: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}