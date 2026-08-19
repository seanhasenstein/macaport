import { css } from 'styled-components';

// Design tokens shared by the marketing pages.
//
// The color and radius values mirror sheets.macaport.com so the handoff from
// this site to the gang sheet builder reads as one product. The builder is on
// Tailwind's *neutral* scale (not the default gray the store pages use), and
// its radius is 0.625rem.
//
// `brand` is sampled from public/images/logo.png and carries the identity:
// eyebrow labels, links, and anything that stays on this site. Controls that
// hand off to the builder use `neutral` instead, matching the builder's own
// buttons, slider, and selected chips (all #171717, sampled from
// screenshots/gang-sheet-builder).
//
// Imported directly rather than passed through a ThemeProvider. The store
// pages nest several context providers in _app.tsx and there's nothing to gain
// from adding another.

export const theme = {
  color: {
    brand: '#0d6b2b',
    brandHover: '#0a5522',
    brandDeep: '#073f19',
    brandSubtle: '#f1f7f3',
    onBrand: '#ffffff',

    // The builder's own primary button is neutral, not green. Anything that
    // hands off to sheets.macaport.com uses these so the button you click here
    // looks like the button you land on.
    neutral: '#171717',
    neutralHover: '#050505',
    onNeutral: '#ffffff',

    text: '#171717',
    textMuted: '#737373',
    textSubtle: '#a1a1a1',

    border: '#e5e5e5',
    borderStrong: '#d4d4d4',
    // The 2px rules that head the three-item lists in each homepage section.
    // Deliberately between textMuted and textSubtle: those are text tones and
    // both were wrong here — the first outweighed the headings it introduces,
    // the second let the rule start to disappear. Nothing in the border family
    // works either, since all of them are pitched for 1px hairlines.
    borderRule: '#8a8a8a',
    // Form controls sit on white and need to read as editable, so their
    // resting border is a step darker than a divider's.
    borderField: '#c4c4c4',
    brandBorder: '#cfe3d7',
    // A step darker, for rules that have to hold their own across a whole band
    // of brandSubtle rather than outline a single small chip. Same value the
    // confirmation emails pair with this background on their badge and
    // callout, so the two surfaces stay in step.
    brandBorderStrong: '#b5d5c2',

    surface: '#ffffff',
    surfaceMuted: '#fafafa',
    surfaceSunken: '#f5f5f5',
    // The builder draws its background grid in this over surfaceMuted.
    surfaceGrid: '#f0f0f0',

    danger: '#e40014',
  },
  radius: {
    sm: '0.375rem',
    md: '0.625rem',
    lg: '1rem',
  },
  maxWidth: '72rem',
} as const;

// The pill used at the top of each hero column. Shared so the two stay in
// step — they sit side by side and any drift between them reads as a bug.
export const badge = css`
  padding: 0.375rem 0.75rem;
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: ${theme.color.brand};
  background-color: ${theme.color.brandSubtle};
  border: 1px solid ${theme.color.brandBorder};
  border-radius: 999px;
`;

// The faint grid the gang sheet builder sits on. Used on the pages that open
// a conversation — the homepage hero and the contact form — so the two feel
// like the same surface. Fades out before the section ends so the boundary is
// the fade rather than a hard edge.
// Default mask: fades downward only. The top edge butts against the header,
// which gives it a natural boundary, and the hero's content spans the full
// width so there is nothing to vignette toward.
const GRID_FADE_DOWN = 'linear-gradient(to bottom, #000 45%, transparent 100%)';

// For narrow centered layouts. Fades left, right, and down, but leaves the top
// solid — that edge meets the header, which is a real boundary already. Fading
// it too washes out the band directly under the nav and the grid, which is
// faint to begin with, stops reading at all.
export const GRID_FADE_SIDES = `linear-gradient(to bottom, #000 55%, transparent 100%),
    linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)`;

export const gridBackdrop = (mask: string = GRID_FADE_DOWN) => css`
  position: relative;
  isolation: isolate;
  background-color: ${theme.color.surface};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: ${theme.color.surfaceMuted};
    background-image: linear-gradient(
        to right,
        ${theme.color.surfaceGrid} 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, ${theme.color.surfaceGrid} 1px, transparent 1px);
    background-size: 40px 40px;
    -webkit-mask-image: ${mask};
    mask-image: ${mask};
    /* Only matters when a mask supplies two gradients — they intersect so
       both fades apply, rather than the second replacing the first. */
    -webkit-mask-composite: source-in;
    mask-composite: intersect;
  }
`;

// Focus for form fields. No white spacer ring — it thickens the field's own
// border instead, so there's no gap between the border and the highlight.
export const focusField = css`
  outline: 2px solid transparent;
  outline-offset: 0;
  border-color: ${theme.color.neutral};
  box-shadow: 0 0 0 1px ${theme.color.neutral};
`;

// Visible keyboard focus. GlobalStyles sets a global outline-color, but these
// sit on colored and white surfaces both, so they carry their own ring.
export const focusRing = css`
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px ${theme.color.surface}, 0 0 0 4px ${theme.color.brand};
`;

// Same ring, neutral. For controls that are themselves neutral when active —
// a green ring around a dark chip reads as two unrelated states at once.
export const focusRingNeutral = css`
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px ${theme.color.surface}, 0 0 0 4px ${theme.color.neutral};
`;

export const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
  }
`;
