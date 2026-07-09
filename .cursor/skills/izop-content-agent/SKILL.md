---
name: izop-content-agent
description: >-
  iZop AI content creation agent using Xethra studio — Seedance video,
  Nano Banana Pro images, asset library references, and batch campaigns.
  Use when generating iZop marketing videos, carousels, motion design,
  SaaS demos, or extending library assets via Xethra.
---

# iZop Content Agent

Xethra studio at https://www.xethra.com/studio is the production hub for iZop AI content.

## Stack

| Capability | Provider | API |
|------------|----------|-----|
| Video | Seedance 2.0 (BytePlus) | `POST /api/generate` or agent chat |
| Images | Nano Banana Pro (Gemini) | `POST /api/images/generate` |
| Agent | Gemini planner + tools | `POST /api/agent/chat` |
| Library | Persistent assets | `GET /api/assets` |

## Brand defaults

- **Tagline:** Stop managing social media. Start talking to it.
- **Site:** https://izop.ai
- **Avatar:** Guy Kogen — consistent face, short dark hair, casual smart attire
- **Reels:** 9:16, 5–10s (Seedance), one camera move per beat
- **Carousels:** 1:1 or 4:5, legible text via Nano Banana Pro
- **Demos:** cinematic 3D UI motion, purple gradient brand

## Studio tabs

1. **Agent** — chat-first Higgsfield-style creation; reference library with `@asset-name`
2. **Library** — all images, videos, uploads; copy `@reference` for agent
3. **Studio** — manual Seedance controls
4. **History** — completed videos
5. **Activity** — job logs

## Agent chat examples

```
Create a 1:1 carousel for iZop with hook "Stop managing social media"
```

```
@my-demo-keyframe animate this into a 9:16 SaaS demo with smooth orbit camera
```

```
Extend @last-reel — continue the motion 10 more seconds, same style
```

## API (external / Cursor automation)

Header: `x-xethra-agent-key: $XETHRA_AGENT_KEY`

```bash
# Agent chat (plans + executes)
curl -X POST https://www.xethra.com/api/agent/chat \
  -H "Content-Type: application/json" \
  -H "x-xethra-agent-key: $XETHRA_AGENT_KEY" \
  -d '{"message":"Create carousel slide for iZop launch"}'

# Direct image (Nano Banana Pro)
curl -X POST https://www.xethra.com/api/images/generate \
  -H "Content-Type: application/json" \
  -H "x-xethra-agent-key: $XETHRA_AGENT_KEY" \
  -d '{"prompt":"iZop AI purple gradient carousel","aspectRatio":"1:1","tags":["carousel"]}'

# Direct video (Seedance)
curl -X POST https://www.xethra.com/api/agent/generate \
  -H "Content-Type: application/json" \
  -H "x-xethra-agent-key: $XETHRA_AGENT_KEY" \
  -d '{"prompt":"9:16 cinematic...","mode":"text","model":"dreamina-seedance-2-0-260128","ratio":"9:16","resolution":"720p","duration":5,"generateAudio":false}'
```

## Campaign briefs

100-video master CSV:
`izop-100-video-briefs.csv` in Content_creation folder.

Seedance prompt rules: `seedance-prompt-template.md` — 3-beat timeline, 60–100 words, lip-sync ready, no text overlays in video.

## Env required on Xethra (Vercel)

- `BYTEPLUS_API_KEY` — Seedance
- `GEMINI_API_KEY` — Nano Banana Pro + agent planner
- `BLOB_READ_WRITE_TOKEN` — library persistence
- `XETHRA_AGENT_KEY` — external agent auth

Optional:
- `GEMINI_IMAGE_MODEL=gemini-2.0-flash-preview-image-generation`
- `GEMINI_CHAT_MODEL=gemini-2.5-flash`

## Workflow

1. Generate keyframes in **Library** (Nano Banana Pro) or upload brand assets
2. Reference in **Agent** with `@slug` or sidebar quick-pick
3. Agent creates image and/or queues Seedance video
4. Completed videos auto-save to **Library**
5. **Extend** by asking agent to continue from a library video/image
6. Download from History; post via iZop scheduling guide

## Production model

Use **Seedance 2.0** (`dreamina-seedance-2-0-260128`) for final iZop content, not Mini or 1.0 fast (except tests).
