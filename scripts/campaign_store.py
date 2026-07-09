from __future__ import annotations

import csv
import json
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from config import CAMPAIGN_STATE_PATH, CSV_PATH


@dataclass
class VariantRecord:
    variant: str
    job_id: str
    task_id: str | None = None
    status: str = "generating"
    video_url: str | None = None
    local_path: str | None = None
    error: str | None = None
    updated_at: str = field(default_factory=lambda: _now())


@dataclass
class VideoRecord:
    video_id: int
    hook: str
    variants: list[VariantRecord] = field(default_factory=list)
    selected_variant: str | None = None


@dataclass
class CampaignState:
    videos: dict[str, VideoRecord] = field(default_factory=dict)

    @classmethod
    def load(cls, path: Path = CAMPAIGN_STATE_PATH) -> "CampaignState":
        if not path.exists():
            return cls()
        raw = json.loads(path.read_text(encoding="utf-8"))
        videos: dict[str, VideoRecord] = {}
        for key, item in raw.get("videos", {}).items():
            variants = [VariantRecord(**v) for v in item.get("variants", [])]
            videos[key] = VideoRecord(
                video_id=item["video_id"],
                hook=item.get("hook", ""),
                variants=variants,
                selected_variant=item.get("selected_variant"),
            )
        return cls(videos=videos)

    def save(self, path: Path = CAMPAIGN_STATE_PATH) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "updated_at": _now(),
            "videos": {
                key: {
                    "video_id": rec.video_id,
                    "hook": rec.hook,
                    "selected_variant": rec.selected_variant,
                    "variants": [asdict(v) for v in rec.variants],
                }
                for key, rec in self.videos.items()
            },
        }
        path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def read_briefs(path: Path = CSV_PATH) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def write_briefs(rows: list[dict[str, str]], path: Path = CSV_PATH) -> None:
    if not rows:
        return
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


def update_csv_status(
    video_id: int,
    *,
    status: str,
    video_url: str | None = None,
    path: Path = CSV_PATH,
) -> None:
    rows = read_briefs(path)
    for row in rows:
        if str(row.get("ID", "")).strip() == str(video_id):
            row["Status"] = status
            if video_url is not None:
                row["Video URL"] = video_url
            break
    write_briefs(rows, path)


def get_video_record(state: CampaignState, video_id: int, hook: str) -> VideoRecord:
    key = str(video_id)
    if key not in state.videos:
        state.videos[key] = VideoRecord(video_id=video_id, hook=hook)
    return state.videos[key]


def variant_count(state: CampaignState, video_id: int) -> int:
    rec = state.videos.get(str(video_id))
    return len(rec.variants) if rec else 0
