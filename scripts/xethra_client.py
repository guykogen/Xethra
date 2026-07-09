from __future__ import annotations

import json
import urllib.error
import urllib.request
from typing import Any

from config import Settings


class XethraClient:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def _request(
        self,
        method: str,
        path: str,
        payload: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        url = f"{self.settings.base_url}{path}"
        data = None
        headers = {
            "Content-Type": "application/json",
            "x-xethra-agent-key": self.settings.agent_key,
        }
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                body = resp.read().decode("utf-8")
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"HTTP {exc.code} {path}: {detail}") from exc

    def queue_video(
        self,
        *,
        prompt: str,
        campaign_label: str,
        reference_image_url: str | None = None,
    ) -> dict[str, Any]:
        mode = "text"
        image_url = reference_image_url or self.settings.reference_image_url
        payload: dict[str, Any] = {
            "prompt": prompt,
            "mode": mode,
            "model": self.settings.model,
            "ratio": self.settings.ratio,
            "resolution": self.settings.resolution,
            "duration": self.settings.duration,
            "generateAudio": self.settings.generate_audio,
            "campaignLabel": campaign_label,
        }
        if image_url:
            payload["mode"] = "reference"
            payload["imageUrl"] = image_url
            payload["imageRole"] = "reference"
        return self._request("POST", "/api/agent/generate", payload)

    def list_jobs(self, *, sync: bool = True) -> list[dict[str, Any]]:
        path = "/api/jobs?sync=1" if sync else "/api/jobs"
        data = self._request("GET", path)
        return data.get("jobs", [])

    @staticmethod
    def download_file(url: str, dest_path: str) -> None:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=300) as resp, open(dest_path, "wb") as out:
            while True:
                chunk = resp.read(1024 * 1024)
                if not chunk:
                    break
                out.write(chunk)
