import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const CHARS = 'ACDEFGHJKLMNPQRSTUVWXYZ3456789';

function randomCode() {
  let code = '';
  for (let i = 0; i < 4; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)];
  return code;
}

async function main() {
  const members = await prisma.memberProfile.findMany({ where: { checkinCode: '' } });
  console.log(`Backfilling ${members.length} members...`);
  for (const m of members) {
    let code = '';
    for (let attempt = 0; attempt < 20; attempt++) {
      const candidate = randomCode();
      const exists = await prisma.memberProfile.findUnique({ where: { checkinCode: candidate } });
      if (!exists) { code = candidate; break; }
    }
    if (!code) { console.log(`Skipping ${m.name} — could not generate unique code`); continue; }
    await prisma.memberProfile.update({ where: { id: m.id }, data: { checkinCode: code } });
    console.log(`${m.name} → ${code}`);
  }
  console.log('Done.');
}

main().finally(() => prisma.$disconnect());
