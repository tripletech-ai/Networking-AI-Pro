'use client';

import { useState } from 'react';
import MemberEditModal from '@/components/MemberEditModal';

interface Member {
  id: string;
  name: string;
  company: string;
  title: string;
  industry: string;
  chapter: string;
  services: string;
  lookingFor: string;
  painPoints: string;
  checkinCode?: string;
  checkedIn?: boolean;
}

interface Props {
  members: Member[];
  eventId: string;
}

export default function MemberTable({ members: initialMembers, eventId }: Props) {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberList, setMemberList] = useState<Member[]>(initialMembers);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkinFilter, setCheckinFilter] = useState<'all' | 'checkedIn' | 'notCheckedIn'>('all');
  const filteredMembers = memberList.filter(m => {
    const matchSearch = !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCheckin =
      checkinFilter === 'all' ? true :
      checkinFilter === 'checkedIn' ? !!m.checkedIn :
      !m.checkedIn;
    return matchSearch && matchCheckin;
  });

  const handleDelete = async (memberId: string) => {
    // 先樂觀刪除，讓 UI 立即回應
    setMemberList(prev => prev.filter(m => m.id !== memberId));
    setConfirmingDelete(null);

    try {
      const form = new FormData();
      form.append('eventId', eventId);
      const res = await fetch(`/api/admin/members/${memberId}/delete`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        // 刪除失敗，恢復原始列表（重新整理頁面）
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="搜尋姓名或公司..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, width: '100%', maxWidth: 300 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {(['all', 'checkedIn', 'notCheckedIn'] as const).map(f => (
          <button
            key={f}
            onClick={() => setCheckinFilter(f)}
            style={{
              padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: checkinFilter === f ? (f === 'checkedIn' ? '#16a34a' : f === 'notCheckedIn' ? '#94a3b8' : 'var(--accent-blue)') : '#f1f5f9',
              color: checkinFilter === f ? '#fff' : '#64748b',
            }}
          >
            {f === 'all' ? `全部 (${memberList.length})` : f === 'checkedIn' ? `✓ 已報到 (${memberList.filter(m => m.checkedIn).length})` : `未報到 (${memberList.filter(m => !m.checkedIn).length})`}
          </button>
        ))}
      </div>
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '60vh', borderRadius: 12, border: '1px solid #e2e8f0', position: 'relative' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
          <tr style={{ color: 'var(--text-secondary)', fontSize: 13, borderBottom: '2px solid var(--accent-slate)', background: 'var(--bg-secondary)' }}>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>嘉賓姓名</th>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>公司單位 / 職稱</th>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>精準產業</th>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>公會分會</th>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>提供服務</th>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>通關碼</th>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>報到狀態</th>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap', textAlign: 'right' }}>管理操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member: Member) => (
            <tr key={member.id} style={{ borderBottom: '1px solid #f8fafc', color: 'var(--text-primary)', fontSize: 14 }}>
              <td className="font-serif" style={{ padding: '16px', fontWeight: 700, color: 'var(--accent-blue)', whiteSpace: 'nowrap', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</td>
              <td style={{ padding: '16px', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {member.company} <span style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 400 }}>{member.title}</span>
              </td>
              <td style={{ padding: '16px', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ background: 'rgba(197, 168, 128, 0.1)', color: 'var(--accent-gold-dark)', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                  {member.industry}
                </span>
              </td>
              <td style={{ padding: '16px', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{member.chapter}</td>
              <td style={{ padding: '16px', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: '#64748b' }}>
                {member.services || '—'}
              </td>
              <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 700, fontSize: 16, letterSpacing: '4px', color: '#475569' }}>
                {member.checkinCode || '—'}
              </td>
              <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                {member.checkedIn ? (
                  <span style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>✓ 已報到</span>
                ) : (
                  <span style={{ background: '#f8fafc', color: '#94a3b8', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>未報到</span>
                )}
              </td>
              <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                {confirmingDelete === member.id ? (
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#ef4444', marginRight: 4 }}>確定刪除？</span>
                    <button
                      onClick={() => handleDelete(member.id)}
                      style={{
                        cursor: 'pointer', background: '#ef4444',
                        border: 'none', color: '#fff',
                        padding: '6px 14px', borderRadius: '6px', fontSize: 13,
                        fontWeight: 600
                      }}
                    >
                      確認
                    </button>
                    <button
                      onClick={() => setConfirmingDelete(null)}
                      style={{
                        cursor: 'pointer', background: '#f1f5f9',
                        border: '1px solid #e2e8f0', color: '#64748b',
                        padding: '6px 14px', borderRadius: '6px', fontSize: 13,
                      }}
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setEditingMember(member)}
                      className="btn-outline"
                      style={{
                        padding: '6px 14px', fontSize: 13, borderRadius: '8px',
                        background: '#fff', fontWeight: 600
                      }}
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => setConfirmingDelete(member.id)}
                      style={{
                        cursor: 'pointer', background: 'transparent',
                        border: '1px solid #fee2e2', color: '#ef4444',
                        padding: '6px 14px', borderRadius: '8px', fontSize: 13,
                        fontWeight: 600, transition: 'all 0.2s',
                      }}
                    >
                      刪除
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {filteredMembers.length === 0 && memberList.length > 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: 14 }}>
          找不到符合搜尋條件的來賓。
        </div>
      )}

      {memberList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: 14 }}>
          本場活動目前還沒有任何來賓名單。
        </div>
      )}

      {editingMember && (
        <MemberEditModal
          member={editingMember}
          eventId={eventId}
          onClose={() => setEditingMember(null)}
          onSave={(updated) => {
            setMemberList(prev => prev.map(m => m.id === updated.id ? { ...m, ...updated } : m));
            setEditingMember(null);
          }}
        />
      )}
    </>
  );
}
