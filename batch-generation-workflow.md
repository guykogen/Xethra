# Seedance Batch Generation Workflow

5-day sprint to generate all 100 videos. Target: **20 videos/day**.

## Pre-Sprint Checklist

- [ ] Avatar reference images ready (front face, 3/4 angle, expressive) — same 3 images for every generation
- [ ] [`izop-100-video-briefs.csv`](izop-100-video-briefs.csv) open for copy-paste
- [ ] Seedance account loaded with sufficient credits (~200 generations for 2 variants each)
- [ ] Folder structure created:
  ```
  Content_creation/
  ├── raw/           # Seedance exports (v1, v2 per video)
  ├── selected/      # Best variant per video
  ├── final/         # Post-production exports
  └── rejected/      # Failed generations for reference
  ```

## Daily Schedule

| Day | Videos | Pillars | Focus |
|-----|--------|---------|-------|
| Day 1 | #1–20 | Extreme Locations + Time Freedom | Location-heavy prompts, test avatar consistency |
| Day 2 | #21–40 | Pain Points + Feature Metaphors | Surreal/metaphor prompts, refine if drift occurs |
| Day 3 | #41–60 | Personas + Absurdist | Mixed studio and surreal |
| Day 4 | #61–80 | Before/After + Guy Meta How-To | Transformation + tutorial style |
| Day 5 | #81–100 | Guy Meta Results + Series | Results + series finale |

## Per-Video Workflow (6 min average)

1. **Copy prompt** from CSV column `Seedance Prompt`
2. **Attach avatar reference image** (same image every time)
3. **Set format:** 9:16 vertical, 12 seconds
4. **Generate 2 variants** (v1, v2)
5. **QA checklist** (30 seconds):
   - [ ] Face identity matches avatar reference
   - [ ] No warped hands or jitter
   - [ ] Camera move executed correctly on at least 2 beats
   - [ ] Expression readable and natural
   - [ ] Background stable (no morphing)
   - [ ] Lip-sync usable (mouth moves naturally when speaking)
6. **Pick best variant** → save to `selected/video_XX.mp4`
7. **Update CSV:** set `Status` = `generated`, add `Video URL` or local path
8. **If both fail:** use fallback prompt from [`seedance-prompt-template.md`](seedance-prompt-template.md), regenerate once

## QA Decision Matrix

| Issue | Action |
|-------|--------|
| Face drift | Regenerate with locked-off close-up fallback |
| Wrong camera move | Accept if face/scene good; note in prompt fixes log |
| Jittery motion | Regenerate with simpler camera (static or slow dolly only) |
| Warped hands | Crop to close-up beat only, or regenerate |
| Background morphing | Regenerate; add "stable background, no morphing" to constraints |
| Bad lip-sync | Flag for post-prod VO overlay (see post-production checklist) |

## Prompt Fixes Log

Track recurring issues to improve future batches:

| Video ID | Issue | Fix Applied |
|----------|-------|-------------|
| | | |

## End-of-Day Review (15 min)

- Count: generated / failed / pending
- Note best-performing visual style of the day
- Adjust next day's batch if avatar drift increases after 15+ generations

## Sprint Completion Targets

| Metric | Target |
|--------|--------|
| Videos generated | 100 |
| First-pass success rate | 70%+ (70 videos without fallback) |
| Fallback regenerations | ≤30 |
| Average time per video | ≤6 minutes |
| Total sprint time | ≤5 days |

## Status Tracking

Update the `Status` column in [`izop-100-video-briefs.csv`](izop-100-video-briefs.csv):

| Status | Meaning |
|--------|---------|
| `pending` | Not yet generated |
| `generating` | In Seedance queue |
| `generated` | Best variant selected |
| `needs_vo` | Visual good, needs voiceover overlay |
| `failed` | Both variants failed, needs manual review |
| `final` | Post-production complete |
| `scheduled` | Uploaded to iZop |
