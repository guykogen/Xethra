# Seedance Prompt Template — iZop AI Video Engine

Reusable template for all 100 Guy Kogen avatar videos. Every prompt follows Seedance 2.0 best practices.

## Rules

1. **One camera move per beat** — never stack pan + dolly + tilt in the same beat
2. **Separate subject motion from camera motion** — describe what Guy does and what the camera does independently
3. **Timeline format** — three beats for 12-second videos: wide (0–3s), medium (3–8s), close-up (8–12s)
4. **60–100 words** per prompt — every word must direct the shot
5. **9:16 vertical** for all short-form platforms
6. **Same avatar reference** — use identical reference images every generation

## Master Template

```
9:16 vertical cinematic short-form ad, 12 seconds, shallow depth of field, 35mm film grain.

Reference: Guy Kogen personal avatar — consistent face identity, short dark hair, casual smart attire.

[0:00-0:03] Wide establishing shot: Guy Kogen [SCENE ACTION — subject still or slow movement only].
Camera: [ONE CAMERA MOVE — e.g., slow aerial drone pull-out].
Expression: [WIDE BEAT EXPRESSION].
Lighting: [DRAMATIC NATURAL LIGHT].

[0:03-0:08] Medium close-up: Guy speaks directly to lens, subtle natural head tilt, one hand relaxed gesture.
Camera: [ONE CAMERA MOVE — e.g., smooth gimbal slow orbit 20° left, eye-level].
Expression: [MID BEAT — direct eye contact, conversational warmth].

[0:08-0:12] Extreme close-up on face.
Camera: locked-off static, hold steady.
Expression: [CLOSE BEAT — knowing smile, eyebrow raise on punchline].

Audio: [AMBIENT SOUNDS], no music, clear dialogue space.
Style: [AESTHETIC KEYWORDS].
Constraints: stable face identity, no warped hands, no jitter, no morphing background, lip-sync ready, no text overlays.
```

## Camera Vocabulary (Seedance understands these)

| Move | Term | Best for |
|------|------|----------|
| Push in | `slow dolly in` / `push-in` | Emotional focus, intimacy |
| Pull out | `slow aerial drone pull-out` | Reveal scale, establishing |
| Orbit | `smooth gimbal slow orbit 20° left` | Dynamic medium shots |
| Track | `smooth gimbal slow truck left` | Following action |
| Arc | `smooth arc shot 30° around subject` | Product/demo reveals |
| Handheld | `slow handheld push-in, subtle natural shake` | Authentic UGC feel |
| Static | `locked-off static` | Close-ups, punchlines |
| Crane | `slow crane down` | Descending reveals |
| Over-shoulder | `smooth gimbal slow push-in, over-shoulder` | Screen/demo shots |

## Fallback Prompt (when generation fails)

If a complex prompt fails, simplify to locked-off close-ups:

```
9:16 vertical, 12 seconds, clean studio background.

Reference: Guy Kogen avatar — consistent face identity.

[0:00-0:04] Medium close-up: Guy speaks directly to camera, calm confident posture.
Camera: locked-off static, eye-level.
Expression: direct eye contact, conversational.

[0:04-0:08] Medium close-up: Guy continues speaking, subtle hand gesture.
Camera: slow subtle dolly in.
Expression: engaged, warm.

[0:08-0:12] Close-up on face.
Camera: locked-off static.
Expression: knowing smile.

Constraints: stable face identity, no warped hands, no jitter, lip-sync ready.
```

---

## Gold Prompts — One Per Pillar

### Pillar 1: Extreme Locations (Video #1 — Volcano)

**Script:** People ask how I stay consistent on social. Honestly? I'm up here on a volcano. iZop AI is down there — scheduling, replying, posting across all 8 platforms. Stop managing social media. Start talking to it.

