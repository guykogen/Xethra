#!/usr/bin/env python3
"""Print campaign progress from CSV + campaign/state.json."""

from __future__ import annotations

import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from campaign_store import CampaignState, read_briefs


def main() -> None:
    briefs = read_briefs()
    state = CampaignState.load()

    csv_status = Counter(row.get("Status", "unknown") for row in briefs)
    variant_status = Counter()
    videos_with_variants = 0
    succeeded = 0

    for record in state.videos.values():
        if record.variants:
            videos_with_variants += 1
        for variant in record.variants:
            variant_status[variant.status] += 1
            if variant.status == "succeeded":
                succeeded += 1

    print("=== CSV Status ===")
    for status, count in sorted(csv_status.items()):
        print(f"  {status}: {count}")

    print("\n=== Xethra Queue ===")
    print(f"  Videos tracked: {len(state.videos)}")
    print(f"  Videos with variants queued: {videos_with_variants}")
    for status, count in sorted(variant_status.items()):
        print(f"  {status}: {count}")
    print(f"  Succeeded variants: {succeeded}")


if __name__ == "__main__":
    main()
