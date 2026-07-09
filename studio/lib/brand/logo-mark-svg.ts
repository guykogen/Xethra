/** Single source of truth for the Xethra logo mark (nav, favicon, OG). */
export const LOGO_MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="xethra-bg" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="#C4B5FD"/>
      <stop offset="0.45" stop-color="#8B5CF6"/>
      <stop offset="1" stop-color="#6D28D9"/>
    </linearGradient>
    <linearGradient id="xethra-x" x1="20" y1="16" x2="44" y2="48" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#EDE9FE"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#xethra-bg)"/>
  <path d="M18 14 L32 50 L38 50 L24 14 Z" fill="url(#xethra-x)" opacity="0.98"/>
  <path d="M46 14 L32 50 L26 50 L40 14 Z" fill="#FFFFFF" opacity="0.88"/>
  <circle cx="32" cy="32" r="3.5" fill="#FFFFFF"/>
</svg>`;

export function logoMarkDataUrl() {
  return `data:image/svg+xml,${encodeURIComponent(LOGO_MARK_SVG)}`;
}
