-- Insert a user
INSERT INTO "vp_user" ("id", "email", "password", "name", "company", "phone", "role", "created_at", "balance", "last_bal_updated")
VALUES 
('user_123', 'alex@techcorp.com', '$2b$10$epMo.J/./././././././.', 'Alex Johnson', 'TechCorp Solutions', '+2348012345678', 'client', NOW(), 5000.00, NOW());

-- Insert call logs
INSERT INTO "vp_call_log" ("id", "user_id", "call_id", "gender", "cost", "language", "phone_number", "otp", "status", "duration", "created_at", "start_time", "answer_time", "end_at", "webhook_sent")
VALUES
('call_1', 'user_123', 'cid_001', 'female', 3.50, 'en-NG', '+2348099999999', '123456', 'COMPLETED', 15, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 59 minutes 45 seconds', NOW() - INTERVAL '1 hour 59 minutes 30 seconds', true),
('call_2', 'user_123', 'cid_002', 'male', 3.50, 'en-US', '+2348088888888', '654321', 'FAILED', 0, NOW() - INTERVAL '5 hours', NULL, NULL, NULL, false),
('call_3', 'user_123', 'cid_003', 'female', 3.50, 'en-NG', '+2348077777777', '987654', 'ANSWERED', 12, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours 59 minutes 48 seconds', NOW() - INTERVAL '23 hours 59 minutes 36 seconds', true),
('call_4', 'user_123', 'cid_004', 'female', 3.50, 'en-NG', '+2348066666666', '456789', 'COMPLETED', 20, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day 23 hours 59 minutes 40 seconds', NOW() - INTERVAL '1 day 23 hours 59 minutes 20 seconds', true),
('call_5', 'user_123', 'cid_005', 'male', 3.50, 'en-US', '+2348055555555', '112233', 'RINGING', 0, NOW() - INTERVAL '10 minutes', NULL, NULL, NULL, false);

-- Insert transactions
INSERT INTO "vp_transaction" ("id", "user_id", "type", "amount", "balance_after", "description", "reference", "created_at")
VALUES
('txn_1', 'user_123', 'CREDIT', 5000.00, 5000.00, 'Wallet Top-up', 'ref_topup_001', NOW() - INTERVAL '7 days'),
('txn_2', 'user_123', 'DEBIT', 3.50, 4996.50, 'Voice OTP Call - cid_001', 'ref_call_001', NOW() - INTERVAL '2 hours'),
('txn_3', 'user_123', 'DEBIT', 3.50, 4993.00, 'Voice OTP Call - cid_003', 'ref_call_003', NOW() - INTERVAL '1 day'),
('txn_4', 'user_123', 'DEBIT', 3.50, 4989.50, 'Voice OTP Call - cid_004', 'ref_call_004', NOW() - INTERVAL '2 days');

-- Insert credit balance (optional if you want to maintain a separate table, though user table has balance)
INSERT INTO "vp_credit_balance" ("user_id", "balance", "last_updated")
VALUES
('user_123', 4989.50, NOW());