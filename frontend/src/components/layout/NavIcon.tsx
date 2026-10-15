import { NavItem } from "../../lib/nav";

export function NavIcon({ name, className = "h-4 w-4" }: { name: NavItem["icon"]; className?: string }) {
  const common = { className, viewBox: "0 0 20 20", fill: "none" as const };
  switch (name) {
    case "scan":
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="2" fill="currentColor" />
          <path d="M10 2v2.2M10 15.8V18M2 10h2.2M15.8 10H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "history":
      return (
        <svg {...common}>
          <circle cx="10" cy="10.5" r="6.75" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 6.75V10.5l3 1.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 2.5L4 4.5m11.5-2l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "research":
      return (
        <svg {...common}>
          <path d="M8 2.5h4M8.5 2.5v3.9L5 13.4a2 2 0 0 0 1.8 2.9h6.4a2 2 0 0 0 1.8-2.9l-3.5-7V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M6.7 10.8h6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "models":
      return (
        <svg {...common}>
          <path d="M3 16.5V3.5M3 16.5h14M6.5 13.5v-4M10.5 13.5v-7M14.5 13.5v-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="M10 2.5l7 3.75L10 10 3 6.25 10 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M3 10.25L10 14l7-3.75M3 14.25L10 18l7-3.75" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "alert":
      return (
        <svg {...common}>
          <path d="M10 2.75l7.5 13a1.2 1.2 0 0 1-1.05 1.8H3.55A1.2 1.2 0 0 1 2.5 15.75l7.5-13z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M10 8v3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="14" r="0.9" fill="currentColor" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2 10s2.8-5.25 8-5.25S18 10 18 10s-2.8 5.25-8 5.25S2 10 2 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
  }
}
