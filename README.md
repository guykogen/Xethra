# Xethra

Monorepo for the **Xethra AI video studio** (Seedance / BytePlus) and the **iZop 100-video content engine**.

Live studio: [xethra.com/studio](https://www.xethra.com/studio)

## Repository layout

```
Xethra/
├── studio/                 # Next.js app — Seedance studio, agent API, asset library
├── scripts/                # Python batch automation (campaign → Xethra API)
├── campaign/               # Job state for batch runs
├── raw/ selected/ final/   # Generated video pipeline
├── izop-100-video-briefs.csv
└── *.md                    # Campaign docs, prompts, calendar
```

---

## Studio (`studio/`)

Higgsfield-style AI video studio: text/image/reference → Seedance 2.0, Gemini agent, Nano Banana Pro images, asset library.

```bash
cd studio
cp .env.local.example .env.local
# Set BYTEPLUS_API_KEY, NEXTAUTH_*, GEMINI_API_KEY, etc.

npm install
npm run dev          # http://localhost:3000
npm run build
```

**Deploy on Vercel:** set **Root Directory** to `studio` for this repo.

See [`studio/README.md`](studio/README.md) for BytePlus setup, models, and env vars.

---

## Content engine (repo root)

100-video iZop + Guy Kogen campaign with Seedance prompts, posting calendar, and batch scripts.

```bash
cp .env.example .env
# Set XETHRA_AGENT_KEY (same key as studio Vercel env)

python3 scripts/batch_generate.py --start 1 --end 20
python3 scripts/sync_jobs.py --select-first
python3 scripts/campaign_status.py
```

| Resource | Purpose |
|----------|---------|
| [`izop-100-video-briefs.csv`](izop-100-video-briefs.csv) | 100 scripts + Seedance prompts |
| [`seedance-prompt-template.md`](seedance-prompt-template.md) | Prompt template + examples |
| [`batch-generation-workflow.md`](batch-generation-workflow.md) | 5-day generation sprint |
| [`posting-calendar-50-days.md`](posting-calendar-50-days.md) | Schedule (Jul 1 – Aug 19, 2026) |

---

## Quick links

| What | Where |
|------|-------|
| Studio UI + API | `studio/app/` |
| BytePlus integration | `studio/lib/byteplus.ts` |
| Agent orchestrator | `studio/lib/agent-orchestrator.ts` |
| Batch queue script | `scripts/batch_generate.py` |
| Cursor skill | `.cursor/skills/izop-content-agent/SKILL.md` |
