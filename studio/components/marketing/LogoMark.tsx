import { logoMarkDataUrl } from "@/lib/brand/logo-mark-svg";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/** Same raster source as favicon — always identical */
export function LogoMark({ size = 40, className }: LogoMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoMarkDataUrl()}
      width={size}
      height={size}
      alt=""
      className={className}
      aria-hidden
    />
  );
}
