from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "izop-100-video-briefs.csv"
CAMPAIGN_STATE_PATH = ROOT / "campaign" / "state.json"
RAW_DIR = ROOT / "raw"
SELECTED_DIR = ROOT / "selected"


def load_dotenv(path: Path | None = None) -> None:
    env_path = path or ROOT / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


@dataclass(frozen=True)
class Settings:
    base_url: str
    agent_key: str
    reference_image_url: str | None
    model: str
    ratio: str
    resolution: str
    duration: int
    generate_audio: bool

    @classmethod
    def from_env(cls) -> "Settings":
        load_dotenv()
        duration = int(os.environ.get("VIDEO_DURATION", "10"))
        if duration not in (5, 10):
            raise ValueError("VIDEO_DURATION must be 5 or 10")
        return cls(
            base_url=os.environ.get("XETHRA_BASE_URL", "https://www.xethra.com").rstrip("/"),
            agent_key=os.environ.get("XETHRA_AGENT_KEY", "").strip(),
            reference_image_url=os.environ.get("REFERENCE_IMAGE_URL", "").strip() or None,
            model=os.environ.get("SEEDANCE_MODEL", "dreamina-seedance-2-0-260128"),
            ratio=os.environ.get("VIDEO_RATIO", "9:16"),
            resolution=os.environ.get("VIDEO_RESOLUTION", "720p"),
            duration=duration,
            generate_audio=os.environ.get("GENERATE_AUDIO", "false").lower() in {"1", "true", "yes"},
        )

    def require_agent_key(self) -> None:
        if not self.agent_key:
            raise SystemExit(
                "Missing XETHRA_AGENT_KEY. Copy .env.example to .env and set your key."
            )
