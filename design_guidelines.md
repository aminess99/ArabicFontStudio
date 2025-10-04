# Design Guidelines - Arabic Fonts Library Platform

## Design Approach
**Reference-Based**: Inspired by Google Fonts and Adobe Fonts, adapted for Arabic typography and RTL interface. Focus on showcasing fonts beautifully while maintaining excellent usability for Arabic-speaking designers and developers.

## Core Design Elements

### A. Color Palette
**Dark Mode** (Primary):
- Background: 220 20% 12% (Deep slate)
- Surface: 220 18% 16% (Card backgrounds)
- Primary: 200 90% 55% (Vibrant cyan-blue for CTAs)
- Text Primary: 0 0% 98%
- Text Secondary: 220 10% 70%
- Border: 220 15% 25%
- Accent: 280 70% 60% (Purple for highlights)

**Light Mode**:
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary: 200 90% 45%
- Text Primary: 220 20% 15%
- Text Secondary: 220 10% 45%
- Border: 220 15% 88%

### B. Typography
**Primary Font**: Cairo (Google Fonts) - Modern Arabic font
- Headings: 700 weight
- Body: 400-500 weight
- Sizes: 3xl/2xl for hero, xl for sections, base for content

**Display Font for Examples**: Variable based on selected font being previewed

### C. Layout System
**RTL-First Design** with consistent spacing:
- Container: max-w-7xl mx-auto
- Section padding: py-16 md:py-24
- Component spacing: gap-4, gap-6, gap-8
- Grid gaps: gap-6 for cards

### D. Component Library

**Navigation**:
- Sticky header with blur backdrop
- Right-aligned logo (RTL)
- Search bar prominently featured
- Category filters as tabs below header

**Font Display Cards**:
- Large preview area showing font name in its own typeface
- Customizable preview text input (placeholder: "اكتب هنا للمعاينة")
- Font metadata (designer, style, file formats)
- Download button (primary) + Quick Preview button (outline)
- Card hover: subtle lift with shadow

**Font Preview Modal**:
- Full-screen overlay with large sample text
- Size slider (16px - 72px)
- Sample text options: Headlines, Paragraphs, Numbers
- Download options for different formats
- Close on backdrop click

**Search & Filters**:
- Prominent search bar in header
- Category chips: كوفي، نسخ، ديواني، حديث، تقليدي
- Style filters: عادي، سميك، خفيف
- Sort options: الأحدث، الأكثر تحميلاً، الأبجدية

**Admin Upload Interface** (if applicable):
- Drag-and-drop zone for font files
- Form fields: اسم الخط، الوصف، المصمم، الفئة
- Multi-format upload support
- Preview before publishing

### E. Page Sections

**Hero Section** (60vh):
- Large typography: "مكتبة الخطوط العربية الاحترافية"
- Subtitle: "اكتشف، عاين، وحمّل أجمل الخطوط العربية"
- Animated search bar with glow effect
- Background: Subtle gradient mesh (220 20% 12% to 240 20% 14%)

**Featured Fonts Section**:
- Carousel/Grid of 6-8 popular fonts
- Each card: 280px height, font preview + metadata
- "المميزة" badge for featured items

**Browse by Category**:
- 2-column grid on mobile, 4-column on desktop
- Category cards with icon + count
- Smooth hover transitions

**All Fonts Gallery**:
- Masonry/Grid layout (1 col mobile, 2 md, 3 lg)
- Infinite scroll or pagination
- Loading skeletons for better UX

**Footer**:
- Newsletter signup: "اشترك لتصلك الخطوط الجديدة"
- Quick links: الخطوط، الفئات، عن المشروع، اتصل بنا
- Social media icons
- Copyright info

## Images
No hero image required. Focus on typography as the visual centerpiece. Use abstract geometric patterns or subtle gradients as backgrounds where needed.

## Accessibility & RTL
- Full RTL support (dir="rtl" on html)
- Proper Arabic font rendering
- High contrast ratios (WCAG AAA)
- Keyboard navigation for all interactive elements
- Screen reader labels in Arabic
- Form inputs with Arabic placeholders

## Key Interactions
- Smooth font preview on hover (show quick stats)
- Click to open full preview modal
- Live preview text updates as you type
- Download button with format selection dropdown
- Toast notifications for downloads (in Arabic)
- Smooth page transitions

**Critical**: All text, labels, and UI elements must be in Arabic. Button text examples: "تحميل"، "معاينة"، "بحث"، "تصفية"