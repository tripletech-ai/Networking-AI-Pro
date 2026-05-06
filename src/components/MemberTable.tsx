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
}

interface Props {
  members: Member[];
  eventId: string;
}

export default function MemberTable({ members: initialMembers, eventId }: Props) {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberList, setMemberList] = useState<Member[]>(initialMembers);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (memberId: string) => {
    setDeleting(true);
    try {
      const form = new FormData();
      form.append('eventId', eventId);
      
      const res = await fetch(`/api/admin/members/${memberId}/delete`, {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        // Remove from local state immediately (no reload needed)
        setMemberList(prev => prev.filter(m => m.id !== memberId));
        setConfirmingDelete(null);
      } else {
        alert('刪除失敗，請再試一次');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('發生錯誤');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ color: 'var(--text-secondary)', fontSize: 13, borderBottom: '2px solid var(--accent-slate)', background: 'var(--bg-secondary)' }}>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px' }}>嘉賓姓名</th>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px' }}>公司單位 / 職稱</th>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px' }}>精準產業</th>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px' }}>公會分會</th>
            <th style={{ padding: '16px', fontWeight: 700, letterSpacing: '0.5px', textAlign: 'right' }}>管理操作</th>
          </tr>
        </thead>
        <tbody>
          {memberList.map((member: Member) => (
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
              <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                {confirmingDelete === member.id ? (
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#ef4444', marginRight: 4 }}>確定刪除？</span>
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={deleting}
                      style={{
                        cursor: 'pointer', background: '#ef4444',
                        border: 'none', color: '#fff',
                        padding: '6px 14px', borderRadius: '6px', fontSize: 13,
                        opacity: deleting ? 0.5 : 1,
                        fontWeight: 600
                      }}
                    >
                      {deleting ? '...' : '確認'}
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
        />
      )}
    </>
  );
}
