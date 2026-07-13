/**
 * PublicLayout — minimal chrome for unauthenticated public pages
 * (landing, waitlist). No sidebar, no top bar — just the dark cryo
 * vault ambient background with an outlet for page content. The
 * landing/waitlist pages render their own hero and footer.
 */
import { Outlet } from "@tanstack/react-router";

export function PublicLayout() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Ambient aurora band */}
      <div
        aria-hidden
        className="cryo-aurora pointer-events-none absolute inset-x-0 top-0 h-40 opacity-60"
      />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
