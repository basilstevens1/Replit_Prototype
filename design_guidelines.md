# Impact Altruism - Design Guidelines

## Design Approach Documentation
**Selected Approach:** Reference-Based (Notion + Linear inspiration)
**Justification:** Productivity-focused app requiring clean data visualization with emotional storytelling elements
**Key Principles:** Clean hierarchy, purposeful color usage, data-first design with human connection

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light mode: 220 15% 25% (deep blue-gray)
- Dark mode: 220 15% 85% (light blue-gray)

**Background Colors:**
- Light mode: 0 0% 98% (warm white)
- Dark mode: 220 15% 8% (dark blue-gray)

**Accent Colors:**
- Success/Impact: 142 76% 36% (emerald green)
- Warning/Attention: 25 95% 53% (warm orange)

**Semantic Colors:**
- Lives saved: 142 76% 36%
- QUALYs: 204 94% 52%
- Story highlights: 25 95% 53%

### B. Typography
**Primary Font:** Inter (Google Fonts)
- Headers: 600-700 weight
- Body: 400-500 weight
- Data/Numbers: 500-600 weight (tabular-nums)

**Font Hierarchy:**
- Hero/Page titles: text-4xl font-semibold
- Section headers: text-2xl font-semibold
- Card titles: text-lg font-medium
- Body text: text-base font-normal
- Captions/metadata: text-sm text-gray-600

### C. Layout System
**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4, p-6
- Section spacing: mb-8, mb-12
- Card spacing: gap-4, gap-6
- Container margins: mx-4, mx-8

**Grid System:**
- Main container: max-w-7xl mx-auto
- Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard: 70/30 split for main content/sidebar

### D. Component Library

**Navigation:**
- Top navigation bar with logo, view toggle (Qualitative/Quantitative), user profile
- Sidebar for time period selection (Monthly/Annual/Lifetime)
- Breadcrumb navigation for deep sections

**Data Display:**
- Impact cards with large numbers, colored indicators, and context
- Story cards with rounded corners, subtle shadows, and featured imagery
- Interactive charts using muted colors with green accents for positive impact
- Progress bars and meters for goal tracking

**Forms:**
- Donation entry form with charity autocomplete
- Clean input fields with proper labels and validation states
- Date pickers for donation timeline

**Overlays:**
- Modal dialogs for detailed story viewing
- Tooltip overlays for metric explanations
- Slide-out panels for additional context

### E. Animations
**Minimal approach:**
- Subtle fade-in for data loading states
- Smooth transitions between Qualitative/Quantitative views (300ms)
- Gentle hover states on interactive elements
- NO complex animations or distracting effects

## Images
**Hero Section:** No large hero image - focus on clean dashboard layout
**Story Cards:** Small thumbnail images (aspect ratio 16:9) for charity stories and impact photos
**Charity Logos:** Small, circular logo displays for donation attribution
**Icons:** Heroicons for navigation, metrics, and UI elements via CDN

## Key Visual Treatments
**Cards:** Subtle borders, minimal shadows, rounded corners (rounded-lg)
**Buttons:** Primary actions in accent green, secondary in outlined style
**Data Visualization:** Clean charts with minimal gridlines, emphasizing data over decoration
**White Space:** Generous spacing between sections to avoid cognitive overload
**Contrast:** Strong typography hierarchy with sufficient color contrast for accessibility