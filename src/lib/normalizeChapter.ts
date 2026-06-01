/**
 * 分會名稱正規化 — 統一「長輝/長輝分會/長輝白金分會」等寫法
 * 供 match route 和 analytics 共用
 */
export function normalizeChapter(raw: string): string {
  const s = (raw || '').trim().replace(/\s+/g, '');
  if (s.includes('長輝')) return '長輝分會';
  if (s.includes('劉當')) return '劉當莊分會';
  if (s.includes('金鑫')) return '金鑫分會';
  if (s.includes('長翔')) return '長翔分會';
  if (s.includes('大漢')) return '大漢分會';
  if (s.includes('金佑')) return '金佑分會';
  if (s.includes('金致')) return '金致分會';
  const cleaned = s.replace(/分會$/, '').replace(/白金$/, '').replace(/菁英$/, '').replace(/黃金$/, '');
  if (!cleaned || cleaned === '貴賓' || cleaned === '無') return cleaned || '貴賓';
  return cleaned + '分會';
}
