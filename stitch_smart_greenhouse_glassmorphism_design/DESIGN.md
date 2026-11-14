---
name: BioGlass AgTech
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#45dfa4'
  on-secondary: '#003825'
  secondary-container: '#00bd85'
  on-secondary-container: '#00452e'
  tertiary: '#95d3ba'
  on-tertiary: '#003829'
  tertiary-container: '#71af97'
  on-tertiary-container: '#004231'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#68fcbf'
  secondary-fixed-dim: '#45dfa4'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#b0f0d6'
  tertiary-fixed-dim: '#95d3ba'
  on-tertiary-fixed: '#002117'
  on-tertiary-fixed-variant: '#0b513d'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-numeric-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system embodies the union of precision agricultural biotechnology and serene ecological stewardship. It targets agronomic engineers, commercial greenhouse operators, and high-tech urban farmers managing microclimate telemetry, automated fertigation, and spectral lighting.

The visual style is **Minimalist Glassmorphism** blended with pure AgTech utility:
- **Atmospheric Clarity:** Interfaces mimic clinical, condensation-speckled botanical glasshouses. Translucent surfaces expose subtle organic gradient lightfields beneath.
- **Precision Agronomy:** Information density is controlled through disciplined spacing and lightweight data chips, avoiding sensory overload during active monitoring.
- **Tactile Purity:** Controls (valves, louvers, misting cycles) evoke optical glass panels and frictionless capacitive switches rather than heavy physical machinery.

## Colors

The palette derives from chloroplastic vibrancy set against deep, light-absorbing forest slate:

- **Primary (`#10B981` — Chlorophyll Emerald):** Used for nominal telemetry values, active growth phases, primary call-to-actions, and live operational states.
- **Secondary (`#34D399` — Spearmint Vapor):** Used for ambient sensor readings, sub-system indicators, telemetry trends, and soft illuminations.
- **Tertiary (`#064E3B` — Deep Canopy):** Used for layered background tints, recessed container surfaces, and dark contrast anchors.
- **Neutral (`#0F172A` — Forest Slate):** Base dark canvas representing nocturnal atmospheric cycles, paired with high-translucency white overlays (`rgba(255, 255, 255, 0.04)` to `rgba(255, 255, 255, 0.12)`).

### Functional Accents
- **Solar Spectrum (Photoperiod):** `#FBBF24` (Amber glow)
- **Vapor Deficit & Humidity (VPD):** `#38BDF8` (Sky mist)
- **Biological Criticality / Alert:** `#F43F5E` (Stem pathogen red)

## Typography

The typographical structure balances the organic geometric curves of Plus Jakarta Sans with the strict, tabular legibility of Inter for telemetry metrics in Russian Cyrillic:

- Cyrillic glyphs in Plus Jakarta Sans provide balanced ascenders and open apertures, maintaining legibility even against low-opacity translucent backdrops.
- Sensor outputs, units of measure (e.g., `мкмоль/м²·с`, `°C`, `г/л`, `ppm`), and timestamped log tables require Inter with tabular figures (`tnum`) enabled to prevent layout jitter during live-streamed data polling.
- Russian terminology uses concise noun forms for status indicators (e.g., `В норме`, `Орошение`, `Вентиляция`, `Спящий режим`).

## Layout & Spacing

A 12-column fluid grid accommodates scalable IoT operational dashboards, adapting dynamically between control-room displays, field tablets, and agronomist handhelds:

- **Desktop (1280px+):** 12 columns, 24px gutters, 48px outer margins. Supports side-by-side environmental cross-sections, multi-zone telemetry cards, and active climate controls.
- **Tablet (768px - 1279px):** 8 columns, 20px gutters, 32px outer margins. Widget clusters reflow into paired cards; primary environmental gauges span 4 columns each.
- **Mobile (320px - 767px):** 4 columns, 16px gutters, 16px outer margins. Cards collapse to full-width modules; secondary telemetry transforms into horizontally swipeable carousels.

Spacing rhythm relies on multiples of 4px/8px, prioritizing wide internal card padding to preserve the weightless glass look.

## Elevation & Depth

