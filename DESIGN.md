---
name: "DECM Nexus Control Tower"
description: "A responsive dispatch ledger for accountable logistics and procurement operations."
brand:
  approved-logo: "Supplied DECM Nexus globe-and-arrows master artwork"
  slogan: "Connecting Solutions. Delivering Excellence."
  motto: "From Strategy to Delivery."
  approved-variants:
    - "Full-colour"
    - "Black"
    - "White"
    - "Greyscale"
    - "Full-colour-on-navy"
colors:
  institutional-navy: "#0B3D91"
  action-navy: "#0B3D91"
  priority-gold: "#D4A017"
  brand-white: "#FFFFFF"
  silver-grey: "#808080"
  ledger-ink: "#172033"
  muted-slate: "#6c7484"
  hairline: "#d9d5ca"
  warm-paper: "#fffdf8"
  canvas: "#f4f1e9"
  exception-red: "#a43a36"
  success-green: "#277253"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "23px"
    fontWeight: 600
  title:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    letterSpacing: "0.07em"
rounded:
  label: "5px"
  status: "6px"
  control: "9px"
  nav: "10px"
  brand: "11px"
  panel: "14px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  control-x: "15px"
  md: "16px"
  panel: "22px"
  lg: "28px"
  workspace-x: "36px"
components:
  button-primary:
    backgroundColor: "{colors.action-navy}"
    textColor: "#ffffff"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 15px"
  button-primary-hover:
    backgroundColor: "#062f78"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "#29354a"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 15px"
  panel:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.ledger-ink}"
    rounded: "{rounded.panel}"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.ledger-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
  status:
    typography: "{typography.label}"
    rounded: "{rounded.status}"
    padding: "5px 8px"
---

# Design System: DECM Nexus Control Tower

## Overview

**Creative North Star: "The Dispatch Ledger"**

DECM Nexus translates the authority and traceability of an operations ledger into a responsive control tower. Warm paper surfaces carry dense records; institutional navy establishes structure and action; gold appears sparingly to signal priority, progress, identity, and keyboard focus. Hairline rules keep related facts legible without turning the workspace into a stack of floating cards.

The system is compact, sober, and operational. Editorial Newsreader headings supply confidence and hierarchy while Manrope keeps tables, controls, and small metadata highly scannable. On narrow screens, the system preserves record meaning by translating tables into summaries instead of compressing desktop rows.

Authentication, feedback, permissions, and evidence handling belong to the same ledger world. The sign-in page pairs a paper credential sheet with an institutional-navy context field; loading, error, and empty states remain compact and adjacent to the affected record; role-aware read-only treatments remove unavailable creation controls and replace editable states with quiet status or “Read only” language. Evidence opens as a wider right-edge ledger drawer so milestones, documents, and audit history stay connected to the job being reviewed.

The DECM Nexus Brand Package is authoritative for the corporate identity layered onto this product system. The supplied globe-and-arrows logo, corporate messaging, approved variants, and exact four-colour palette take precedence over earlier draft identity choices. The Dispatch Ledger remains the product's interaction and layout language; it must not reinterpret the corporate mark or expand the official brand palette.

The public marketing site is a second, complementary surface named **Connected Routes**. It uses the same authoritative identity, type voices, palette boundary, and focus language, but changes mode from Operate to Persuade: generous editorial pacing and animated route geometry explain how DECM Nexus connects strategy, coordination, movement, procurement, evidence, and delivery. The authenticated Control Tower remains the compact Dispatch Ledger documented below; marketing styles must not leak into its tables, rails, drawers, or dense records.

**Key Characteristics:**

- Warm paper and canvas rather than clinical white and cool grey.
- Persistent navy operational framing with restrained gold signals.
- Hairline divisions and tonal layers before ambient shadow.
- Editorial headings paired with compact, tabular operational data.
- Responsive records that preserve reference, client, status, route, and promise.
- Honest system feedback and role boundaries expressed inside the operational frame.
- Evidence, forms, and audit history attached to the record rather than split into separate visual worlds.

## Brand Identity

### Approved Master Logo

