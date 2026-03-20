# AI Networking Pro 部署指南 (Vercel)

本系統目前在地端使用 SQLite 進行高速開發，若要部署至 Vercel (無伺服器架構)，因檔案系統為 Read-only且無法永久儲存，請依下列步驟將資料庫切換為 PostgreSQL：

## 部署步驟

1. **建立 Vercel Postgres 資料庫**
   - 進入 [Vercel](https://vercel.com/) 將本專案 Import。
   - 在專案的 `Storage` 分頁中，點擊 `Create Database` > `Postgres`。
   - 系統會自動為您在專案的 Environment Variables 中注入 `POSTGRES_URL`、`POSTGRES_PRISMA_URL` 等變數。

2. **修改 Prisma Schema**
   打開 `prisma/schema.prisma`，將原本的 SQLite 設定改為 Postgres：
   \`\`\`prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_PRISMA_URL")
     directUrl = env("POSTGRES_URL_NON_POOLING")
   }
   \`\`\`

3. **設定 OpenAI 金鑰**
   請至 Vercel 的專案 `Settings` > `Environment Variables`，加入：
   - \`OPENAI_API_KEY\`：您的 OpenAI 金鑰
   - \`JWT_SECRET\`：任意一組長隨機字串，用來加密主辦方登入 Token

4. **進行第一次發布與資料庫推送**
   進入專案部署後，到 Vercel 終端機或在本地連線至該 DB，執行：
   \`\`\`bash
   npx prisma db push
   \`\`\`
   即可完成資料庫表格建立。部署完成後，即可在全球任何地方使用此系統！
