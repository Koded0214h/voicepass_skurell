import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function randomPhone() {
  return "+23480" + Math.floor(10000000 + Math.random() * 89999999);
}

function randomAmount(min = 10, max = 500) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🧹 Resetting database to a clean state...");
  // Order of deletion is important to avoid foreign key constraint errors.
  await prisma.vp_call_log.deleteMany();
  await prisma.vp_transactions.deleteMany();
  await prisma.vp_user.deleteMany();
  console.log("✅ Database reset complete.");

  console.log("\n🌱 Seeding database with fresh data...");
  
  // 1. Create the Main Test User (Login User)
  // We use a fixed API key so you can easily copy it for testing
  const testUserApiKey = "vp_test_key_123456789";
  const passwordHash = await hash("password123", 10);
  
  const testUser = await prisma.vp_user.create({
    data: {
      email: "test@voicepass.com",
      password: passwordHash,
      name: "Test User",
      role: "admin",
      balance: 5000.00,
      is_active: true,
      api_key: testUserApiKey,
    },
  });

  console.log("\n=================================================");
  console.log("👤 TEST USER CREATED");
  console.log(`   ID:      ${testUser.id}`);
  console.log(`   Email:   test@voicepass.com`);
  console.log(`   Pass:    password123`);
  console.log(`   API KEY: ${testUser.api_key}`);
  console.log(`   Balance: ${testUser.balance}`);
  console.log("=================================================\n");

  // 2. Create 10 Transactions for the Test User
  console.log(`📝 Creating 10 transactions for User #${testUser.id}...`);
  for (let t = 1; t <= 10; t++) {
    await prisma.vp_transactions.create({
      data: {
        user_id: testUser.id,
        type: t % 2 === 0 ? "DEBIT" : "CREDIT",
        amount: randomAmount(50, 500),
        balance_before: testUser.balance ?? 0,
        description: `Test Transaction ${t}`,
        reference: `TX-TEST-${t}`,
      },
    });
  }

  // 3. Create 10 Call Logs for the Test User
  console.log(`📞 Creating 10 call logs for User #${testUser.id}...`);
  for (let c = 1; c <= 10; c++) {
    await prisma.vp_call_log.create({
      data: {
        user_id: testUser.id,
        call_id: `CALL-TEST-${c}`,
        gender: c % 2 === 0 ? "female" : "male",
        cost: randomAmount(10, 100),
        language: "en",
        phone_number: randomPhone(),
        otp: Math.floor(100000 + Math.random() * 900000).toString(),
        status: c % 3 === 0 ? "FAILED" : "COMPLETED",
        duration: `${randomAmount(30, 300)}`,
        created_at: new Date().toISOString(),
        start_time: new Date().toISOString(),
        answer_time: new Date().toISOString(),
        ring_time: new Date().toISOString(),
        end_at: new Date().toISOString(),
      },
    });
  }

  // 4. Create 2 Extra Dummy Users (to make 3 total)
  console.log("👥 Creating 2 extra dummy users...");
  for (let i = 1; i <= 2; i++) {
    await prisma.vp_user.create({
      data: {
        balance: randomAmount(100, 1000),
        is_active: true,
        api_key: `vp_dummy_user_${i}`,
      },
    });
  }

  console.log("✅ Database seeding completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