The approved logo is the supplied DECM Nexus globe-and-arrows master artwork. Use the supplied asset directly: it must never be redrawn, reconstructed, retyped, replaced, independently recoloured, stretched, skewed, rotated, distorted, or otherwise altered. Maintain its proportions and clear space, and avoid visually busy backgrounds.

### Corporate Messaging

- **Slogan:** Connecting Solutions. Delivering Excellence.
- **Motto:** From Strategy to Delivery.

Use the slogan and motto exactly as written, including punctuation and capitalization.

### Approved Logo Variants

The approved supplied variants are full-colour, black, white, greyscale, and full-colour-on-navy. Use black or greyscale only when colour reproduction is unavailable, and use white only on a sufficiently dark background. Every variant remains approved supplied artwork; do not derive a new variant from another file.

**The Master Artwork Rule.** Product implementation may select an approved supplied variant, but it may not recreate or modify the globe-and-arrows artwork.

## Colors

The authoritative DECM Nexus brand palette contains exactly Navy Blue `#0B3D91`, Gold `#D4A017`, White `#FFFFFF`, and Silver Grey `#808080`. The product system pairs those brand colours with warm archival UI neutrals and uses semantic colours only where they carry operational meaning. Product-only neutrals and state colours do not extend or redefine the corporate palette, and they must never be used to recolour the logo.

### Primary

- **Navy Blue (`#0B3D91`):** The primary corporate colour and structural colour for the permanent operations rail, brand authority, primary actions, links, row controls, and active emphasis.

### Secondary

- **Gold (`#D4A017`):** The official accent colour, used sparingly for the active-rail marker, counts, identity medallions, selection, and focus visibility.

### Tertiary

- **Exception Red:** Reserved for exceptions, late or blocked conditions, and urgent operational risk.
- **Success Green:** Reserved for delivered, healthy, confirmed, or positive-progress states.

### Neutral

- **White (`#FFFFFF`):** The official brand colour for negative space and approved reverse applications.
- **Silver Grey (`#808080`):** The official supporting neutral.
- **Ledger Ink:** Default high-contrast text on light surfaces.
- **Muted Slate:** Supporting copy and metadata that should recede without disappearing.
- **Hairline:** Borders, rules, and table divisions that organize records.
- **Warm Paper:** Primary panel, drawer, card, and toolbar surface.
- **Canvas:** App background that distinguishes the operational surface from its surroundings.

### Named Rules

**The Gold Is a Signal Rule.** Gold marks priority, focus, progress, or identity; it does not fill large decorative surfaces.

**The Semantic State Rule.** Red and green communicate operational state only, never general decoration.

**The Brand Palette Boundary Rule.** Navy, gold, white, and silver grey are the only corporate brand colours. Ledger neutrals and semantic state colours are product UI tokens, not additional logo or corporate identity colours.

## Typography

**Display Font:** Newsreader (with Georgia and serif fallbacks)  
**Body Font:** Manrope (with system-ui and sans-serif fallbacks)

**Character:** Newsreader gives page and dispatch headings an editorial, accountable voice. Manrope handles compact controls, records, metrics, and metadata with a calm operational rhythm.

### Hierarchy

- **Display** (600, 36px, 1.05): Page titles; reduces to 30px on narrow screens.
- **Headline** (600, 23px): The current operational sentence in the dispatch brief.
- **Title** (700, 16px): Panel and section headings.
- **Body** (400, 13px): Supporting descriptions and controls; dense records step down to 12px.
- **Label** (700, 10px, 0.07em, uppercase): Table headers, metric keys, and operational metadata.

### Named Rules

**The Two-Voice Rule.** Newsreader speaks only for high-level orientation; Manrope carries every action and record.

**The Numeric Ledger Rule.** Metrics and dispatch figures use tabular numerals so values remain aligned while they change.

## Layout

Desktop uses a 248px persistent operations rail beside a fluid workspace capped at 1600px. The sticky top bar is 72px high, and the workspace uses 36px horizontal padding. The dashboard pairs a four-column metric strip with a 1.9:0.75 ledger-and-action split; gaps are generally 22px.

