'use client';

interface Props {
  members: { name: string; company: string; checkinCode: string }[];
  eventName: string;
}

export default function PrintCodesButton({ members, eventName }: Props) {
  const handleExport = () => {
    const rows = members.map(m => `${m.name}\t${m.company}\t${m.checkinCode || '—'}`).join('\n');
    const content = '姓名\t公司\t通關碼\n' + rows;
    const blob = new Blob(['﻿' + content], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventName}-通關碼.tsv`;
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
        border: 'none',
        cursor: 'pointer',
      }}
    >
      📋 匯出通關碼
    </button>
  );
}
