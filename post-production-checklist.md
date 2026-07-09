# Post-Production Checklist

Apply to each video in `selected/` before moving to `final/`.

## Per-Video Checklist

### 1. Trim (2 min)
- [ ] Hard cap at **10–15 seconds** (target 12s)
- [ ] Cut dead air at start/end
- [ ] Punchline lands on final beat (8–12s mark)
- [ ] Export preview at 9:16

### 2. Audio / Voiceover (5 min if needed)

**If Seedance lip-sync is good:** skip to step 3.

**If lip-sync needs help:**
- [ ] Record or generate VO from `Script` column in CSV (ElevenLabs clone recommended)
- [ ] Sync VO to video in CapCut, Descript, or Premiere
- [ ] Match ambient audio level: VO at -6dB, ambient at -18dB
- [ ] No background music (plan specifies ambient only)

### 3. Quality Check (1 min)
- [ ] Resolution: **1080×1920** (9:16)
- [ ] No Seedance watermark
- [ ] Face identity consistent with other videos
- [ ] No visible AI artifacts (extra fingers, morphing)
- [ ] Script matches what's spoken (re-record if drift > 2 words)

### 4. Export Settings
```
Format: MP4 (H.264)
Resolution: 1080×1920
Frame rate: 30fps
Bitrate: 8–12 Mbps
Audio: AAC 128kbps
```

### 5. File Naming
```
final/video_XX_track_X_pillar-name.mp4

Examples:
final/video_001_track_A_extreme-volcano.mp4
final/video_071_track_B_meta-3-minutes.mp4
```

### 6. Update CSV
- [ ] Set `Status` = `final`
- [ ] Add file path to `Video URL` column

## Batch Export (Day 8 — all at once)

If using CapCut or similar batch tool:
1. Import all 100 `selected/` files
2. Apply same trim template (0.5s off start, cut to 12s)
3. Batch export with naming convention above
4. Spot-check 10 random videos before scheduling

## Videos Flagged `needs_vo`

Priority order for voiceover overlay:
1. Track B meta videos (#71–90) — teaching content needs clear audio
2. Series videos (#91–100) — continuity requires consistent voice
3. Any video where lip-sync is noticeably off

Track A absurdist videos (#1–70) can often ship with Seedance native audio if lip-sync is acceptable.

## Time Budget

| Task | Per video | × 100 |
|------|-----------|-------|
| Trim | 2 min | 3.3 hrs |
| VO (if needed, ~30%) | 5 min | 2.5 hrs |
| QA + export | 1 min | 1.7 hrs |
| **Total** | | **~7–8 hrs** |

Schedule as a single Day 8 session.
