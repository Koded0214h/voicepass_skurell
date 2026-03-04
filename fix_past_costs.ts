import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const logs = await db.vp_call_log.findMany({
    where: {
      cost: { gt: 0 },
      status: { notIn: ['answered', 'ANSWERED', 'completed', 'COMPLETED', 'queue', 'QUEUE', 'initiated', 'INITIATED', 'ringing', 'RINGING'] }
    }
  });

  console.log(`Found ${logs.length} failed calls to refund`);
  for (const log of logs) {
    if (log.user_id && log.cost && log.cost > 0) {
      await db.$transaction([
        db.vp_user.update({
          where: { id: log.user_id },
          data: { balance: { increment: log.cost } }
        }),
        db.vp_call_log.update({
          where: { id: log.id },
          data: { cost: 0 }
        })
      ]);
      console.log(`Refunded ${log.cost} for call ${log.call_id} (status: ${log.status})`);
    } else {
      await db.vp_call_log.update({
          where: { id: log.id },
          data: { cost: 0 }
      });
      console.log(`Set cost to 0 for call ${log.call_id} (status: ${log.status})`);
    }
  }
}
main().catch(console.error).finally(() => db.$disconnect());
