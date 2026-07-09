import { ImageResponse } from "next/og";
import { logoMarkDataUrl } from "@/lib/brand/logo-mark-svg";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoMarkDataUrl()} width={32} height={32} alt="" />
    ),
    { ...size }
  );
}
