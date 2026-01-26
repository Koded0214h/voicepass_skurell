const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function inspectDatabase() {
  try {
    const models = ['vp_user', 'vp_call_log', 'vp_transactions']; // Directly use model names from schema.prisma

    console.log('--- Database Inspection ---');

    for (const modelName of models) {
      console.log(`
### Model: ${modelName}`);

      // Fetch columns using information_schema
      try {
        const columns = await prisma.$queryRaw`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = current_schema() AND table_name = ${modelName}
          ORDER BY ordinal_position;
        `;
        console.log(`  Columns:`);
        if (columns.length > 0) {
          columns.forEach(col => {
            console.log(`    - ${col.column_name}: ${col.data_type} (Nullable: ${col.is_nullable}, Default: ${col.column_default})`);
          });
        } else {
          console.log(`    No columns found for table "${modelName}". It might not exist in the database.`);
        }
      } catch (columnError) {
        console.error(`  Error fetching columns for model ${modelName}:`, columnError.message);
      }


      // Fetch sample records
      try {
        // Prisma client property names are usually camelCase, even if the model name is snake_case in schema.prisma.
        // We need to convert snake_case to camelCase for direct access.
        const data = await prisma[modelName].findMany({ take: 5 });
        console.log(`  Sample Records (first 5):`);
        if (data.length > 0) {
          data.forEach((record, index) => {
            console.log(`    Record ${index + 1}:`, record);
          });
        } else {
          console.log('    No records found.');
        }
      } catch (recordError) {
        console.error(`  Error fetching records for model ${modelName}:`, recordError.message);
      }
    }
    console.log('\n--- Inspection Complete ---');
  } catch (error) {
    console.error('An error occurred during database inspection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

inspectDatabase();
