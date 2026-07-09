#!/usr/bin/env python3
"""Poll Xethra jobs, download completed variants, update campaign + CSV status."""

from __future__ import annotations

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from campaign_store import CampaignState, update_csv_status
from config import RAW_DIR, Settings
from xethra_client import XethraClient


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--select-first",
        action="store_true",
        help="Copy first succeeded variant to selected/ and mark CSV generated",
    )
    return parser.parse_args()


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def main() -> None:
    args = parse_args()
    settings = Settings.from_env()
    settings.require_agent_key()

    state = CampaignState.load()
    client = XethraClient(settings)
    jobs = client.list_jobs(sync=True)
    jobs_by_id = {job.get("id"): job for job in jobs if job.get("id")}

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    downloaded = 0
    updated = 0

    for key, record in state.videos.items():
        for variant in record.variants:
            job = jobs_by_id.get(variant.job_id)
            if not job:
                continue

            variant.status = job.get("status", variant.status)
            variant.task_id = job.get("taskId") or variant.task_id
            variant.video_url = job.get("videoUrl") or variant.video_url
            variant.error = job.get("error") or variant.error
            variant.updated_at = _now()
            updated += 1

            if variant.status != "succeeded" or not variant.video_url:
                continue
            if variant.local_path and Path(variant.local_path).exists():
                continue

            filename = f"video_{record.video_id:03d}_{variant.variant}.mp4"
            dest = RAW_DIR / filename
            print(f"[download] #{record.video_id:03d} {variant.variant} -> {dest.name}")
            client.download_file(variant.video_url, str(dest))
            variant.local_path = str(dest)
            downloaded += 1

        if args.select_first and not record.selected_variant:
            for variant in record.variants:
                if variant.status == "succeeded" and variant.local_path:
                    record.selected_variant = variant.variant
                    selected_dest = Path(__file__).resolve().parents[1] / "selected" / f"video_{record.video_id:03d}.mp4"
                    selected_dest.parent.mkdir(parents=True, exist_ok=True)
                    selected_dest.write_bytes(Path(variant.local_path).read_bytes())
                    update_csv_status(
                        record.video_id,
                        status="generated",
                        video_url=str(selected_dest),
                    )
                    print(f"[selected] #{record.video_id:03d} -> {selected_dest.name}")
                    break

    state.save()
    print(f"\nDone. Job records updated: {updated}, downloaded: {downloaded}")


if __name__ == "__main__":
    main()
