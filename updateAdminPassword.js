const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  const adminEmail = 'admin@skurel.com';
  const hashedPassword = '$2b$10$yX5h988tFXnQ/PU7fg1dhOL13qzho2gDFf.hFsITarqcfXvz1NjNW'; // Hash for 'eeee'

  try {
    const updatedUser = await prisma.vp_user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword },
    });

    console.log(`Successfully updated password for user: ${updatedUser.email}`);
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
