# Mr Judge — AI Dispute Arbiter

Copyright (c) 2026 Sobhan Ganji. All rights reserved — see LICENSE.

An AI arbiter for two-sided disputes. Bilingual (English/Persian), with
account-based sign-in so history follows the user across devices — built to
support paid plans later.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth) — email/password sign-in, Row Level Security
- Groq (free `openai/gpt-oss-120b` reasoning model, falls back to Llama 3.3) for the judge analysis
- Web Speech API for English voice input, Groq's hosted Whisper Large v3 for Persian voice input (same free key as the judge analysis)

## 1. Set up Supabase
1. Create a free project at https://supabase.com
2. Open the SQL editor and run `supabase/schema.sql` — this creates the
   `disputes` table, a `profiles` table (with a `plan` column ready for
   subscriptions later), and Row Level Security policies so each user only
   ever sees their own data.
3. In Authentication → Providers, email/password is enabled by default.
   Under Authentication → URL Configuration, set the Site URL and add
   `https://your-domain.com/auth/callback` (and `http://localhost:3000/auth/callback`
   for local dev) as a redirect URL.
4. Go to Project Settings → API and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## 2. Get a free Groq API key
Go to https://console.groq.com/keys → sign up (no credit card) → create a key → `GROQ_API_KEY`.
Groq's free tier is generous and fast; this powers both the judge analysis (`openai/gpt-oss-120b`, with a `llama-3.3-70b-versatile` fallback) and Persian voice transcription (`whisper-large-v3`). Model IDs can change on Groq's side — check https://console.groq.com/docs/models if `lib/ai.ts` ever starts returning errors.

## 3. Configure environment variables
```bash
cp .env.example .env.local
# fill in the values from steps 1-2
```

## 4. Run locally
```bash
npm install
npm run dev
# open http://localhost:3000 — you'll be redirected to /login
```

## 5. Deploy (Vercel recommended)
```bash
npm i -g vercel
vercel
```
Add the same environment variables in the Vercel project settings, then redeploy.
Update the Supabase redirect URL to your production domain.

## Authentication
- Every page except `/login` requires a signed-in user (enforced in `middleware.ts`).
- Sign-up sends a confirmation email (Supabase's default flow) before the account is active.
- Every `disputes` row is scoped to `auth.uid()` at the database level via RLS —
  even if application code has a bug, one user's disputes cannot leak to another.
- The `profiles` table already has a `plan` column (`free` by default) so wiring
  up Stripe or another billing provider later just means updating that column
  and gating features on it — no schema changes needed.

## License
Proprietary — see `LICENSE`. All rights reserved by Sobhan Ganji.

## Project structure
```
app/
  page.tsx                 Home
  login/page.tsx           Sign in / sign up
  auth/callback/route.ts   Supabase email confirmation handler
  new-dispute/page.tsx     Dispute submission form
  results/[id]/page.tsx    Verdict page
  history/page.tsx         Past disputes for the signed-in user
  api/analyze/route.ts     Calls Groq (Llama 3.3), saves to Supabase
  api/disputes/route.ts    List disputes for the current user
  api/disputes/[id]/route.ts
  api/transcribe/route.ts  Groq Whisper transcription for Persian voice input
components/
  Logo.tsx, Nav.tsx, LanguageSwitcher.tsx, SignOutButton.tsx
  DisputeForm.tsx, VoiceButton.tsx, VerdictDisplay.tsx
  ScoreGauge.tsx, LoadingOverlay.tsx
lib/
  i18n.ts                English/Persian copy + AI prompt builder
  ai.ts                  Groq API call
  supabase-server.ts     Server-side session-aware Supabase client
  supabase-browser.ts    Client-side Supabase client
  lang-cookie.ts         Reads the language cookie
middleware.ts            Route protection (redirects signed-out users to /login)
supabase/schema.sql
LICENSE
```
