import Link from 'next/link';

export default function GuidePage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '60px 24px', position: 'relative' }}>
      
      {/* 頂部導覽列 */}
      <header style={{
        padding: '24px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 0, left: 0, right: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 24, height: 24,
            background: 'linear-gradient(135deg, #c5a880, #8c7355)',
            borderRadius: 6
          }} />
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '1px', color: '#f8fafc', fontFamily: "'Playfair Display', serif" }}>
            AI Networking <span style={{ color: '#c5a880' }}>Pro</span>
          </div>
        </div>
        <Link href="/" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>
          返回首頁
        </Link>
      </header>

      <div style={{ maxWidth: 800, margin: '60px auto 0' }} className="fade-in-up">
        <h1 style={{ fontSize: 40, fontWeight: 700, color: '#f8fafc', marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>
          使用說明手冊
        </h1>
        <p style={{ fontSize: 18, color: '#c5a880', marginBottom: 48, fontWeight: 300, lineHeight: 1.8 }}>
          AI Networking Pro 是一個設計給實體商務交流會、商會分會內部使用的智能人脈媒合工具。
        </p>

        <section className="glass-card" style={{ padding: 40, marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, color: '#f8fafc', marginBottom: 24, borderBottom: '1px solid rgba(197, 168, 128, 0.2)', paddingBottom: 16 }}>
            給主辦方：如何舉辦一場 AI 交流會？
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, color: '#c5a880', marginBottom: 8 }}>1. 登入系統與建立活動</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>
                使用總部發行的專屬帳號登入後台。點擊「建立活動」，輸入活動名稱。
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 18, color: '#c5a880', marginBottom: 8 }}>2. 匯入您的報名表資料 (動態 CSV 綁定)</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>
                您不需改變您原有的 Google 表單或 Accupass 問題，只要確保您有收集到嘉賓的「痛點、資源、產業」。將其輸出為 CSV 上傳，並在系統畫面中下拉對應正確的欄位，系統將會利用 AI 自動為百位名單建構商務向量。
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 18, color: '#c5a880', marginBottom: 8 }}>3. 獲取專屬報到連結</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>
                在活動儀表板中，您會取得一串如 <code>/event/xxxxxxxx</code> 的專屬連結。請將此連結製作成 QR Code 放在活動現場大螢幕，或事先傳在交流會的 LINE 群組中。
              </p>
            </div>
          </div>
        </section>

        <section className="glass-card" style={{ padding: 40, marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, color: '#f8fafc', marginBottom: 24, borderBottom: '1px solid rgba(197, 168, 128, 0.2)', paddingBottom: 16 }}>
            給與會嘉賓：如何使用 AI 配對？
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, color: '#c5a880', marginBottom: 8 }}>如果您已經提前報名：</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>
                掃描 QR Code 進入頁面後，直接在畫面上方輸入您的「姓名關鍵字」，點擊您自己的名字後，系統將在一秒內調出您的資料庫並立刻計算出專屬您的「戰略九宮格」。
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 18, color: '#c5a880', marginBottom: 8 }}>如果您是空降貴賓 (現場參與)：</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>
                請直接在首頁下方展開的「現場建檔表單」中，花一分鐘填寫您今天的優勢與痛點。送出後，AI 將在十秒內為您生成專屬雷達圖，同時您的資料也將即時與全場其他人的矩陣進行重組配對！
              </p>
            </div>
          </div>
        </section>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>回到首頁</Link>
        </div>

      </div>
    </main>
  );
}
