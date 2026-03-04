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

  // 1. Create Admin User
  const adminPasswordHash = await hash("admin123", 10);
  const adminUser = await prisma.vp_user.create({
    data: {
      email: "admin@voicepass.com",
      password: adminPasswordHash,
      name: "System Admin",
      role: "admin",
      balance: 10000.00,
      is_active: true,
      api_key: "vp_live_admin_key_999",
    },
  });

  console.log("\n=================================================");
  console.log("👤 ADMIN USER CREATED");
  console.log(`   Email:   admin@voicepass.com`);
  console.log(`   Pass:    admin123`);
  console.log("=================================================");

  // 2. Create the Main Test User (Regular User)
  // We use a fixed API key so you can easily copy it for testing
  const testUserApiKey = "vp_test_key_123456789";
  const passwordHash = await hash("password123", 10);

  const testUser = await prisma.vp_user.create({
    data: {
      email: "test@voicepass.com",
      password: passwordHash,
      name: "Test User",
      role: "user",
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

  // 3. Create 10 Transactions for the Test User
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

  // 4. Create 10 Call Logs for the Test User
  console.log(`📞 Creating 10 call logs for User #${testUser.id}...`);
  for (let c = 1; c <= 10; c++) {
    const status = c % 3 === 0 ? "FAILED" : "COMPLETED";
    const cost = status === "FAILED" ? 0 : 3.5;
    const duration = status === "FAILED" ? "0" : `${randomAmount(30, 300)}`;

    await prisma.vp_call_log.create({
      data: {
        user_id: testUser.id,
        call_id: `CALL-TEST-${c}`,
        gender: c % 2 === 0 ? "female" : "male",
        cost: cost,
        language: "en",
        phone_number: randomPhone(),
        otp: Math.floor(100000 + Math.random() * 900000).toString(),
        status: status,
        duration: duration,
        created_at: new Date().toISOString(),
        start_time: new Date().toISOString(),
        answer_time: status === "FAILED" ? null : new Date().toISOString(),
        ring_time: new Date().toISOString(),
        end_at: new Date().toISOString(),
      },
    });
  }

  // 5. Create 2 Extra Dummy Users (to make 3 total)
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