```
9:16 vertical cinematic, 12 seconds, 35mm grain, shallow DOF.

Reference: Guy Kogen avatar — consistent face, casual dark jacket.

[0:00-0:03] Wide establishing: Guy Kogen lying calmly on dark volcanic rock ridge, lava glow flickering below, steam drifting. Subject still, breathing slow. Camera: slow aerial drone pull-out revealing volcano crater and orange lava rivers. Expression: eyes closed, peaceful. Lighting: dramatic volcanic rim light, orange underglow, dark sky.

[0:03-0:08] Medium close-up: Guy opens eyes, speaks to camera, relaxed half-smile, right hand resting behind head. Camera: smooth gimbal slow dolly in, eye-level. Expression: confident, direct eye contact.

[0:08-0:12] Extreme close-up on face, slight knowing smirk. Camera: locked-off static. Volcanic orange rim light on cheek.

Audio: distant lava rumble, wind, no music.
Style: premium cinematic UGC, Ridley Scott landscape scale.
Constraints: stable face identity, no warped hands, no jitter, lip-sync ready, no on-screen text.
```

### Pillar 2: Time Freedom (Video #11 — 3am Sleep)

**Script:** It's 3am. I'm asleep. At 6am, iZop AI publishes to Instagram, TikTok, LinkedIn, and five more platforms. I set it up in one conversation yesterday. Stop losing sleep over social media.

```
9:16 vertical cinematic short-form ad, 12 seconds, shallow depth of field, 35mm film grain.

Reference: Guy Kogen personal avatar — consistent face identity, short dark hair, casual smart attire.

[0:00-0:03] Wide establishing shot: Guy Kogen sleeping peacefully in bed, phone face-down on nightstand with dark screen. Subject still, breathing slow. Camera: slow dolly out revealing bedroom and nightstand. Expression: deep sleep, peaceful. Lighting: soft blue moonlight, deep shadows.

[0:03-0:08] Medium close-up: Guy stirs slightly, sleepy half-smile to camera, subtle natural head tilt. Camera: smooth gimbal slow push-in from foot of bed, eye-level. Expression: drowsy knowing smile.

[0:08-0:12] Extreme close-up on face. Camera: locked-off static, hold steady. Expression: drowsy knowing smile.

Audio: quiet room tone, distant clock tick, no music, clear dialogue space.
Style: intimate cinematic, calm luxury ad.
Constraints: stable face identity, no warped hands, no jitter, no morphing background, lip-sync ready, no text overlays.
```

### Pillar 3: Pain Points (Video #21 — Notification Avalanche)

**Script:** 47 notifications. 12 DMs. 200 comments. Or — one message to iZop AI: reply to all. Bulk replies in your brand voice. Flag leads from the thread. Done in minutes.

```
9:16 vertical cinematic short-form ad, 12 seconds, shallow depth of field, 35mm film grain.

Reference: Guy Kogen personal avatar — consistent face identity, short dark hair, casual smart attire.

[0:00-0:03] Wide establishing shot: Guy Kogen sitting at desk overwhelmed as glowing notification bubbles pile up around head and shoulders. Subject still or slow natural movement only. Camera: slow dolly out revealing notification avalanche scale. Expression: overwhelmed panic, hands on head. Lighting: harsh screen glow, stressed blue tones.

[0:03-0:08] Medium close-up: Guy speaks directly to lens, calm returns, deep breath, direct eye contact. Camera: smooth gimbal slow push-in, eye-level. Expression: relieved confident smile.

[0:08-0:12] Extreme close-up on face. Camera: locked-off static, hold steady. Expression: relieved confident smile.

Audio: notification ping sounds overwhelming then silence, no music, clear dialogue space.
Style: surreal cinematic metaphor, high-end VFX aesthetic.
Constraints: stable face identity, no warped hands, no jitter, no morphing background, lip-sync ready, no text overlays.
```

### Pillar 4: Feature Metaphors (Video #31 — Schedule My Week)

**Script:** Hey iZop, schedule my week. That's it. Captions drafted. Times picked. Published to every platform. This is what talking to your social media looks like. Stop managing. Start talking.

