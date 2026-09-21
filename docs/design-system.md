# Waxflow design system

This guide is the styling contract for app-owned Waxflow UI. Its goals are
visual consistency, easy global restyling, readable JSX, and fewer one-off
design decisions.

Generated or imported UI primitive internals, including shadcn and Base UI
source, are outside this contract unless Waxflow deliberately customizes them.
App-owned wrappers and every intentional customization do follow it.

## Styling hierarchy

Put a design decision at the lowest reusable layer that accurately names it:

1. Define reusable visual values and semantic roles as central CSS tokens in
   `src/index.css`.
2. Put reusable controls, states, and meaningful alternatives in UI primitives
   or named variants.
3. Use a small React component for a recurring composed visual pattern.
4. Keep standard Tailwind utilities in page JSX for local layout and
   composition.

Do not create a CSS class or a string constant merely to hide a long utility
list. Extract a token, variant, or component only when it conveys reusable
meaning. A second use is the usual extraction point; obvious reuse may justify
extracting sooner. A long but unique layout may remain local.

## Tailwind utilities

- Start with Tailwind's default spacing, sizing, type, radius, and breakpoint
  scales.
- Use arbitrary values only when the default scale and existing tokens cannot
  express a genuinely local requirement.
- Promote an intentional, reusable value to a named token instead of repeating
  an arbitrary value. Repetition is strong evidence that a token is missing.
- Use static utility names directly. Use `cn` for conditional composition and
  CVA for meaningful reusable variants. Do not construct Tailwind class names
  dynamically at runtime.
- Do not use class-name constants as a makeshift design system when a semantic
  component or named variant describes the pattern.
- A surprising exception may deserve a short comment explaining the constraint;
  routine arbitrary values do not require comments.
- Reserve `@apply` for base rules and rare third-party integration, not bundles
  of component utilities.

Long utility lists are a readability signal, but they are less harmful than
unnecessary arbitrary values or raw colors. Prefer formatting or a meaningful
component boundary over premature abstraction.

## Tokens and color roles

Raw color literals belong only in the central token source in `src/index.css`
or in unavoidable, self-contained static assets. App-owned components consume
semantic roles such as `background`, `foreground`, `card`, `primary`, `muted`,
`accent`, `destructive`, `border`, and `ring`.

Brand roles such as `brand-orange`, `brand-purple`, and `brand-cream` are for
deliberate identity or decorative moments. They are not substitutes for
semantic roles in functional UI. If a color must change with meaning or theme,
give it a semantic role.

Raw palette values and complex reusable visual values may be centralized in
`:root`. Expose values to utilities through `@theme inline`. This keeps future
restyling in one place.

## Typography and shape

- Use Avenir Next with the system sans-serif fallback for interface and display
  text.
- Use the monospace family sparingly for the wordmark and short eyebrow labels.
- Display headings are large, bold, tightly tracked, and compact in line height.
- Prefer the default Tailwind type scale. Centralize a recurring type treatment
  in a component rather than duplicating its utility recipe.
- The central base radius is `0.625rem`. Standard `rounded-*` utilities derive
  from it; use `rounded-none` only when a deliberately square element needs it.
- Keep the interface mostly flat. Do not add general card shadows. Use elevation
  only when an element genuinely floats above another surface.

## Responsive layout

Build mobile first, then add Tailwind's standard named breakpoints. The MVP must
remain usable on phone and laptop. Prefer content-driven layout changes and the
default breakpoint scale; do not use raw pixel breakpoints unless a demonstrated
constraint requires one, in which case name and centralize it.

## Interaction and motion

- Centralize recurring hover, active, focus-visible, invalid, and disabled
  states in primitives, variants, or app-owned control components.
- Keyboard focus must remain clearly visible. Do not communicate state by color
  alone, and keep disabled state visibly distinct.
- A shared component's `className` is for contextual layout, such as margin or
  placement. Put recurring appearance changes in a named variant.
- Use restrained motion to clarify state or navigation. Avoid decorative motion
  that competes with fast use in a club setting, and respect reduced-motion
  preferences.

## Accessibility

Use semantic HTML first. Keep labels programmatically associated with fields,
preserve keyboard operation and visible focus, and use `role="status"` for
non-urgent feedback and `role="alert"` for errors. Text and interactive states
must meet WCAG AA contrast in every supported theme. Verify app-owned UI at
phone and laptop widths and with keyboard navigation.

## Theming

Theme support must work by swapping central semantic token values, not through
scattered app-owned `dark:` color overrides. Light and dark themes should be
designed independently for their environments rather than mechanically
inverted. Theme behavior and the dark palette are introduced in issue #27.
