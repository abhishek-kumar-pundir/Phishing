import React from "react";

interface GlyphProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

// ---------------------------------------------------------------------------
// Phish360 Hand-Drawn Monogram / Logo Mark
// ---------------------------------------------------------------------------
export function LogoMark({ className = "w-5 h-5", size = 20, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="10" cy="10" r="7.5" stroke="#38C0E4" strokeOpacity="0.4" />
      <circle cx="10" cy="10" r="4.5" />
      <circle cx="10" cy="10" r="1.5" fill="#38C0E4" stroke="#38C0E4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Modality Glyphs (20px grid, 1.5px stroke)
// ---------------------------------------------------------------------------

// URL: Link chain glyph
export function UrlGlyph({ className = "w-5 h-5", size = 20, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M8.5 11.5L11.5 8.5" />
      <path d="M6 14l-1.5 1.5a3.5 3.5 0 01-5-5L1 9a3.5 3.5 0 015-5l1.5 1.5" />
      <path d="M14 6l1.5-1.5a3.5 3.5 0 015 5L19 11a3.5 3.5 0 01-5 5l-1.5-1.5" />
    </svg>
  );
}

// DOM / HTML: Markup tags & hierarchy
export function DomGlyph({ className = "w-5 h-5", size = 20, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="6 7 3 10 6 13" />
      <polyline points="14 7 17 10 14 13" />
      <line x1="11.5" y1="5.5" x2="8.5" y2="14.5" />
    </svg>
  );
}

// TEXT: Document lines / visible prose
export function TextGlyph({ className = "w-5 h-5", size = 20, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 4h12v12H4z" />
      <line x1="7" y1="8" x2="13" y2="8" />
      <line x1="7" y1="11" x2="13" y2="11" />
      <line x1="7" y1="14" x2="10.5" y2="14" />
    </svg>
  );
}

// VISION: Viewport frame & optical capture
export function VisionGlyph({ className = "w-5 h-5", size = 20, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3" y="4" width="14" height="12" rx="1.5" />
      <circle cx="10" cy="10" r="3" />
      <line x1="10" y1="2" x2="10" y2="4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Pipeline & Status Marks (20px grid, 1.5px stroke)
// ---------------------------------------------------------------------------

// Pending state: dashed hairline ring
export function StatusPending({ className = "w-5 h-5 text-mist-600", size = 20, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2.5 2.5"
      className={className}
      {...props}
    >
      <circle cx="10" cy="10" r="7" />
    </svg>
  );
}

// Running state: animated subtle quarter-ring
export function StatusRunning({ className = "w-5 h-5 text-brand", size = 20, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`animate-spin ${className}`}
      {...props}
    >
      <circle cx="10" cy="10" r="7" strokeOpacity="0.2" />
      <path d="M10 3a7 7 0 0 1 7 7" />
    </svg>
  );
}

// Done state: precision checkmark
export function StatusDone({ className = "w-5 h-5 text-verdict-legit", size = 20, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="10" cy="10" r="7" />
      <polyline points="7 10 9 12 13 8" />
    </svg>
  );
}

// Skipped state: neutral horizontal dash
export function StatusSkipped({ className = "w-5 h-5 text-mist-600", size = 20, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
      {...props}
    >
      <circle cx="10" cy="10" r="7" />
      <line x1="7.5" y1="10" x2="12.5" y2="10" />
    </svg>
  );
}

// Error state: alert glyph
export function StatusError({ className = "w-5 h-5 text-verdict-phish", size = 20, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="10" cy="10" r="7" />
      <line x1="10" y1="7" x2="10" y2="10.5" />
      <circle cx="10" cy="13" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Functional Utilities
// ---------------------------------------------------------------------------

export function ArrowUpRight({ className = "w-4 h-4", size = 16, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="4.5" y1="11.5" x2="11.5" y2="4.5" />
      <polyline points="6 4.5 11.5 4.5 11.5 10" />
    </svg>
  );
}

export function ArrowLeft({ className = "w-4 h-4", size = 16, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="11.5" y1="8" x2="4.5" y2="8" />
      <polyline points="8 4.5 4.5 8 8 11.5" />
    </svg>
  );
}

export function ChevronRight({ className = "w-4 h-4", size = 16, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}

export function InfoGlyph({ className = "w-4 h-4 text-mist-500", size = 16, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="8" cy="8" r="6" />
      <line x1="8" y1="7" x2="8" y2="11" />
      <circle cx="8" cy="5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

