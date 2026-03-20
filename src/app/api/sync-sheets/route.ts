import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Sheets Sync API
 *
 * 工作原理：
 * 1. 主辦方在 Google 表單設計報名欄位（姓名、分會、公司、職稱、產業、服務、想認識對象、痛點）
 * 2. Google 表單自動將結果寫入 Google 試算表
 * 3. 主辦方在 Google 試算表設定「共用」→「知道連結的人可以檢視」，取得 Spreadsheet ID
 * 4. 將 GOOGLE_SHEET_ID 填入 .env.local
 * 5. 每次有來賓使用系統，前端可呼叫此 Route 取得最新名單（或主辦方手動觸發同步）
 *
 * 欄位順序對應（可依實際 Google 表單欄位調整）：
 * A=時間戳記, B=姓名, C=分會, D=公司, E=職稱, F=產業, G=服務, H=想認識對象, I=痛點
 */

const SHEET_INPUT = process.env.GOOGLE_SHEET_URL_OR_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Google Cloud 的 API Key（需開啟 Sheets API）

// 自動從網址中擷取 ID（例如 https://docs.google.com/spreadsheets/d/1BxiMVs0X.../edit -> 1BxiMVs0X...）
const extractSheetId = (input: string) => {
  if (!input) return null;
  const match = input.match(/[-\w]{25,}/);
  return match ? match[0] : input;
};

const SHEET_ID = extractSheetId(SHEET_INPUT || '');

type SheetGuest = {
  name: string;
  chapter: string;
  company: string;
  title: string;
  industry: string;
  services: string;
  lookingFor: string;
  painPoints: string;
};

export async function GET(_req: NextRequest) {
  if (!SHEET_ID || !GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: '請在 .env.local 填入 GOOGLE_SHEET_URL_OR_ID (可直接貼網址) 和 GOOGLE_API_KEY' },
      { status: 503 }
    );
  }

  // 讀取第一個工作表的 B 到 I 欄（跳過第一行標題）
  const range = encodeURIComponent('工作表1!B2:I');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      console.error('[Sheets Error]', data);
      return NextResponse.json({ error: data?.error?.message || 'Sheets API 錯誤' }, { status: 500 });
    }

    const rows: string[][] = data.values || [];
    const guests: SheetGuest[] = rows
      .filter(row => row[0]) // 必須有姓名
      .map(row => ({
        name: row[0] || '',
        chapter: row[1] || '無',
        company: row[2] || '',
        title: row[3] || '',
        industry: row[4] || '其他',
        services: row[5] || '',
        lookingFor: row[6] || '',
        painPoints: row[7] || '',
      }));

    return NextResponse.json({ guests, count: guests.length, syncedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[Sheets fetch error]', err);
    return NextResponse.json({ error: '無法連線至 Google Sheets' }, { status: 500 });
  }
}
