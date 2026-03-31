#!/bin/bash
# Script: honey_world_report.sh
# Description: Retrieve user info, balance, and call statistics for "Honey world classic"
# Usage: ./honey_world_report.sh

set -e

# ---------- Configuration ----------
DB_URL='postgresql://voice_pass_user:voi-c.p$$0p@173.249.47.2:5252/voice_pass_db'
USER_NAME='Honey world classic'          # Exact name as shown on screen
SUCCESS_STATUS='completed'                # Adjust if needed (see note)

# -----------------------------------

echo "Connecting to database and fetching information for user '$USER_NAME'..."

# 1. Get user details
USER_DATA=$(psql -X -q -t -A "$DB_URL" <<EOF
SELECT id, name, email, balance, is_active
FROM vp_user
WHERE name = '$USER_NAME';
EOF
)

if [ -z "$USER_DATA" ]; then
    echo "ERROR: User '$USER_NAME' not found."
    echo "Try listing similar names with:"
    echo "  psql -d \"$DB_URL\" -c \"SELECT name FROM vp_user WHERE name ILIKE '%honey%';\""
    exit 1
fi

IFS='|' read -r USER_ID USER_NAME USER_EMAIL USER_BALANCE USER_ACTIVE <<< "$USER_DATA"

echo ""
echo "User Details:"
echo "  ID       : $USER_ID"
echo "  Name     : $USER_NAME"
echo "  Email    : $USER_EMAIL"
echo "  Balance  : $USER_BALANCE"
echo "  Active   : $USER_ACTIVE"

# 2. Count total calls
TOTAL_CALLS=$(psql -X -q -t -A "$DB_URL" <<EOF
SELECT COUNT(*)
FROM vp_call_log
WHERE user_id = $USER_ID;
EOF
)

# 3. Count successful calls
SUCCESSFUL_CALLS=$(psql -X -q -t -A "$DB_URL" <<EOF
SELECT COUNT(*)
FROM vp_call_log
WHERE user_id = $USER_ID
  AND status = '$SUCCESS_STATUS';
EOF
)

echo ""
echo "Call Statistics:"
echo "  Total calls          : $TOTAL_CALLS"
echo "  Successful calls     : $SUCCESSFUL_CALLS (status = '$SUCCESS_STATUS')"

# Optional: show distinct statuses for this user
echo ""
echo "Distinct call statuses for this user:"
psql -X -q -t -A "$DB_URL" <<EOF
SELECT DISTINCT status
FROM vp_call_log
WHERE user_id = $USER_ID
ORDER BY status;
EOF

exit 0