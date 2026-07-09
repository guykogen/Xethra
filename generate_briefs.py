#!/usr/bin/env python3
"""Generate izop-100-video-briefs.csv with full Seedance prompts, scripts, and captions."""

import csv
import json
from datetime import date, timedelta
from pathlib import Path

START_DATE = date(2026, 7, 1)  # Day 1 of posting calendar (after production sprint)

VIDEOS = [
    # Pillar 1 — Extreme Locations (Track A)
    {"id": 1, "pillar": "Extreme Locations", "track": "A", "hook": "I'm on a volcano. iZop is handling my socials.",
     "concept": "lying on active volcano rim, lava glow below",
     "scene_action": "lying calmly on dark volcanic rock ridge, lava glow flickering below, steam drifting",
     "environment": "volcano crater with orange lava rivers and dark sky",
     "lighting": "dramatic volcanic rim light, orange underglow",
     "ambient": "distant lava rumble, wind",
     "style": "premium cinematic UGC, Ridley Scott landscape scale",
     "cam_wide": "slow aerial drone pull-out revealing volcano crater",
     "cam_mid": "smooth gimbal slow dolly in, eye-level",
     "cam_close": "locked-off static",
     "expr_wide": "eyes closed, peaceful",
     "expr_mid": "opens eyes, confident direct eye contact, relaxed half-smile",
     "expr_close": "slight knowing smirk",
     "script": "People ask how I stay consistent on social. Honestly? I'm up here on a volcano. iZop AI is down there — scheduling, replying, posting across all 8 platforms. Stop managing social media. Start talking to it.",
     "benefit": "Schedule, reply, and publish across 8 platforms — all from one chat.",
     "series": "extreme_places"},
    {"id": 2, "pillar": "Extreme Locations", "track": "A", "hook": "Posting from space while I float.",
     "concept": "floating in ISS cupola, Earth through window",
     "scene_action": "floating weightlessly in ISS cupola module, Earth visible through panoramic window",
     "environment": "International Space Station interior, blue Earth curve below",
     "lighting": "cool space station LED mixed with warm Earth glow through window",
     "ambient": "subtle station hum, muffled silence",
     "style": "NASA documentary cinematic, Interstellar aesthetic",
     "cam_wide": "slow crane pull-back revealing full cupola and Earth",
     "cam_mid": "smooth gimbal slow orbit 25° right, eye-level",
     "cam_close": "locked-off static",
     "expr_wide": "awe-struck wonder, slow blink",
     "expr_mid": "calm direct eye contact, gentle smile",
     "expr_close": "confident eyebrow raise",
     "script": "Zero gravity. Zero signal problems. iZop AI keeps my socials live on Earth while I float up here. Eight platforms. One conversation. Try it free at izop.ai.",
     "benefit": "Your socials run 24/7 even when you're completely offline.",
     "series": "extreme_places"},
    {"id": 3, "pillar": "Extreme Locations", "track": "A", "hook": "Deep sea. My posts still surface.",
     "concept": "deep-sea sub viewport, bioluminescent dark",
     "scene_action": "seated inside deep-sea submarine, face lit by bioluminescent glow through viewport",
     "environment": "dark ocean depths, jellyfish and bioluminescent particles outside glass",
     "lighting": "blue-green bioluminescent rim light on face, dark interior",
     "ambient": "deep ocean pressure hum, sonar ping",
     "style": "James Cameron deep-sea documentary cinematic",
     "cam_wide": "slow dolly out revealing submarine interior and viewport",
     "cam_mid": "smooth gimbal slow push-in, eye-level",
     "cam_close": "locked-off static",
     "expr_wide": "curious calm, studying viewport",
     "expr_mid": "turns to camera, relaxed smile",
     "expr_close": "knowing wink",
     "script": "Two miles under the ocean. No Wi-Fi down here — but iZop AI already scheduled today's posts, replied to comments, and pulled my analytics. Stop managing social media. Start talking to it.",
     "benefit": "Set it once. Your social presence stays active everywhere.",
     "series": "extreme_places"},
    {"id": 4, "pillar": "Extreme Locations", "track": "A", "hook": "Lion walked by. Didn't check my phone.",
     "concept": "safari jeep, lion passes unfazed",
     "scene_action": "sitting relaxed in open safari jeep, lion walks past unfazed in background",
     "environment": "African savanna golden grassland, acacia trees",
     "lighting": "golden hour warm sunlight, dust particles",
     "ambient": "savanna wind, distant lion rumble",
     "style": "National Geographic premium documentary",
     "cam_wide": "slow aerial drone pull-out revealing jeep and lion",
     "cam_mid": "smooth gimbal slow truck left, eye-level",
     "cam_close": "locked-off static",
     "expr_wide": "completely unfazed, arms on jeep rail",
     "expr_mid": "casual direct eye contact, half-smile",
     "expr_close": "slight shrug, confident",
     "script": "A lion just walked past my jeep. I didn't check my phone once. iZop AI is handling comments, DMs, and posts across every platform. That's what a real social media manager looks like.",
     "benefit": "Bulk-reply to comments and DMs in your brand voice — from one chat.",
     "series": "extreme_places"},
    {"id": 5, "pillar": "Extreme Locations", "track": "A", "hook": "North Pole vibes. Warm replies handled.",
     "concept": "North Pole ice fishing hut, aurora above",
     "scene_action": "sitting inside ice fishing hut, aurora borealis visible through small window",
     "environment": "Arctic ice fishing hut interior, snow outside, green aurora sky",
     "lighting": "warm lantern glow inside, cool aurora green through window",
     "ambient": "wind howling outside, ice cracking faintly",
     "style": "Arctic expedition cinematic, cozy contrast",
     "cam_wide": "slow dolly out revealing hut interior and aurora window",
     "cam_mid": "smooth gimbal slow dolly in, eye-level",
     "cam_close": "locked-off static",
     "expr_wide": "cozy relaxed, holding warm mug",
     "expr_mid": "warm direct eye contact, friendly smile",
     "expr_close": "playful smirk",
     "script": "Cold outreach? iZop AI handles the warm replies. I'm ice fishing at the North Pole and my DMs, comments, and scheduled posts are all taken care of. Free to start — no credit card.",
     "benefit": "Never miss a lead in comments or DMs — iZop flags buyer intent automatically.",
     "series": "extreme_places"},
    {"id": 6, "pillar": "Extreme Locations", "track": "A", "hook": "Hands free on a cliff edge.",
     "concept": "free-solo cliff ledge, hands relaxed",
     "scene_action": "standing calmly on narrow cliff ledge, valley drop below, hands completely relaxed at sides",
     "environment": "dramatic mountain cliff, vast valley below, cloudy sky",
     "lighting": "dramatic side light, golden edge rim on silhouette",
     "ambient": "wind gusts, distant eagle cry",
     "style": "Free Solo documentary cinematic, vertigo scale",
     "cam_wide": "slow aerial drone pull-out revealing cliff scale and valley",
     "cam_mid": "smooth gimbal slow dolly in, eye-level",
     "cam_close": "locked-off static",
     "expr_wide": "zen calm, eyes on horizon",
     "expr_mid": "turns to camera, fearless half-smile",
     "expr_close": "confident nod",
     "script": "Both hands free. No phone. No panic. iZop AI scheduled my week, replied to today's comments, and posted across 8 platforms. Stop juggling. Start talking to your social media.",
     "benefit": "Schedule a full week of posts from one conversation.",
     "series": "extreme_places"},
    {"id": 7, "pillar": "Extreme Locations", "track": "A", "hook": "Desert heat. Cool analytics inside.",
     "concept": "Sahara dunes, heat shimmer horizon",
     "scene_action": "sitting on top of sand dune, heat shimmer on horizon, scarf blowing gently",
     "environment": "endless Sahara sand dunes, orange sunset sky",
     "lighting": "golden sunset rim light, warm orange tones",
     "ambient": "desert wind, sand shifting",
     "style": "Lawrence of Arabia cinematic epic scale",
     "cam_wide": "slow aerial drone pull-out revealing dune sea",
     "cam_mid": "smooth gimbal slow orbit 20° left, eye-level",
     "cam_close": "locked-off static",
     "expr_wide": "contemplative peace, gazing at horizon",
     "expr_mid": "direct eye contact, relaxed confidence",
     "expr_close": "knowing smile",
     "script": "Out here in the Sahara, I asked iZop AI which posts performed best last week. Plain English answer. No dashboard diving. That's the social media manager I built — and you can try it free.",
     "benefit": "Ask analytics questions in plain English — no dashboard required.",
     "series": "extreme_places"},
    {"id": 8, "pillar": "Extreme Locations", "track": "A", "hook": "Middle of the ocean. Posts still sailing.",
     "concept": "yacht middle of ocean, no signal needed",
     "scene_action": "lounging on yacht deck chair, endless blue ocean horizon, drink in hand",
     "environment": "luxury yacht deck, open ocean, clear blue sky",
     "lighting": "bright midday sun, white yacht reflections",
     "ambient": "gentle waves, yacht creaking",
     "style": "luxury lifestyle cinematic, high-end brand ad",
     "cam_wide": "slow aerial drone pull-out revealing yacht in open ocean",
     "cam_mid": "smooth gimbal slow dolly in, eye-level",
     "cam_close": "locked-off static",
     "expr_wide": "complete relaxation, sunglasses pushed up",
     "expr_mid": "direct eye contact, casual smile",
     "expr_close": "playful eyebrow raise",
     "script": "No signal out here. Doesn't matter — iZop AI already published today's content to Instagram, TikTok, LinkedIn, and five more platforms. Your socials shouldn't need you online 24/7.",
     "benefit": "Publish to all 8 platforms from one dashboard — even when you're offline.",
     "series": "extreme_places"},
    {"id": 9, "pillar": "Extreme Locations", "track": "A", "hook": "Jungle silence. Socials still loud.",
     "concept": "Amazon hammock, jungle sounds",
     "scene_action": "lying in hammock between trees, dense jungle canopy above",
     "environment": "Amazon rainforest, lush green canopy, misty atmosphere",
     "lighting": "dappled green-filtered sunlight through leaves",
     "ambient": "jungle birds, distant howler monkey, leaves rustling",
     "style": "survival documentary cinematic, lush natural",
     "cam_wide": "slow crane down revealing hammock in jungle",
     "cam_mid": "smooth gimbal slow push-in, eye-level",
     "cam_close": "locked-off static",
     "expr_wide": "eyes closed, peaceful sway",
     "expr_mid": "opens eyes, calm direct gaze",
     "expr_close": "soft knowing smile",
     "script": "The jungle is silent. My socials are not — because iZop AI is posting, replying, and brainstorming content ideas in my brand voice. Tell it your niche once. Ask for ideas anytime.",
     "benefit": "AI brainstorms content hooks from your top-performing posts.",
     "series": "extreme_places"},
    {"id": 10, "pillar": "Extreme Locations", "track": "A", "hook": "Geyser erupting. I'm chill.",
     "concept": "Yellowstone geyser eruption backdrop",
     "scene_action": "sitting calmly on bench as massive geyser erupts behind, steam rising dramatically",
     "environment": "Yellowstone National Park, Old Faithful geyser eruption, boardwalk",
     "lighting": "bright daylight, steam backlit creating halo effect",
     "ambient": "geyser roar, steam hiss, crowd murmur distant",
     "style": "nature documentary cinematic, dramatic scale contrast",
     "cam_wide": "slow dolly out revealing geyser eruption scale behind subject",
     "cam_mid": "smooth gimbal slow orbit 15° right, eye-level",
     "cam_close": "locked-off static",
     "expr_wide": "completely unbothered, reading nothing",
     "expr_mid": "turns to camera, amused smile",
     "expr_close": "confident smirk",
     "script": "Things are erupting behind me. My comment section? Handled. iZop AI bulk-replies in my voice and flags leads from the thread. Stop drowning in notifications. Start talking to iZop.",
     "benefit": "Bulk-reply to hundreds of comments in your brand voice instantly.",
     "series": "extreme_places"},
]