At 1100px, metrics move to two columns, the split stacks, and report tiles become a single column. At 780px, navigation becomes a 270px off-canvas rail, the top bar drops to 64px, workspace padding becomes 16px, and wide job tables become stacked record summaries. At 500px, headings and actions stack and metrics become a single column.

Workspace search stays in the sticky top bar at every size. Below 780px it contracts to a 150px flexible field rather than disappearing, while lower-priority connectivity and refresh controls recede. At 900px the sign-in context field is removed and the credential sheet becomes the full surface. Evidence and form drawers take the full available width on narrow screens; their multi-column forms collapse to one column below 600px.

**The Record-Preservation Rule.** Responsive adaptation changes the representation, not the operational content; never solve a narrow screen by shrinking the desktop ledger.

## Public Marketing Surface: Connected Routes

### Purpose and Positioning

The public site presents DECM Nexus as a people-led managed logistics, procurement, and consulting service. The primary promise is expert coordination from first conversation through delivery and evidence. Technology supports that service; it is not the service itself.

The portal is an optional continuity layer for customers who need ongoing visibility, approvals, documents, and reporting after an engagement begins. Public calls to action therefore prioritize **Talk to our team**, **Discuss your requirement**, or **Request a consultation**. **Open client portal** is always secondary, visually quieter, and never framed as the only way to work with DECM Nexus.

Do not imply self-service automation, instant pricing, a marketplace of transporters, guaranteed coverage, or unverified performance. Use only confirmed service descriptions and the approved corporate messaging. The closing brand moment may use “Connecting Solutions. Delivering Excellence.” or “From Strategy to Delivery.” exactly as written.

**The Manual-First Rule.** Lead with human assessment, coordination, and accountability; introduce the portal only as an optional tool that extends the managed relationship.

### Route Architecture and Navigation

The marketing experience contains four real page routes:

| Route | Navigation label | Page responsibility |
| --- | --- | --- |
| `/` | Home | Establish the integrated-service promise, show the Connected Routes system, introduce service families, and lead to a conversation. |
| `/services` | Services | Explain logistics, procurement, consulting, documentation, and reporting as coordinated service paths without inventing claims or prices. |
| `/about` | About | Explain the company, its accountable working method, brand commitments, and the people-led relationship behind delivery. |
| `/contact` | Contact | Provide a clear manual enquiry path, expectation-setting, contact details when verified, and an optional portal link for existing customers. |

Header links navigate between these pages. They must not be hash links or section-jump aliases such as `/#services`. The current route receives a visible and programmatically exposed active state. In-page anchor links are reserved for genuine long-form wayfinding within one page and never substitute for the four primary destinations. Preserve browser history, deep linking, keyboard activation, and a consistent page title and top-level heading on every route.

On desktop, the public header is a calm horizontal band with the approved supplied logo at the leading edge, page links in the center or trailing cluster, a primary contact action, and a quieter portal action. Below 780px it becomes a compact header with a labelled menu control; the open menu is a simple vertical navigation region, traps no focus, closes on route selection and Escape, and restores focus to its trigger.

**The Page-Route Rule.** Home, Services, About, and Contact are separate destinations with their own content hierarchy and URL; primary navigation never scrolls the home page to mimic routing.

### Connected Routes Visual System

The signature visual is a network of authored route lines connecting labelled nodes: Strategy, Procurement, Coordination, Movement, Evidence, and Delivery. Lines use brand navy as structure, gold only for the active connection or arrival, and silver grey for dormant paths. Nodes are small, precise junctions rather than decorative bubbles. White, Warm Paper, and Canvas keep the field breathable; the approved logo remains independent artwork and is never merged into or traced by the route graphic.

The system adapts by page rather than repeating one hero unchanged:

- **Home:** a route begins near the service promise, connects the principal service nodes, and resolves at Delivery beside the primary conversation action.
- **Services:** parallel paths branch from a shared assessment point into logistics, procurement, consulting, documentation, and reporting, then reconverge at accountable delivery.
- **About:** a restrained route connects principles or stages of the working method; people and verified company information remain the subject.
- **Contact:** the route shortens to one clear handoff from requirement to conversation, with the form or contact method visually placed at the destination.

