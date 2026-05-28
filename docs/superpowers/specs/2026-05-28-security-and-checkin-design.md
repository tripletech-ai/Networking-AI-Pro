# Security Fixes + Individual Check-in Code Design
Date: 2026-05-28
Event: 6/4 50-person BNI networking event

## Scope

This spec covers all changes to ship before June 4, 2026.

---

## 1. Security Fixes

### 1a. JWT Secret hardening
- Remove hardcoded fallback in `src/lib/auth.ts`
- Throw at startup if `JWT_SECRET` env var is missing
- Update `.env` with a new random 32-byte secret

### 1b. `/api/members/all` — add authentication
- Currently zero-auth, exposes all attendee data to anyone with eventId
- Fix: require the requester to present a valid `checkin-token` cookie (issued at check-in time, see Section 2)
- OR: require the event to be active AND the request to include the member's own `checkinCode`
- Chosen approach: issue a short-lived signed cookie (`checkin-token`) after successful check-in code validation. `/api/members/all` verifies this cookie.

### 1c. `/api/match` — rate limiting + active event guard
- Add check: `eventId` must correspond to an `isActive: true` event
- Add IP-based rate limit: max 5 requests per IP per 5 minutes (in-memory Map, resets on cold start — sufficient for Vercel serverless)
- The `isWalkIn` path still allowed but only for active events

### 1d. Remove Prisma query logging in production
- `src/lib/prisma.ts`: remove `log: ['query']` globally, only log errors

### 1e. Remove plaintext password fallback
- `src/app/api/auth/login/route.ts:46` — delete the `isPlaintextMatch` block
- Migration period is over

### 1f. Strengthen admin password
- Change auto-seed from `'admin'` / `'demo'` to env-var-driven passwords
- Add `ADMIN_PASSWORD` and `DEMO_PASSWORD` env vars
- If not set, throw at runtime (don't silently use weak passwords)

---

## 2. Individual 4-Char Check-in Codes

### Goal
Replace name-search check-in with a unique per-person code. Prevents impersonation. Faster UX.

### Code format
- 4 uppercase alphanumeric characters
- Character set: `ACDEFGHJKLMNPQRSTUVWXYZ3456789` (removed 0/O/I/1/2/B for visual clarity)
- Generated at member import/creation time and stored as `checkinCode` field on `MemberProfile`
- Unique constraint in DB

### New check-in flow
1. Guest opens event URL → sees code input field (not name search)
2. Types their 4-char code → server looks up member by `(eventId, checkinCode)` → returns profile
3. Profile auto-loaded → AI matching starts immediately (no form to fill)
4. For **walk-ins**: they still use the GuestForm (no code, since they're new)
5. After successful code lookup, server issues a `checkin-token` JWT cookie (contains `memberId` + `eventId`, 8h expiry)

### Organizer workflow
- Admin panel: member list shows each person's check-in code
- Printable/exportable "Seat Card" list: Name | Company | Code
- Staff reads the code to the guest at the registration desk

### API changes
- New endpoint: `GET /api/event/[id]/checkin?code=XXXX`
  - Validates code against event's attendance list
  - Updates checkinAt timestamp
  - Sets `checkin-token` cookie
  - Returns member profile
- `/api/members/all`: requires valid `checkin-token` cookie
- `/api/match`: walk-in path still open (rate-limited), registered-member path requires `checkin-token`

---

## 3. API Performance: Merge match + grid calls

### Current problem
Client sends 2 parallel requests to `/api/match`, each independently:
- Calls OpenAI embeddings API (duplicate)
- Queries DB for all attendees (duplicate)
- Calls gpt-4o-mini (2 LLM calls — unavoidable)

### Solution
New endpoint: `POST /api/match` accepts `mode: 'both'`
- Compute embedding once
- Fetch DB once
- Fire 2 LLM calls in parallel (Promise.all)
- Return `{ matches: [...], grid: [...], strategicSummary: '...', memberId: '...' }`

### Client UX: Progressive reveal
- Client sends one request
- While waiting, show loading state
- As soon as response arrives, show matches tab first (default active tab)
- Grid tab shows simultaneously (data arrives in same response)
- Loading copy: "AI 正在為您分析全場 ${N} 位來賓的商業資源矩陣" with "預計 10–15 秒" subtitle

### Estimated improvement
- Remove 1 embedding call: ~500ms saved
- Remove 1 DB round-trip: ~200ms saved
- Progressive reveal: user perceives results ~3s faster
- Total: from ~10s perceived wait → ~5–7s perceived wait

---

## 4. UX Fixes

### 4a. Logo click → home
- `EventClient.tsx`: wrap logo div in a button/link that calls `setAppState('intro')`
- Admin pages: logo links to `/admin`

### 4b. Loading bar reflects real progress
- Remove time-based interval animation
- Step 1 (0→40%): triggered when API call fires
- Step 2 (40→70%): triggered at 3s mark (embedding likely done)  
- Step 3 (70→95%): triggered at 7s mark (LLM likely processing)
- Step 4 (95→100%): triggered when response arrives
- Loading message changes to match steps, with time estimate shown

---

## 5. Out of scope (post-event)

- Google OAuth for organizers
- Email OTP for guests
- Full middleware-based admin route protection
- CAPTCHA on walk-in form
