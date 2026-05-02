---
name: Pixii Studio
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#5f5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e4e1e6'
  on-secondary-container: '#656467'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e4e1e6'
  secondary-fixed-dim: '#c8c5ca'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  gutter: 24px
  section-gap: 64px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
The design system is rooted in **Precision Minimalism**. It is designed to feel like a high-end tool that recedes into the background, allowing the user's e-commerce photography to take center stage. The aesthetic draws heavily from modern engineering-led brands like Vercel and Stripe, prioritizing clarity, intentional whitespace, and a frictionless "pro" feel.

The emotional response should be one of quiet confidence and technological superiority. By utilizing a "less is more" approach, the design system communicates that the AI-powered transformations are sophisticated yet effortless to execute.

## Colors
This design system utilizes a high-clarity light mode palette. The foundation is built on the Zinc scale to provide a neutral, sophisticated backdrop that does not compete with the color accuracy of uploaded photos.

- **Primary (Indigo-600):** Used sparingly for primary actions and "active" states to draw the eye without overwhelming the layout.
- **Background (Zinc-50):** Provides a soft, non-white canvas that reduces eye strain and distinguishes the main application area from floating surfaces.
- **Surface (White):** Used for cards, modals, and inputs to create a clear visual hierarchy through tonal layering.
- **Borders (Zinc-200):** Ultra-thin lines that define structure without adding visual noise.

## Typography
The design system exclusively uses **Inter** to maintain a systematic and utilitarian feel. The type scale is optimized for legibility in a dense SaaS environment. 

Headlines use semi-bold weights with tight letter spacing for a modern, "tech-first" appearance. Body text remains neutral and airy, while labels use a slightly heavier weight and increased tracking to ensure they are distinguishable at very small sizes (e.g., image metadata or status badges).

## Layout & Spacing
The layout philosophy centers on a **Fixed Grid** model with generous margins to create an "editorial" feel. Content should never feel cramped; vertical rhythm is maintained through a base 4px unit, typically scaled in increments of 8px.

Large containers utilize significant internal padding (32px+) to maintain the minimalist aesthetic. A 12-column grid is used for the main dashboard, but components like the image gallery rely on a flexible auto-fill grid that prioritizes consistent gutter widths (24px) over rigid column counts.

## Elevation & Depth
Elevation in this design system is achieved through a combination of **Tonal Layers** and **Ambient Shadows**. 

1.  **Base Layer:** Zinc-50 background.
2.  **Surface Layer:** White elements with a thin Zinc-200 border.
3.  **Elevated Layer:** Elements like cards and modals use an extra-diffused, low-opacity shadow (e.g., `0 10px 15px -3px rgba(0, 0, 0, 0.05)`).

Shadows should feel "breathable" and natural, avoiding harsh blacks or high-contrast edges. The goal is to make the interface feel like physical paper or panels resting gently on top of one another.

## Shapes
The shape language is defined by **Highly Rounded** corners, which soften the professional aesthetic and make the tool feel approachable. 

The standard corner radius for primary surfaces (cards, modals) is 16px (`rounded-2xl`). Smaller components like buttons follow this proportional curve, while "pill" elements (chips and search bars) use a fully rounded value to create a distinct visual contrast against rectangular containers.

## Components
Consistent styling across components ensures the product feels like a cohesive suite rather than a collection of features.

- **Buttons:** Primary buttons are Indigo-600 with white text. Secondary buttons are white with Zinc-200 borders. Both use `rounded-xl` and a subtle inner-shadow for a slightly tactile feel.
- **Image Cards:** These are the core of the system. They feature a white surface, 16px corner radius, and a thin border. Labels are placed at the bottom in a Zinc-100 sub-section or floating with a blur effect.
- **Chips:** Fully pill-shaped (`rounded-full`). Used for categories or status indicators. They use a Zinc-100 background with Zinc-700 text to remain secondary in the visual hierarchy.
- **Floating Input:** Inspired by modern AI interfaces (Claude), the main action input is a large, pill-shaped floating bar. It should have a strong ambient shadow to lift it off the page and be centered at the bottom of the viewport.
- **Navbars:** Ultra-minimalist. Transparent or white with a blur effect (`backdrop-blur`). Links are Zinc-500, turning Zinc-900 on hover. No heavy dividers; use spacing to separate sections.