Use crisp SVG geometry or an equivalent semantic vector layer. Route paths may pass behind editorial copy only when contrast and reading order remain untouched. Avoid maps, globes, vehicle illustrations, or generic supply-chain icon grids unless verified content requires them. The master logo is not a node, spinner, route endpoint, or animation mask.

**The Connected-Route Rule.** Every line must explain a relationship or progression; decorative networks, random particles, and motion without informational purpose do not belong.

### Marketing Composition

Public pages use a centered editorial frame up to 1440px with fluid outer gutters (`clamp(20px, 5vw, 80px)`). Text measures stay between 45ch and 72ch. Newsreader may scale more generously than in the app for page promises and major statements, up to `clamp(44px, 7vw, 88px)`, while Manrope carries navigation, service detail, forms, and actions. Display tracking never goes below `-0.04em`.

Sections are separated by space, route continuity, and hairlines rather than equal floating cards. Service families may form an asymmetric ledger or branching sequence; do not reduce the page to a repeated icon-heading-paragraph grid. Gold remains a signal, not a large backdrop. Photography is optional and must be real, attributable, and relevant if introduced; never use generic generated logistics imagery as proof.

The footer repeats the approved supplied logo variant suited to its background, the four page links, exact corporate messaging, verified contact details, and the secondary portal route. It must not introduce new service claims, partner marks, or social accounts without evidence.

### Public-Surface Motion

Connected Routes has one authored motion language: a path reveals from an already visible faint base line, a gold signal travels once toward the relevant node, and the destination settles from outline to filled emphasis. Use SVG path length, clipping, or masking rather than animating layout. Motion follows reading order and explains connection; it does not restart whenever a visitor scrolls a few pixels.

- Initial route reveal: 700–1000ms with an exponential ease-out, after the page heading is readable.
- Node emphasis: 160–220ms, staggered only where the sequence carries meaning.
- Route transition: navigation changes the page immediately; any continuity animation is decorative enhancement and must not delay the new heading, focus placement, or content.
- Hover/focus: 120–180ms for colour, underline, or small positional feedback; primary actions remain legible without motion.
- Performance: animate `transform`, `opacity`, masks, or stroke properties; avoid continuous filters, autoplay loops, and main-thread path recalculation.

Under `prefers-reduced-motion: reduce`, render the complete route and all nodes in their final state on first paint, remove travelling signals and scroll-linked progress, set non-essential transitions to `0.01ms`, and preserve every label and relationship. Route changes still move focus to the new page heading or main landmark; reduced motion must not remove state, feedback, or content.

**The Motion-Comes-Second Rule.** The route diagram is understandable as a static composition before animation is added, and navigation never waits for choreography.

### Public Responsive Behavior

- **Above 1100px:** use the full editorial frame, horizontal header, wide asymmetric hero, and horizontally branching route geometry.
- **780–1100px:** reduce display scale, keep the primary route visible, allow service branches to wrap or stack, and prevent paths from crossing copy or controls.
- **Below 780px:** use the compact menu, single-column content, full-width actions where helpful, and a vertical or stepped route whose labels remain adjacent to their nodes.
- **Below 500px:** maintain at least 20px page gutters, keep tap targets at least 44px high, avoid two-up service layouts and side-by-side form fields, and place the portal action after the primary contact action.

The visual system must recompose rather than crop. SVGs use a responsive `viewBox`; labels remain HTML when that improves wrapping and accessibility; no required information depends on a hover state. Contact forms retain explicit labels, adjacent errors, autocomplete attributes, and a clear submission state. Long names, 200% zoom, keyboard navigation, and future French copy must not break the header, route labels, or calls to action.

**The Route-Recomposition Rule.** On narrow screens, redraw the relationship vertically or stepwise; never scale the desktop network until labels become unreadable.

### Boundary with the Operational App

The public site and authenticated app share authoritative brand assets, palette, typography families, focus treatment, button fundamentals, and honest language. They do not share page composition. Connected Routes owns spacious persuasion, route geometry, and public page transitions. The Dispatch Ledger owns the navy operations rail, compact tables, metrics, evidence drawers, dense state labels, and record-preserving mobile summaries.

