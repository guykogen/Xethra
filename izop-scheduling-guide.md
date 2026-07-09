# iZop Scheduling Guide — 100-Video Campaign

How to batch-schedule all 100 videos across iZop brand and Guy personal accounts using iZop AI itself.

## Accounts to Connect

### iZop Brand (8 platforms)
- [ ] Instagram
- [ ] TikTok
- [ ] YouTube
- [ ] Facebook
- [ ] X (Twitter)
- [ ] LinkedIn
- [ ] Threads
- [ ] Pinterest

### Guy Kogen Personal (8 platforms)
- [ ] Instagram
- [ ] TikTok
- [ ] YouTube
- [ ] Facebook
- [ ] X (Twitter)
- [ ] LinkedIn
- [ ] Threads
- [ ] Pinterest

**Total destinations:** 16 account connections (8 iZop + 8 personal)

## Scheduling Rules

| Rule | Detail |
|------|--------|
| Cadence | 2 videos/day for 50 days (July 1 – August 19, 2026) |
| Morning slot | 09:00 ET — odd-numbered videos (#1, #3, #5…) |
| Evening slot | 18:00 ET — even-numbered videos (#2, #4, #6…) |
| Stagger platforms | Offset each platform by 15–30 min within the slot |
| Track A (#1–70, #91–100) | Post to **both** iZop brand + Guy personal |
| Track B (#71–90) | Post to **Guy personal only** |
| Caption | Use `iZop Caption` for brand, `Guy Caption` for personal |

## Platform Posting Order (within each slot)

Stagger to avoid simultaneous posting across all platforms:

| Offset | Platform |
|--------|----------|
| +0 min | TikTok |
| +15 min | Instagram |
| +30 min | YouTube |
| +45 min | Facebook |
| +60 min | X |
| +75 min | LinkedIn |
| +90 min | Threads |
| +105 min | Pinterest |

Example: Video #1 morning slot → TikTok 9:00, Instagram 9:15, YouTube 9:30, etc.

## Batch Scheduling Workflow

### Option A: iZop Composer (visual calendar)

1. Log in to [izop.ai](https://izop.ai) dashboard
2. Go to **Composer**
3. For each video:
   - Upload video from `final/video_XX.mp4`
   - Paste caption from CSV (`iZop Caption` or `Guy Caption`)
   - Replace `{platform}` in caption links with actual platform UTM (see [`utm-tracking.md`](utm-tracking.md))
   - Select target account(s)
   - Set date/time from [`posting-calendar-50-days.md`](posting-calendar-50-days.md)
   - Schedule

### Option B: iZop AI Chat (faster for batches)

Example chat commands:

```
Schedule video 1 to all iZop brand platforms on July 1 at 9:00 AM ET.
Caption: [paste iZop Caption from CSV]
```

```
Schedule video 1 to my personal Instagram and TikTok on July 1 at 9:15 AM ET.
Caption: [paste Guy Caption from CSV]
```

```
Schedule videos 1 through 10 to iZop brand TikTok, one per day starting July 1 at 9:00 AM ET.
Use captions from my content briefs.
```

### Option C: Bulk import (fastest — schedule Day 9–10)

1. Sort `final/` folder by video number
2. Open CSV alongside Composer
3. Schedule 10 videos per hour:
   - 10:00–11:00 → Videos #1–10
   - 11:00–12:00 → Videos #11–20
   - Continue through #100
4. Total scheduling time: ~10 hours over 2 days

## Per-Video Scheduling Checklist

- [ ] Video uploaded from `final/` folder
- [ ] Correct caption pasted (iZop vs Guy)
- [ ] UTM link updated with platform name
- [ ] Correct account selected (brand vs personal)
- [ ] Date matches posting calendar
- [ ] Time staggered per platform order
- [ ] CSV `Status` updated to `scheduled`
- [ ] CSV `Platforms Posted` updated after confirming

## Track-Specific Notes

### Track A (iZop Brand + Guy Personal)
- Same video file, different captions
- iZop caption: benefit-first, product CTA
- Guy caption: "how I made this" + comment PROMPT hook
- Schedule brand 15 min before personal (brand leads, personal follows)

### Track B (Guy Personal Only)
- Do NOT post to iZop brand accounts
- Use Guy meta caption template
- Best platforms: LinkedIn, TikTok, Instagram, X
- Optional: skip Pinterest/Facebook for Track B to save time

### Track AB (Series — Both Channels)
- Videos #91–100 post to both channels
- Series continuity matters — don't skip episodes
- Pin Day 1 (#91) on TikTok and Instagram after posting

## iZop Chat Commands Reference

| Task | Chat command |
|------|---------------|
| Schedule one video | "Schedule [video] to [platforms] on [date] at [time]" |
| Schedule a week | "Schedule videos 1–7 to all platforms, one per day starting July 1" |
| Bulk reply after posting | "Reply to all comments on today's posts in my brand voice" |
| Weekly analytics | "What performed best this week across all platforms?" |
| Check schedule | "Show my scheduled posts for the next 7 days" |

## Post-Schedule Verification

After scheduling all 100 videos:

- [ ] Visual calendar shows 50 days of content (2 posts/day minimum)
- [ ] No date gaps (except intentional buffer days)
- [ ] iZop brand: ~85 videos scheduled (Track A + AB)
- [ ] Guy personal: ~100 videos scheduled (all tracks)
- [ ] All UTM links use correct platform parameter
- [ ] First video goes live on July 1, 2026

## Ongoing Maintenance (15 min/day)

| Task | Frequency | Tool |
|------|-----------|------|
| Reply to comments | Daily | iZop bulk reply |
| Check UTM signups | Weekly | GA4 / analytics |
| Note top performers | Weekly | Update CSV with view counts |
| Plan Series 2 | Monthly | Top 5 videos → 10 new concepts |
