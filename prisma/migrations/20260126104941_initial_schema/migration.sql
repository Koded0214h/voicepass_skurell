-- CreateTable
CREATE TABLE "vp_user" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "api_key" VARCHAR(255),
    "last_bal_updated" TIMESTAMP(6),
    "company" VARCHAR(255),
    "email" VARCHAR(255),
    "name" VARCHAR(255),
    "password" VARCHAR(255),
    "phone" VARCHAR(50),
    "role" VARCHAR(50) DEFAULT 'user',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "webhook_url" VARCHAR(255),

    CONSTRAINT "vp_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vp_call_log" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "call_id" VARCHAR(255),
    "gender" VARCHAR(50),
    "cost" DOUBLE PRECISION,
    "language" VARCHAR(100),
    "phone_number" VARCHAR(50),
    "otp" VARCHAR(50),
    "status" VARCHAR(100),
    "duration" VARCHAR(50),
    "created_at" VARCHAR(100),
    "start_time" VARCHAR(100),
    "answer_time" VARCHAR(100),
    "ring_time" VARCHAR(100),
    "end_at" VARCHAR(100),

    CONSTRAINT "vp_call_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vp_transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "type" VARCHAR(50) DEFAULT 'DEBIT',
    "amount" DOUBLE PRECISION,
    "balance_before" DOUBLE PRECISION,
    "description" TEXT,
    "reference" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "balance_after" DOUBLE PRECISION,

    CONSTRAINT "vp_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vp_user_email_key" ON "vp_user"("email");

-- AddForeignKey
ALTER TABLE "vp_call_log" ADD CONSTRAINT "vp_call_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "vp_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vp_transactions" ADD CONSTRAINT "vp_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "vp_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