```
9:16 vertical cinematic short-form ad, 12 seconds, shallow depth of field, 35mm film grain.

Reference: Guy Kogen personal avatar — consistent face identity, short dark hair, casual smart attire.

[0:00-0:03] Wide establishing shot: Guy Kogen holding phone casually like talking to a friend, relaxed conversational posture. Subject still or slow natural movement only. Camera: slow dolly out revealing kitchen morning scene. Expression: casual phone conversation, smiling. Lighting: warm morning sunlight through window.

[0:03-0:08] Medium close-up: Guy speaks directly to lens, subtle natural head tilt, one hand relaxed gesture. Camera: smooth gimbal slow push-in, eye-level. Expression: direct eye contact, friendly warmth.

[0:08-0:12] Extreme close-up on face. Camera: locked-off static, hold steady. Expression: satisfied nod.

Audio: kitchen morning sounds, coffee pour, no music, clear dialogue space.
Style: casual UGC cinematic, authentic.
Constraints: stable face identity, no warped hands, no jitter, no morphing background, lip-sync ready, no text overlays.
```

### Pillar 5: Persona Callouts (Video #43 — Agency Plates)

**Script:** Agency owners: stop spinning plates. iZop AI manages all clients — scheduling, DMs, AI replies, reporting. Replace three subscriptions. Ten brands. Unlimited team seats.

```
9:16 vertical cinematic short-form ad, 12 seconds, shallow depth of field, 35mm film grain.

Reference: Guy Kogen personal avatar — consistent face identity, short dark hair, casual smart attire.

[0:00-0:03] Wide establishing shot: Guy Kogen spinning multiple plates metaphor, then calmly setting them down. Subject still or slow natural movement only. Camera: slow dolly out revealing plate spin scene. Expression: controlled plate spinning stress. Lighting: professional office lighting.

[0:03-0:08] Medium close-up: Guy speaks directly to lens, plates settle, relief smile. Camera: smooth gimbal slow push-in, eye-level. Expression: confident agency leader.

[0:08-0:12] Extreme close-up on face. Camera: locked-off static, hold steady. Expression: confident agency leader.

Audio: plate spin then calm settle, no music, clear dialogue space.
Style: agency professional cinematic metaphor.
Constraints: stable face identity, no warped hands, no jitter, no morphing background, lip-sync ready, no text overlays.
```

### Pillar 6: Absurdist Hooks (Video #54 — Talk to Socials)

**Script:** I don't manage social media. I talk to it. Hey iZop, what performed best this week? Schedule my posts. Reply to comments. That's the whole job. Stop managing. Start talking.

```
9:16 vertical cinematic short-form ad, 12 seconds, shallow depth of field, 35mm film grain.

Reference: Guy Kogen personal avatar — consistent face identity, short dark hair, casual smart attire.

[0:00-0:03] Wide establishing shot: Guy Kogen casually chatting with phone held like a coffee cup, leaning against wall. Subject still or slow natural movement only. Camera: slow tracking shot along wall lean. Expression: casual wall lean, phone chat. Lighting: golden hour warm street light.

[0:03-0:08] Medium close-up: Guy speaks directly to lens, subtle natural head tilt. Camera: smooth gimbal slow push-in, eye-level. Expression: direct eye contact, conversational warmth.

[0:08-0:12] Extreme close-up on face. Camera: locked-off static, hold steady. Expression: tagline delivery smirk.

Audio: city ambience, casual conversation tone, no music, clear dialogue space.
Style: street style cinematic UGC.
Constraints: stable face identity, no warped hands, no jitter, no morphing background, lip-sync ready, no text overlays.
```

### Pillar 7: Before/After (Video #69 — 4 Hours to 20 Minutes)

**Script:** Four hours daily on social media. Or twenty minutes with iZop AI. Schedule the week. Bulk reply. Check analytics. Done. What would you do with three hours and forty minutes back?