# Continue with remaining 90 videos - I'll add them in the script via a function that builds from compact data

def build_prompt(v):
    return f"""9:16 vertical cinematic short-form ad, 12 seconds, shallow depth of field, 35mm film grain.

Reference: Guy Kogen personal avatar — consistent face identity, short dark hair, casual smart attire.

[0:00-0:03] Wide establishing shot: Guy Kogen {v['scene_action']}. Subject still or slow natural movement only. Camera: {v['cam_wide']}. Expression: {v['expr_wide']}. Lighting: {v['lighting']}.

[0:03-0:08] Medium close-up: Guy speaks directly to lens, subtle natural head tilt, one hand relaxed gesture. Camera: {v['cam_mid']}. Expression: {v['expr_mid']}.

[0:08-0:12] Extreme close-up on face. Camera: {v['cam_close']}. Expression: {v['expr_close']}. Lighting: {v['lighting']}.

Audio: {v['ambient']}, no music, clear dialogue space.
Style: {v['style']}.
Constraints: stable face identity, no warped hands, no jitter, no morphing background, lip-sync ready, no text overlays."""

def build_izop_caption(v):
    return f"""{v['hook']}

{v['benefit']}

Stop managing social media. Start talking to it.
Try free → https://izop.ai?utm_source={{platform}}&utm_medium=izop_brand&utm_campaign={v.get('series', 'general')}

#socialmediamanager #aicontent #contentcreator #smallbusiness #izopai"""