The handoff between them is explicit: **Open client portal** leads to authenticated entry; it does not restyle the login screen as a marketing page. Likewise, the app may link back to the public site without importing animated route decoration into operational workflows.

**The Surface-Boundary Rule.** Share identity and accessibility primitives across public and authenticated surfaces; keep their information density, navigation models, signature visuals, and motion grammars distinct.

## Elevation & Depth

The system is flat by default. Paper-on-canvas contrast, borders, sticky positioning, and tonal bands establish most depth. Shadows are reserved for elements that genuinely sit above the ledger: primary actions, transient toasts, and the open drawer.

### Shadow Vocabulary

- **Action lift** (`0 6px 14px rgba(11,61,145,.16)`): Primary buttons only.
- **Toast lift** (`0 16px 32px rgba(10,30,65,.18)`): Transient confirmation messages.
- **Drawer lift** (`-20px 0 45px rgba(5,24,53,.18)`): Separates the request form from the dimmed workspace.
- **Active inset** (`inset 3px 0 0 #D4A017`): Marks the current navigation destination.

**The Flat Ledger Rule.** Resting records use rules and tonal contrast; shadows belong only to active elevation or transient layers.

## Shapes

Panels use gently curved 14px corners, controls use 9–10px corners, compact state labels use 5–6px corners, and identity marks may be circular. One-pixel borders and clipped panel edges reinforce the ledger metaphor. Avoid exaggerated pills except for true circular identity marks or compact count badges.

## Components

### Buttons

- **Shape:** Compact, gently curved controls (9px) with 10px by 15px padding.
- **Primary:** Action navy with white text, 700 weight, and a restrained action-lift shadow.
- **Hover / Focus:** Hover deepens to dark action navy. Keyboard focus uses a 3px translucent gold outline with 2px offset.
- **Secondary / Ghost:** Secondary controls are transparent with a warm grey border; tertiary table and text actions are navy, flat, and often underlined.

### Chips

- **Style:** Compact status labels use a 6px radius, 5px by 8px padding, 10px bold type, and a pale semantic background.
- **State:** Blue communicates movement, gold waiting or checkpoint state, green success, red exception, and neutral completion or inactive state.

### Cards / Containers

- **Corner Style:** Gently curved panels (14px).
- **Background:** Warm Paper on Canvas.
- **Shadow Strategy:** Flat at rest; depth comes from border and surface contrast.
- **Border:** One-pixel Hairline divisions.
- **Internal Padding:** Typically 19–22px; report actions expand to 28px.

### Inputs / Fields

- **Style:** White field, warm grey 1px border, 9px radius, and 11px by 12px padding.
- **Focus:** Shared 3px translucent gold outline with 2px offset.
- **Error / Disabled:** Validation and request failures use a pale red field-level banner with Exception Red text. Disabled primary actions retain their shape and lose emphasis through 50% opacity.
- **Forms:** Labels sit 7px above their fields in compact bold body type. Drawer forms use 19px vertical rhythm; related pairs may share a row on desktop and must stack below 600px. Form actions are separated by a hairline rule and align to the trailing edge.

### Navigation

The desktop rail is deep institutional navy with muted blue-grey labels. Items use 10px corners and 11px by 12px padding. Hover and active states lift to a lighter navy; active state adds a 3px gold inset rule. On narrow screens, the same rail slides in from the left and retains its labels, hierarchy, and profile context.

Navigation destinations are role-filtered before rendering. The profile block states the signed-in role, while unavailable create and mutation actions are omitted rather than shown as traps. Where a record still needs to communicate its state, editable selects become semantic status labels or a quiet “Read only” note.

### Authenticated Entry

Sign-in uses a two-part composition: a Warm Paper credential sheet and an Institutional Navy context field. The credential sheet carries the brand, a large editorial promise, two conventional fields, an inline error region, and a full-width secure primary action with an explicit busy state. The context field explains the product through three hairline-led principles rather than decorative illustration. Below 900px, retain the credential sheet and remove the context field.

### System States

Loading is a compact Action Navy line with a rotating indicator above the workspace. Recoverable request failures use a pale Exception Red banner with a visible “Try again” action. Empty states use centered, low-density copy and a small gold icon; compact variants sit inside lists, evidence sections, and queues without inflating the surrounding panel. Success is reported in a dark navy toast with a gold confirmation icon.

**The Adjacent Feedback Rule.** Place loading, errors, and empty explanations next to the operation or record they describe; never replace the entire control tower with an abstract state screen.

### Movement Ledger

Desktop records use a dense table with a warm-grey header band, uppercase labels, 15px by 16px cells, hairline row divisions, and inline state labels. Below 780px, each record becomes a stacked summary that preserves reference, status, client, service, route, promise or contribution, and the next action.

### Dispatch Brief

The dispatch brief is not a card. It is a full-width operational sentence bounded by horizontal rules, pairing an editorial heading with live numeric facts. It stacks at 1100px and converts the facts into a compact two-column grid on mobile.

### Drawer and Toast

Request intake opens in a right-edge paper drawer over a navy-tinted backdrop and uses a 250ms ease-out entrance. Toasts appear near the top-right on desktop and span the mobile workspace with clear contrast. Reduced-motion preference collapses animation and transition duration to 0.01ms.

### Evidence Drawer

Job evidence uses the same right-edge paper layer at a wider 620px maximum. Its title binds the layer to the job reference, client, and route. Editable roles see compact milestone and document-upload forms first; every role sees the audit trail and document ledger, including grounded empty states. File selection uses a dashed 10px field with an upload icon, while stored documents read as hairline-divided links with file metadata. On mobile, milestone and upload grids collapse to one column.

## Do's and Don'ts

### Do:

- **Do** preserve the warm-paper ledger structure with hairline rules and flat resting surfaces.
- **Do** keep the primary request-intake action visible in the operational frame.
- **Do** use gold sparingly for priority, focus, progress, and identity.
- **Do** translate dense tables into readable record summaries below 780px.
- **Do** preserve keyboard focus and reduced-motion behavior in every new interactive component.
- **Do** keep login, feedback, forms, and evidence attached to the same paper, navy, gold, and hairline vocabulary.
- **Do** communicate role limits by removing unavailable actions and preserving a clear read-only record state.
- **Do** keep workspace search visible and usable on mobile, even when secondary top-bar controls recede.
- **Do** use the approved supplied globe-and-arrows logo asset and select only from its full-colour, black, white, greyscale, and full-colour-on-navy variants.
- **Do** reproduce “Connecting Solutions. Delivering Excellence.” and “From Strategy to Delivery.” exactly as approved.
- **Do** keep `/`, `/services`, `/about`, and `/contact` as separate public pages with route-aware navigation.
- **Do** position expert human coordination as the primary service and the client portal as an optional continuation.
- **Do** make Connected Routes meaningful and fully understandable in its static reduced-motion state.
- **Do** recompose route geometry and content hierarchy for narrow screens rather than shrinking the desktop composition.

### Don't:

- **Don't** turn every content group into an elevated card or add ambient shadow to resting records.
- **Don't** use red, green, or gold as arbitrary decoration.
- **Don't** introduce rounded pill styling as the default component language.
- **Don't** compress desktop tables until labels and values become unreadable on mobile.
- **Don't** use Newsreader for controls, labels, or dense operational data.
- **Don't** render disabled or forbidden mutation controls when a role has no path to use them.
- **Don't** turn loading, error, or empty states into decorative full-page interruptions.
- **Don't** separate job evidence from its reference, audit trail, and document context.
- **Don't** redraw, reconstruct, retype, replace, recolour, stretch, skew, rotate, distort, or otherwise alter the approved globe-and-arrows artwork.
- **Don't** implement primary marketing navigation as home-page section jumps or hash-link substitutes for real routes.
- **Don't** present the portal as mandatory, self-service automation as the product, or unverified scale and performance claims as proof.
- **Don't** turn route lines into a looping screensaver, particle field, decorative map, or delay before content becomes available.
- **Don't** import public-site route choreography, spacious composition, or promotional density into the authenticated Control Tower.
