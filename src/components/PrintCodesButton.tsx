'use client';

interface Props {
  members: { name: string; company: string; checkinCode: string }[];
  eventName: string;
}

export default function PrintCodesButton({ members, eventName }: Props) {
  const handleExport = () => {
    // 加入 BOM 讓 Excel 正確顯示中文
    const BOM = '﻿';
    const header = '姓名,公司,通關碼,□ 報到\n';
    const rows = members
      .map(m => {
        // CSV escape: 欄位包含逗號或換行時加引號
        const escape = (s: string) => {
          const v = (s || '').replace(/"/g, '""');
          return v.includes(',') || v.includes('\n') || v.includes('"') ? `"${v}"` : v;
        };
        return [escape(m.name), escape(m.company), m.checkinCode || '—', ''].join(',');
      })
      .join('\n');

    const content = BOM + header + rows;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventName}-報到表.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      style={{
        color: '#7c3aed',
        background: 'rgba(124,58,237,0.08)',
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        border: '1px solid rgba(124,58,237,0.2)',
        cursor: 'pointer',
      }}
    >
      🖨️ 匯出報到表
    </button>
  );
}
