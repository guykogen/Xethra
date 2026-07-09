#!/usr/bin/env python3
"""Queue Seedance videos from izop-100-video-briefs.csv via Xethra API."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from campaign_store import (
    CampaignState,
    VariantRecord,
    get_video_record,
    read_briefs,
    variant_count,
)
from config import Settings
from xethra_client import XethraClient


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", type=int, default=1, help="First video ID (inclusive)")
    parser.add_argument("--end", type=int, default=20, help="Last video ID (inclusive)")
    parser.add_argument(
        "--variants",
        type=int,
        default=2,
        help="Variants to queue per video (default: 2)",
    )
    parser.add_argument(
        "--reference-url",
        help="Override REFERENCE_IMAGE_URL for avatar reference mode",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print actions without calling Xethra",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    settings = Settings.from_env()
    if not args.dry_run:
        settings.require_agent_key()

    briefs = read_briefs()
    state = CampaignState.load()
    client = XethraClient(settings)
    reference_url = args.reference_url or settings.reference_image_url

    queued = 0
    skipped = 0

    for row in briefs:
        video_id = int(row["ID"])
        if video_id < args.start or video_id > args.end:
            continue

        prompt = row.get("Seedance Prompt", "").strip()
        hook = row.get("Hook", "").strip()
        if not prompt:
            print(f"[skip] #{video_id:03d} missing Seedance Prompt")
            skipped += 1
            continue

        existing = variant_count(state, video_id)
        needed = max(0, args.variants - existing)
        if needed == 0:
            print(f"[skip] #{video_id:03d} already has {existing} variant(s)")
            skipped += 1
            continue

        record = get_video_record(state, video_id, hook)
        for index in range(existing + 1, existing + needed + 1):
            variant = f"v{index}"
            campaign_label = f"izop-video-{video_id:03d}-{variant}"

            if args.dry_run:
                print(f"[dry-run] queue #{video_id:03d} {variant}: {hook[:60]}...")
                queued += 1
                continue

            print(f"[queue] #{video_id:03d} {variant}: {hook[:60]}...")
            result = client.queue_video(
                prompt=prompt,
                campaign_label=campaign_label,
                reference_image_url=reference_url,
            )
            job = result.get("job") or {}
            record.variants.append(
                VariantRecord(
                    variant=variant,
                    job_id=result.get("jobId") or job.get("id", ""),
                    task_id=result.get("taskId") or job.get("taskId"),
                    status=job.get("status", "running"),
                )
            )
            queued += 1

        state.save()

    print(f"\nDone. Queued: {queued}, skipped: {skipped}")


if __name__ == "__main__":
    main()