def build_guy_caption_a(v):
    return f"""I made this AI video in under 5 minutes.

The concept: {v['concept']}
The tool I use to post everywhere: iZop AI (link in bio)

Want the full Seedance prompt? Comment "PROMPT"

#seedance #aivideo #contentcreation #buildinpublic #socialmediatips"""

def build_guy_caption_b(v):
    cam = v.get('cam_mid', 'smooth gimbal orbit')
    return f"""Here's exactly how I made this:

1. Seedance timeline prompt with {cam.split(',')[0]}
2. 12-second script, one avatar reference
3. Scheduled to 8 platforms with iZop AI

Steal the prompt — comment "PROMPT". Free tool: izop.ai

#aiavatar #seedance2 #shortformvideo #startup #creatoreconomy"""

def scheduled_date(video_id):
    day_offset = (video_id - 1) // 2
    return (START_DATE + timedelta(days=day_offset)).isoformat()

def slot_time(video_id):
    return "09:00 ET" if video_id % 2 == 1 else "18:00 ET"

def load_all_videos():
    all_videos = VIDEOS.copy()
    base = Path(__file__).parent
    for part in ["videos_data_part1.json", "videos_data_part2.json",
                 "videos_data_part3.json", "videos_data_part4.json"]:
        path = base / part
        if path.exists():
            with open(path) as f:
                all_videos.extend(json.load(f))
    all_videos.sort(key=lambda v: v["id"])
    return all_videos


