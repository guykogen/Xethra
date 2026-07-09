# Xethra — iZop 100-Video Seedance Content Engine

Batch-produced AI avatar video campaign for iZop brand + Guy Kogen personal channels. Uses the [Xethra studio](https://www.xethra.com/studio) API for Seedance 2.0 generation.

## Quick Start

1. **Review briefs:** Open [`izop-100-video-briefs.csv`](izop-100-video-briefs.csv) — 100 rows with scripts, Seedance prompts, captions, UTMs, schedule dates
2. **Generate videos:** Use Xethra automation (below) or follow [`batch-generation-workflow.md`](batch-generation-workflow.md) manually
3. **Post-produce:** Follow [`post-production-checklist.md`](post-production-checklist.md) — trim, VO if needed, export 1080×1920
4. **Schedule:** Follow [`izop-scheduling-guide.md`](izop-scheduling-guide.md) + [`posting-calendar-50-days.md`](posting-calendar-50-days.md)
5. **Track results:** Use [`utm-tracking.md`](utm-tracking.md) for signup attribution

## Xethra Automation

Batch-generate via [Xethra](https://www.xethra.com/studio) + Seedance 2.0 API.

```bash
# 1. Configure
cp .env.example .env
# Set XETHRA_AGENT_KEY (from Vercel env on xethra-website)
# Optional: REFERENCE_IMAGE_URL for avatar reference mode

# 2. Queue Day 1 batch (videos #1–20, 2 variants each)
python3 scripts/batch_generate.py --start 1 --end 20

# 3. Poll jobs, download to raw/, update CSV
python3 scripts/sync_jobs.py --select-first

# 4. Check progress
python3 scripts/campaign_status.py
```

State is tracked in `campaign/state.json`. Generated files land in `raw/`; best picks go to `selected/`.

## Files

| File | Purpose |
|------|---------|
| `izop-100-video-briefs.csv` | Master spreadsheet — all 100 videos |
| `seedance-prompt-template.md` | Reusable prompt template + 10 gold examples |
| `posting-calendar-50-days.md` | Day-by-day schedule (July 1 – Aug 19, 2026) |
| `batch-generation-workflow.md` | 5-day Seedance generation sprint |
| `post-production-checklist.md` | Trim, VO, export checklist |
| `izop-scheduling-guide.md` | Schedule via iZop Composer/chat |
| `utm-tracking.md` | UTM parameters and analytics setup |
| `generate_briefs.py` | Regenerate CSV if you edit video JSON data |
| `scripts/batch_generate.py` | Queue videos to Xethra from CSV |
| `scripts/sync_jobs.py` | Download completed variants, update status |
| `scripts/campaign_status.py` | Campaign progress summary |
| `campaign/state.json` | Job tracking (created on first batch run) |

## Folder Structure

```
Content_creation/
├── raw/              # Seedance exports (v1, v2 per video)
├── selected/         # Best variant per video
├── final/            # Post-production exports (ready to schedule)
└── rejected/         # Failed generations
```

## Content Tracks

| Track | Videos | iZop Brand | Guy Personal |
|-------|--------|-----------|--------------|
| A | #1–70 | Yes | Yes (different caption) |
| B | #71–90 | No | Yes only |
| AB | #91–100 | Yes | Yes |

## Regenerate CSV

If you edit video data in `videos_data_part*.json`:

```bash
python3 generate_briefs.py
```

## Campaign Timeline

| Phase | Days | Output |
|-------|------|--------|
| Script + prompts | Done | CSV + templates |
| Seedance generation | 5 days | 100 videos in `selected/` |
| Post-production | 1 day | 100 videos in `final/` |
| Scheduling | 2 days | 50 days queued in iZop |
| Live posting | 50 days | 2 posts/day, ~15 min/day maintenance |