Visual hierarchy relies on refractive glass layers and variable backdrop filters rather than heavy drop shadows:

- **Base Layer (L0 - Тепличный грунт):** Base slate background (`#0F172A`) layered with radial atmospheric gradients of muted emerald (`rgba(16, 185, 129, 0.08)`) and cyan mist (`rgba(56, 189, 248, 0.05)`).
- **Surface Layer (L1 - Квадранты мониторинга):** `background: rgba(255, 255, 255, 0.04)`, `backdrop-filter: blur(20px)`, border: `1px solid rgba(255, 255, 255, 0.08)`. Subtle top-inner highlight: `inset 0 1px 0 0 rgba(255, 255, 255, 0.12)`.
- **Elevated Interactive Layer (L2 - Регуляторы и модальные панели):** `background: rgba(255, 255, 255, 0.08)`, `backdrop-filter: blur(32px)`, border: `1px solid rgba(255, 255, 255, 0.16)`. Ambient shadow: `0 20px 40px -15px rgba(0, 0, 0, 0.45)`.
- **Floating Overlays (L3 - Критические предупреждения):** `background: rgba(15, 23, 42, 0.85)`, `backdrop-filter: blur(40px)`, border: `1px solid rgba(52, 211, 153, 0.3)`. Outer glow: `0 0 30px rgba(16, 185, 129, 0.15)`.

## Shapes

The shape vocabulary uses smooth, rounded contours to complement organic plant life while preserving technical discipline:

- Containers, cards, and modal sheets use `rounded-xl` (24px) for architectural cohesion.
- Compact telemetry chips, input elements, buttons, and segmented control tabs utilize `rounded-md` (8px) to `rounded-lg` (16px).
- Status pips and biological mode selectors use pill forms (fully rounded) to contrast against rectilinear data grids.

## Components

### Buttons (Кнопки управления)
- **Primary Action (Активное действие):** Semi-translucent emerald gradient base with a 1px glass rim (`border: 1px solid rgba(255, 255, 255, 0.25)`). Font: Plus Jakarta Sans, 14px Semibold. Inner glow on hover. Text: `Применить сценарий`, `Запустить полив`.
- **Ghost/Glass Action (Вторичные кнопки):** Transparent fill, border `1px solid rgba(255, 255, 255, 0.12)`, hover fills to `rgba(255, 255, 255, 0.08)`.

### Sensory Data Chips (Чипы телеметрии)
- Ultra-compact glass capsules displaying parameters such as `24.5 °C`, `72% Влажность`, `850 ppm CO₂`, `VPD 1.1 кПа`.
- Left-aligned indicator dot (pulsing CSS glow for live polling), uppercase Inter 11px label, and tabular 13px numeric reading.

### Environmental Telemetry Cards (Карточки датчиков)
- Frosted glass tile with an upper status header (e.g., `Зона А • Фитолампа 4`).
- Center features large tabular readouts (`label-numeric-lg`) backed by a mini SVG sparkline displaying 24-hour trends with a translucent mint fill gradient.
- Lower rail holds quick micro-toggles: `Авто`, `Ручной`, `Выкл`.

### Environmental Sliders & Controls (Регуляторы климата)
- Tracks feature a 6px frosted trench (`rgba(255, 255, 255, 0.1)`).
- Active progress filled with an emerald-to-mint gradient.
- Thumbs are 20px glass circles with a solid white center core, producing an emerald rim halo on focus.

### Inputs & Selectors (Поля ввода и селекторы)
- Background: `rgba(255, 255, 255, 0.03)`, border: `1px solid rgba(255, 255, 255, 0.1)`.
- Active focus transitions the border to `rgba(52, 211, 153, 0.6)` with an ambient mint glow (`0 0 12px rgba(16, 185, 129, 0.25)`).
- Russian placeholder text uses muted slate (`rgba(255, 255, 255, 0.4)`), e.g., `Поиск датчика, секции или рецепта...`.

### Switches & Checkboxes (Переключатели)
- Toggle switch uses a frosted track that transitions from translucent slate to illuminated emerald upon activation.
- The toggle thumb slides smoothly with a subtle blur effect on position shift.