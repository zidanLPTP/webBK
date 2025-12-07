const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("⏳ Sedang membuat akun admin...");

  const passwordRahasia = "MieGorengAdmin";
  const hashedPassword = await bcrypt.hash(passwordRahasia, 10);

  try {
    await prisma.admin.deleteMany({
      where: { username: "superAdmin" }
    });
  } catch (e) {
  }


  const admin = await prisma.admin.create({
    data: {
      nama: "Super Admin",
      username: "superAdmin", 
      password: hashedPassword, 
      role: "ADMIN"
    },
  });

  console.log("SUKSES! Akun Admin berhasil dibuat.");
  console.log("-------------------------------------");
  console.log("Username : superAdmin");
  console.log("Password : " + passwordRahasia);
  console.log("-------------------------------------");
}

main()
  .catch((e) => {
    console.error(" Gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });