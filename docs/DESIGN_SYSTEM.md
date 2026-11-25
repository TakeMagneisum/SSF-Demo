# Design system — brand retained; proposed shared tokens

## Existing brand evidence

`assets/styles.css` defines Cypress `#0b2d2b`, Cypress 2 `#123b37`, paper `#f7f4ea`, sea `#6fb3a0`, sage `#b9cea5`, amber `#f2b441`, brick alert `#b9473d`, ink `#17312f`, radius `22px`, Georgia serif headings, and Inter/system-ui sans body. Dawn illustrations and icon WebPs already exist. Brand artwork is protected by `baseline/data-integrity.json`. Inspect actual contrast per use; these hex values are identity references, **not** proof any pairing meets WCAG.

## Phase 2 token plan

- Semantic tokens: `--surface`, `--surface-raised`, `--text`, `--text-muted`, `--link`, `--focus`, `--border`, `--critical-bg`, `--critical-text`, `--success`, `--selected`, `--map-covered`, `--map-unreviewed`. Distinguish *status* from *decoration*.
- Modes: light/dark/system, OS forced-colors, prefers-contrast, reduced motion. Keep key warning colors distinct and add explicit text/icon labels so color alone conveys nothing.
- Default text: body about 16–18 CSS px, line height ~1.5–1.65, robust 200% text scaling and narrow viewport reflow. Use responsive CSS `rem` units; no forced fixed-height clipping.
- Text density: comfortable/compact change padding, **not font size**. Large text and reading spacing controls should not cause horizontal scrolling at 320 CSS px.
- Buttons and links: meaningfully named; primary action singular; touch target target 44–48 CSS px where practical; consistent disabled/busy/error states; link underlines distinguish links from ordinary text.
- Focus: ≥2 CSS px clearly visible with offset, protected from sticky headers, high contrast in both modes; `:focus-visible` and skip links; do not outline on hover alone.
- Layout: spacing steps e.g. 4/8/12/16/24/32/48 CSS px, cards single column on phones, readable max-width for paragraphs, sticky elements that do not cover keyboard focus, support safe-area insets.
- Icons: descriptive labels adjacent; informative icons need alt text, decorative icons empty alt/aria-hidden; Dawn may explain vocabulary on request but never be animated intrusively.

## Component contracts

**Header:** emergency guidance distinct from nav; brand, Menu, adjacent appearance toggle (Light/Dark/System), optional accessibility panel, descriptive language chooser. Mobile menu must not trap focus or obscure page headings.

**World and region maps:** keyboard-focusable areas; touch selection panel; text list (always present); visible selection with non-color status; parents/crumbs, map reset/zoom, enlarged selection alternatives for tiny jurisdictions; tooltips concise, panel detailed; no essential drag.

**Resource cards:** collapsed content includes name, plain-language purpose, category, relevant scope, meaningful direct contact, and essential warnings; expanded includes next steps, availability caveats, documents, verified details, source dates, corrections, shortlist checkbox. `aria-expanded`, `aria-controls`, focus preservation and scroll restoration required. Expand All/Collapse All apply to filtered results without wiping selections.

**Search/filter:** clear current location, result count and active filters; removable chips with text names; zero-results recovery. Do not silently reset filters after opening and returning.

**Preferences:** visible control near menu; native selects/toggles; reset; local non-sensitive preferences may persist, but sensitive location/guide/situation and selected resources require deliberate storage policy. Accessibility menu itself must be accessible without its own settings.

**Handout:** printable large-text variant, QR/official link, verified source/date, no sensitive situation text by default, PDF/browser print alternatives and mobile testing. Print views should not include web nav, empty controls or hidden instructions.

## Required visual states

Normal, hover, keyboard focus, selected, loading, empty, error, unavailable coverage, stale information, critical warning, and offline/failed map must each have text descriptions. Avoid intrusive animation, nested scroll regions and footer-only navigation recovery. `assets/demo.css` adds a temporary demo banner only; it is **not** the permanent design system.

## Phase 2 implementation and consumption

The semantic token layer lives at the top of `assets/styles.css` (no additional CSS request). Brand primitives are unchanged. Current defaults: `--surface: --paper`, `--surface-raised: --white`, `--text: --ink`, `--text-muted: --muted`, `--link: --cypress`, `--border: --line`, `--focus: --amber`, `--critical-bg: --brick`, `--critical-text: #fff`, `--success: #285b43`, `--selected: --amber`, `--map-covered: #d8aa4d`, `--map-unreviewed: #d8e8dd`. The last two retain original map colors. Body, focus, urgent bar and map raised surfaces/fills consume selected aliases; existing Calm View custom properties take precedence in maps. Typography keeps Inter/system and Georgia; base body size is 1rem and line-height 1.6. Spacing `--space-1/2/3/4/6/8/12` corresponds to .25/.5/.75/1/1.5/2/3 rem. Preserve brand assets and existing icons. Cache token `phase2` identifies edited CSS and navigation modules.

Dark candidates: Cypress surface, Cypress 2 raised surface, cream text, sage link. High-contrast candidates: white background, black text, deep blue link. Candidate variables are reference values only, not user-operable modes or approved accessible pairs. Do not switch only body colors while hardcoded component colors remain. Phase 4 must migrate component states, warnings, focus and forced colors and validate contrast in both schemes before enabling controls. No inert theme toggle was added. Current amber focus on pale backgrounds needs contrast review; no conformance claim. Initial map controls hidden until coverage loads; static fallback list remains available.

## Phase 3 navigation layer

`assets/phase3.css` extends existing tokens with compact static navigation, prominent map/search region, readable selection panels and non-color selection outlines. Calm View retains its existing preference; no new appearance or accessibility toggle is exposed. Test 320 px reflow, 200% text, zoom, contrast and forced colors in Phase 4. Keep new map controls and visible direct non-map routes consistent with the same token layer.

## Phase 4 implemented display layer

`phase4.css` extends semantic surfaces, two-color focus outline, stronger borders and selected outlines, native system/light/dark and reading controls. Dark appearance reuses the established Calm palette; Calm-only artwork suppression and motion behavior remain separate. Actual default paper and muted values are the later root override #f4f0e5 and #536b67; retain brand reference colors. Higher contrast strengthens text/borders and underlines; forced-colors uses system colors; reduced motion respects OS. Text presets set rem root to 125%/150% with independent relaxed spacing and compact layout (not smaller font). Native details is in flow near menu. Screen-only color layer and print rules keep new settings out of print. No JS = original readable default, controls hidden. 17 opaque pair checks passed; rendered states not browser-audited. See PHASE4_ADR.md.

## Phase 5 resource cards

Recognition fields and source/date/critical next step always visible; native details for optional preparation, transit and correction links. List layout and expand/collapse controls act on current results; OR filter buttons have pressed state and separate removal. Phase 4 tokens, responsive layout, 44px target goal, existing focus/forced-color rules. No provider type guessed; guide-level date remains visibly qualified. Static print styles preserve critical fields, native print not verified. See PHASE5_ADR.md.
