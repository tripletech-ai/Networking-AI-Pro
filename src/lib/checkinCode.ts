import { prisma } from './prisma';

// No 0/O/I/1/2/B to avoid visual confusion at registration desk
const CHARS = 'ACDEFGHJKLMNPQRSTUVWXYZ3456789';

function randomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export async function generateUniqueCheckinCode(): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = randomCode();
    const existing = await prisma.memberProfile.findUnique({ where: { checkinCode: code } });
    if (!existing) return code;
  }
  // Extremely unlikely — 29^4 = 707,281 possible codes
  throw new Error('Could not generate unique checkin code after 20 attempts');
}
