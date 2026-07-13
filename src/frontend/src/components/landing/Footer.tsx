/**
 * Footer — clean icy-themed footer for the Froze landing page.
 *
 * Links (How It Works, Features, About, Privacy), social icons via
 * lucide-react, and the supportive closing line "Your savings,
 * preserved." plus the Caffeine branding line.
 */
import { Github, Linkedin, Snowflake, Twitter } from "lucide-react";
import { type ReactNode, useCallback } from "react";

const NAV_LINKS = [
  { label: "Features", id: "features" },
  { label: "Preview", id: "preview" },
  { label: "About", id: "hero" },
  { label: "Privacy", id: "hero" },
] as const;

const SOCIALS = [
  {
    label: "Twitter",
    icon: <Twitter className="h-5 w-5" />,
    href: "https://twitter.com",
  },
  {
    label: "GitHub",
    icon: <Github className="h-5 w-5" />,
    href: "https://github.com",
  },
  {
    label: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    href: "https://linkedin.com",
  },
] as const;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "froze",
  )}`;

  const handleNav = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
      e.preventDefault();
      scrollToId(id);
    },
    [],
  );

  return (
    <footer className="relative border-t border-border/40 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between">
          {/* Brand + tagline */}
          <div className="flex max-w-sm flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex items-center gap-2">
              <Snowflake className="h-6 w-6 text-accent animate-frozen-glow-pulse" />
              <span className="font-display text-xl font-semibold tracking-tight text-gradient-frost">
                Froze
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Your savings, preserved.
            </p>
          </div>

          {/* Nav links */}
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={(e) => handleNav(e, link.id)}
                data-ocid={`footer.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                data-ocid={`footer.${social.label.toLowerCase()}.link`}
                className="grid h-10 w-10 place-items-center rounded-full cryo-glass text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:text-accent hover:cryo-edge-glow"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-6 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground">
            © {year}. Built with love using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition-colors hover:text-frost"
              data-ocid="footer.caffeine.link"
            >
              caffeine.ai
            </a>
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Money on ice. Discipline by design.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