if __name__ == "__main__":
    all_videos = load_all_videos()

    out_path = Path(__file__).parent / "izop-100-video-briefs.csv"
    fieldnames = [
        "ID", "Pillar", "Track", "Hook", "Concept", "Script", "Seedance Prompt",
        "Status", "Video URL", "iZop Caption", "Guy Caption", "Hashtags",
        "UTM Campaign", "Scheduled Date", "Slot Time", "Platforms Posted", "Series"
    ]

    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for v in all_videos:
            track = v["track"]
            if track == "B":
                guy_cap = build_guy_caption_b(v)
                izop_cap = ""
            elif track == "AB":
                guy_cap = build_guy_caption_a(v)
                izop_cap = build_izop_caption(v)
            else:
                guy_cap = build_guy_caption_a(v)
                izop_cap = build_izop_caption(v)
            writer.writerow({
                "ID": v["id"],
                "Pillar": v["pillar"],
                "Track": track,
                "Hook": v["hook"],
                "Concept": v["concept"],
                "Script": v["script"],
                "Seedance Prompt": build_prompt(v),
                "Status": "pending",
                "Video URL": "",
                "iZop Caption": izop_cap,
                "Guy Caption": guy_cap,
                "Hashtags": "#izopai #seedance #aivideo #socialmediamanager #contentcreator",
                "UTM Campaign": v.get("series", "general"),
                "Scheduled Date": scheduled_date(v["id"]),
                "Slot Time": slot_time(v["id"]),
                "Platforms Posted": "",
                "Series": v.get("series", ""),
            })

    print(f"Wrote {len(all_videos)} videos to {out_path}")
