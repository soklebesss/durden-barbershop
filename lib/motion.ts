/* Motion tokens — mirror the CSS custom properties in globals.css so
   JS-driven (framer) and CSS-driven motion share one rhythm.
   Scroll reveals are CSS-driven (see reveal.tsx + globals.css); framer is
   reserved for load choreography, parallax, and pointer physics. */
export const DUR = {
  micro: 0.15,
  standard: 0.3,
  reveal: 0.6,
  intro: 0.9,
} as const;

export const EASE = {
  blade: [0.83, 0, 0.17, 1] as const,
  snap: [0.16, 1, 0.3, 1] as const,
};
