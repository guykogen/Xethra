# UTM Tracking — iZop AI Video Campaign

Track signups by platform, channel, and content series.

## Base URL

```
https://izop.ai
```

## UTM Parameter Structure

```
https://izop.ai?utm_source={platform}&utm_medium={channel}&utm_campaign={series}&utm_content=video_{id}
```

### Parameters

| Parameter | Values | Example |
|-----------|--------|---------|
| `utm_source` | Platform name | `tiktok`, `instagram`, `youtube`, `facebook`, `x`, `linkedin`, `threads`, `pinterest` |
| `utm_medium` | Account channel | `izop_brand`, `guy_personal` |
| `utm_campaign` | Content series | See campaign list below |
| `utm_content` | Video identifier | `video_001`, `video_071` |

## Campaign Names (utm_campaign)

| Series | Videos | utm_campaign value |
|--------|--------|-------------------|
| Extreme Locations | #1–10 | `extreme_places` |
| Time Freedom | #11–20 | `time_freedom` |
| Pain Points | #21–30 | `pain_points` |
| Features | #31–40 | `features` |
| Personas | #41–50 | `personas` |
| Absurdist | #51–60 | `absurdist` |
| Before/After | #61–70 | `before_after` |
| Guy Meta How-To | #71–80 | `guy_meta_howto` |
| Guy Meta Results | #81–90 | `guy_meta_results` |
| Day Series | #91–93 | `day_series` |
| Things I Asked | #94–95 | `things_i_asked` |
| Challenges | #96–98 | `challenges` |
| Weekly Wins | #99 | `weekly_wins` |
| Confessions | #100 | `confessions` |

## Link Templates by Platform

### iZop Brand Accounts

```
TikTok:     https://izop.ai?utm_source=tiktok&utm_medium=izop_brand&utm_campaign={campaign}&utm_content=video_{id}
Instagram:  https://izop.ai?utm_source=instagram&utm_medium=izop_brand&utm_campaign={campaign}&utm_content=video_{id}
YouTube:    https://izop.ai?utm_source=youtube&utm_medium=izop_brand&utm_campaign={campaign}&utm_content=video_{id}
Facebook:   https://izop.ai?utm_source=facebook&utm_medium=izop_brand&utm_campaign={campaign}&utm_content=video_{id}
X:          https://izop.ai?utm_source=x&utm_medium=izop_brand&utm_campaign={campaign}&utm_content=video_{id}
LinkedIn:   https://izop.ai?utm_source=linkedin&utm_medium=izop_brand&utm_campaign={campaign}&utm_content=video_{id}
Threads:    https://izop.ai?utm_source=threads&utm_medium=izop_brand&utm_campaign={campaign}&utm_content=video_{id}
Pinterest:  https://izop.ai?utm_source=pinterest&utm_medium=izop_brand&utm_campaign={campaign}&utm_content=video_{id}
```

### Guy Personal Accounts

Replace `utm_medium=izop_brand` with `utm_medium=guy_personal` in all links above.

### Audit Quiz (alternative CTA for Track B)

```
https://izop.ai/audit?utm_source={platform}&utm_medium=guy_personal&utm_campaign={campaign}&utm_content=video_{id}
```

## Example Links

**Video #1 (Volcano) on TikTok — iZop brand:**
```
https://izop.ai?utm_source=tiktok&utm_medium=izop_brand&utm_campaign=extreme_places&utm_content=video_001
```

**Video #71 (3 Minutes) on LinkedIn — Guy personal:**
```
https://izop.ai?utm_source=linkedin&utm_medium=guy_personal&utm_campaign=guy_meta_howto&utm_content=video_071
```

**Video #91 (Day 1) on Instagram — Guy personal:**
```
https://izop.ai/audit?utm_source=instagram&utm_medium=guy_personal&utm_campaign=day_series&utm_content=video_091
```

## Analytics Setup

### Google Analytics 4 (if configured on izop.ai)

Verify these events fire on signup:
- `sign_up` with UTM parameters attached
- Create exploration: **Acquisition → User acquisition** filtered by `utm_campaign`

### Baseline Metrics to Record (Day 0)

Before campaign launch, record:
- [ ] Daily izop.ai signups (7-day average)
- [ ] Traffic by source (last 30 days)
- [ ] Free → Starter conversion rate

### Weekly Review (15 min every Monday)

| Metric | Source | Action if low |
|--------|--------|---------------|
| Signups by utm_campaign | GA4 / internal analytics | Double down on top 3 series |
| Signups by utm_source | GA4 | Shift posting times on weak platforms |
| guy_personal vs izop_brand | GA4 medium comparison | Adjust caption CTAs |
| Top utm_content (video ID) | GA4 | Create 10 more videos in that style |

### 60-Day Targets

| Metric | Target |
|--------|--------|
| Total campaign signups | Track baseline + 5% lift minimum |
| Top video signups | 1–3 videos drive 20%+ of campaign total |
| guy_personal conversion | Higher intent than izop_brand (expect 2× signup rate) |
| extreme_places series | Highest reach, measure separately from conversion |

## Bio Link Strategy

**iZop brand bios:** `izop.ai?utm_source={primary_platform}&utm_medium=izop_brand&utm_campaign=bio`

**Guy personal bios:** Use Linktree/Beacons or direct link:
```
izop.ai?utm_source=bio&utm_medium=guy_personal&utm_campaign=content_engine
```

Include secondary link to audit quiz for mid-funnel capture.

## CSV Integration

The `UTM Campaign` column in [`izop-100-video-briefs.csv`](izop-100-video-briefs.csv) maps to `utm_campaign`. Replace `{platform}` in caption links when posting to each platform.

Caption templates in the CSV use `{platform}` placeholder — replace with actual platform name at scheduling time.
