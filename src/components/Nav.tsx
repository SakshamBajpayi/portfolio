// ─────────────────────────────────────────────────────────────
// Nav — Minimal fixed navigation for the Saksham portfolio.
//
// Updated for 7 sections. Section counter adapts color for
// cream vs dark backgrounds.
// ─────────────────────────────────────────────────────────────

interface NavProps {
  currentSection: number;
  scrollProgress: number;
}

// Sections on dark backgrounds (Projects=4, Finale/Contact=7)
const DARK_SECTIONS = new Set([4, 7]);

export default function Nav({ currentSection, scrollProgress }: NavProps) {

  const scrollPromptOpacity = scrollProgress > 0.2 ? 0 : 1;
  const isOnDark = DARK_SECTIONS.has(currentSection);

  // Nav text color adapts to current section background
  const navTextColor = isOnDark ? 'var(--ink-light)' : 'var(--ink-muted)';

  return (
    <nav
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      {/* ── Top-left: SAKSHAM ── */}
      <div
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          fontFamily: 'var(--ff-heading)',
          fontWeight: 700,
          fontSize: '0.8125rem',
          letterSpacing: '0.08em',
          color: navTextColor,
          pointerEvents: 'auto',
          userSelect: 'none',
          transition: 'color 0.4s ease',
          zIndex: 101,
        }}
      >
        SAKSHAM
      </div>

      {/* ── Top-right: INDEX · LAB · NOTES + pulse dot ── */}
      <div
        className="nav-top-right-links"
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          fontFamily: 'var(--ff-accent)',
          fontWeight: 700,
          fontSize: '0.8125rem',
          color: navTextColor,
          textTransform: 'uppercase',
          pointerEvents: 'auto',
          userSelect: 'none',
          transition: 'color 0.4s ease',
          zIndex: 101,
        }}
      >
        <span>INDEX</span>
        <span>LAB</span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          NOTES
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'var(--accent-purple)',
              animation: 'pulse-dot 2s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
        </span>
      </div>

      <div
        className="nav-section-counter"
        style={{
          position: 'fixed',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%) rotate(180deg)',
          writingMode: 'vertical-rl',
          fontFamily: 'var(--ff-accent)',
          fontWeight: 700,
          fontSize: '17px',
          letterSpacing: '0.12em',
          userSelect: 'none',
          pointerEvents: 'auto',
          zIndex: 101,
          color: isOnDark ? 'var(--ink-light)' : 'var(--ink)',
          transition: 'color 0.4s ease',
        }}
      >
        {String(currentSection).padStart(2, '0')}
      </div>

      {/* ── Bottom-left: scroll prompt ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          fontFamily: 'var(--ff-accent)',
          fontWeight: 700,
          fontSize: '16px',
          letterSpacing: '0.1em',
          color: '#6B6560',
          opacity: scrollPromptOpacity === 0 ? 0 : 0.75,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
          zIndex: 101,
        }}
      >
        SCROLL TO BUILD ↓ (yes, really scroll)
      </div>

      {/* ── Inline style tag for responsive hiding ── */}
      <style>{`
        @media (max-width: 1023px) {
          .nav-section-counter {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