```
9:16 vertical cinematic short-form ad, 12 seconds, shallow depth of field, 35mm film grain.

Reference: Guy Kogen personal avatar — consistent face identity, short dark hair, casual smart attire.

[0:00-0:03] Wide establishing shot: Guy Kogen at desk with large clock visual metaphor spinning four hours. Subject still or slow natural movement only. Camera: slow dolly out revealing clock metaphor. Expression: exhausted at long clock. Lighting: time-lapse harsh to efficient clean.

[0:03-0:08] Medium close-up: Guy speaks directly to lens, twenty minutes done, disbelief smile. Camera: smooth gimbal slow push-in, eye-level. Expression: time-is-money nod.

[0:08-0:12] Extreme close-up on face. Camera: locked-off static, hold steady. Expression: time-is-money nod.

Audio: clock ticking fast then stop, no music, clear dialogue space.
Style: time compression cinematic.
Constraints: stable face identity, no warped hands, no jitter, no morphing background, lip-sync ready, no text overlays.
```

### Pillar 8: Guy Meta How-To (Video #71 — 3 Minutes)

**Script:** This video took 3 minutes to make. One Seedance prompt. One avatar. Scheduled to 8 platforms with iZop. Stop overthinking content. Start batching.

```
9:16 vertical, 12 seconds, clean modern creator studio aesthetic.

Reference: Guy Kogen avatar, same face identity, casual t-shirt.

[0:00-0:03] Medium shot: Guy at minimal desk with laptop glow, turns to camera mid-typing. Camera: slow handheld push-in, subtle natural shake. Expression: excited reveal energy. Lighting: soft key light, monitor fill.

[0:03-0:08] Over-shoulder POV: laptop screen showing Seedance interface blur. Guy gestures at screen with left hand. Camera: smooth arc shot 30° around subject. Expression: teaching mode, engaged.

[0:08-0:12] Close-up: Guy points at camera lens. Camera: quick subtle dolly in. Expression: confident challenge smirk.

Audio: keyboard clicks, room tone, no music.
Style: creator tutorial aesthetic, clean, high-end.
Constraints: stable face, no UI text legibility needed, no jitter, lip-sync ready.
```

### Pillar 9: Guy Meta Results (Video #81 — 100K Views)

**Script:** This volcano video hit 100K views. One Seedance prompt. Absurdist hook. Scheduled everywhere with iZop. The formula: extreme location plus product benefit plus cinematic camera moves.

```
9:16 vertical, 12 seconds, creator results aesthetic.

Reference: Guy Kogen avatar, same face identity.

[0:00-0:03] Medium shot: Guy showing phone with view count to camera, excited but grounded. Camera: slow dolly in toward phone reveal. Expression: showing phone screen to camera. Lighting: phone screen glow on face.

[0:03-0:08] Medium close-up: Guy speaks directly to lens with excited but grounded reaction. Camera: smooth gimbal slow push-in, eye-level. Expression: humble flex smile.

[0:08-0:12] Close-up on face. Camera: locked-off static. Expression: humble flex smile.

Audio: notification celebration subtle, room tone, no music.
Style: results reveal cinematic UGC.
Constraints: stable face identity, no jitter, lip-sync ready.
```

### Pillar 10: Series Formats (Video #91 — Day 1)

**Script:** Day 1 of not touching my socials. iZop AI is scheduling, replying, and posting across 8 platforms. I'll check in tomorrow. Follow along.

```
9:16 vertical cinematic short-form ad, 12 seconds, shallow depth of field, 35mm film grain.

Reference: Guy Kogen personal avatar — consistent face identity, short dark hair, casual smart attire.

[0:00-0:03] Wide establishing shot: Guy Kogen holding up day 1 sign, phone deliberately in drawer visible. Subject still or slow natural movement only. Camera: slow dolly out revealing phone in drawer. Expression: holding day 1 sign proudly. Lighting: bright optimistic morning light.

[0:03-0:08] Medium close-up: Guy speaks directly to lens, series energy. Camera: smooth gimbal slow push-in, eye-level. Expression: commitment smile.

[0:08-0:12] Extreme close-up on face. Camera: locked-off static, hold steady. Expression: commitment smile.

Audio: morning birds, fresh start, no music, clear dialogue space.
Style: series episode 1 cinematic vlog.
Constraints: stable face identity, no warped hands, no jitter, no morphing background, lip-sync ready, no text overlays.
```
