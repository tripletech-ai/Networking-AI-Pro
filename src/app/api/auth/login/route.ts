import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: '請輸入信箱與密碼' }, { status: 400 });
    }

    // [Auto-Seed Mechanism] 確保 admin 與 demo 預設帳號永遠存在
    await prisma.organizer.upsert({
      where: { email: 'admin@networking-ai.com' },
      update: {},
      create: {
        name: 'Super Admin (創世代)',
        email: 'admin@networking-ai.com',
        password: 'admin' // In production, this should be hashed
      }
    });
    
    await prisma.organizer.upsert({
      where: { email: 'demo@networking-ai.com' },
      update: {},
      create: {
        name: '長輝分會',
        email: 'demo@networking-ai.com',
        password: 'demo'
      }
    });

    const user = await prisma.organizer.findUnique({
      where: { email }
    });

    // In a real app, compare bcrypt hashes. For this MVP, plaintext match.
    if (!user || user.password !== password) {
      return NextResponse.json({ error: '信箱或密碼錯誤' }, { status: 401 });
    }

    const token = await signToken({
      id: user.id,
      name: user.name,
      email: user.email
    });

    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name } });
    
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
