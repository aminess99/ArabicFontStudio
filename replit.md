# Arabic Fonts Library Platform

## Overview

An Arabic fonts library platform inspired by Google Fonts and Adobe Fonts, designed specifically for Arabic typography with RTL (right-to-left) interface support. The platform features a curated collection of 143 Arabic fonts organized across multiple categories (Thuluth, Diwani, Ruqaa, Kufi, Naskh, Design) with real-time font rendering and customizable preview capabilities.

## Recent Changes (November 2025)

**Latest Update - SEO Optimization (November 20, 2025):**
- Added dynamic sitemap.xml endpoint (automatically includes all pages)
- Added robots.txt endpoint for search engine crawlers
- Implemented Schema Markup (JSON-LD) for all pages:
  - Organization schema for xfontat brand
  - WebSite schema with SearchAction
  - CollectionPage schema for font listings (Home and Design Fonts pages)
  - ItemList schema for font collections
  - WebPage schema for static pages (About, Contact, Privacy, Terms)
- Created SEOHead component for dynamic meta tags and structured data
- Enhanced meta tags for all pages with unique titles and descriptions
- Improved Open Graph and Twitter Card metadata

**Previous Update - Added Design Fonts Category (November 20, 2025):**
- Added new "تصميم" (Design Fonts) category with 78 professional fonts
- Created dedicated page at /design-fonts for design fonts
- Updated font count: 143 total fonts
- Design fonts include GE fonts collection (GE-Aridi, GE-Dinar, GE-Heritage, etc.)
- Added navigation link in header and footer
- Sorting order: newest fonts first (appear on page 1), oldest fonts on last pages

**Previous Update - Added Diwani Fonts (November 20, 2025):**
- Added 6 new Diwani fonts to the library
- Updated font count: 65 total fonts (before design fonts)
- Diwani category now has 12 fonts (up from 6)
- New fonts: az-topaz, diwani-outline-shaded, diwani-simple-outline, hawi-t-diwany, ukij-diwani-tom-arabic, ul-amjad

**Previous Update - Added Ruqaa Fonts Batch 2 (November 19, 2025):**
- Added 7 new Ruqaa fonts to the library (with alfont_com_ prefix removed)
- Updated font count: 59 total fonts
- Ruqaa category now has 18 fonts (up from 11)
- New fonts: 29LT-Azer-Bold, Almaghribi-Warsh-Quran, GraphicSchool-Regular, Palestine-Regular, Tasees-Bold, خط-القلعة, خط-بلاس

**Previous Update - Added Naskh Fonts (November 19, 2025):**
- Added 5 new Naskh fonts to the library (with alfont_com_ prefix removed)
- Updated font count: 52 total fonts
- Naskh category now has 13 fonts (up from 8)
- New fonts: AQEEQSANSPRO-Bold, Kaeeb-Serif, RTL-Lustrous-Bold, SIMPLEX-DISPLAY, Trox-R

**Previous Update - Added Ruqaa Fonts (November 19, 2025):**
- Added 9 new Ruqaa fonts to the library
- Updated font count: 47 total fonts
- Ruqaa category now has 11 fonts (up from 2)

**Previous Update - Font Cleanup (November 18, 2025):**
- Removed MCS Tholoth font family (4 fonts)
- Updated font count: 38 total fonts
- Thuluth category now has 6 fonts (down from 10)

**Previous Update - SEO Enhancement & Additional Pages:**
- Enhanced SEO with comprehensive meta tags (title, description, keywords)
- Added Open Graph and Twitter Card meta tags for social media sharing
- Implemented JSON-LD structured data for better search engine understanding
- Created essential pages: About, Contact, Privacy Policy, Terms of Service
- Added Footer component with navigation links to all pages
- Canonical URL and proper robots meta tags configured

## Previous Updates (November 2025)

**Previous Update - Timestamp Sorting System:**
- Added `addedAt` timestamp field to font schema for tracking when fonts are added
- Fonts display in reverse chronological order (newest first)
- New fonts automatically appear on the first page
- Added 10 new Kufi fonts (total now 16 Kufi fonts)
- Added 8 new Thuluth fonts (total now 10 Thuluth fonts)

**Single-Page Architecture:**
- Consolidated to single homepage displaying all fonts
- Category filter order: "الكل" → individual categories (ثلث، ديواني، رقعة، كوفي، نسخ)
- Removed separate /fonts page for simpler navigation

**Font Library Cleanup:**
- Removed 36 duplicate and similar fonts
- Added `featured` flag to schema to mark premium fonts
- Created curated list of 17 featured fonts showcasing best from each category

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Component Library:**
- Shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom RTL-first design system
- CSS variables for theming (dark/light mode support)
- Cairo font from Google Fonts as the primary Arabic typeface

**State Management:**
- React Query for server state (fonts data)
- Local React state for UI interactions (search, filters, preview text, font size, favorites)
- Theme context for dark/light mode persistence

**UI Layout Design (November 2025 Update):**
- **List-based interface**: Simplified vertical list layout instead of card grid
- **Two-section header**: 
  - Top: Logo, search bar, theme toggle
  - Bottom toolbar: Preview text input, font size slider (16-72px), items per page selector
- **Global preview controls**: All fonts display the same customizable preview text at the same adjustable size
- **Horizontal category filters**: Tag/chip style category selection
- **Font list items**: Each row displays font name, large preview, favorite heart icon, and green download button
- **Favorites system**: Heart icons toggle to mark/unmark favorite fonts
- **Limited display**: Shows 10 fonts at a time with counter ("الخطوط 1 - 10 من 60")

**Key Design Decisions:**
- RTL-first layout system to properly support Arabic text flow
- Dynamic font loading system that injects @font-face rules at runtime
- Category-based filtering with horizontal chips/tags
- Single search input in header (removed hero section for simplicity)
- Global preview text and font size controls in header toolbar
- Toast notifications for user feedback on downloads
- Minimalist list design inspired by professional font libraries

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Custom Vite middleware integration for SSR-ready setup
- In-memory storage implementation (MemStorage class)

**Data Layer:**
- Drizzle ORM configured for PostgreSQL (schema defined, database not yet connected)
- Schema defines fonts table with fields: id, name, nameArabic, description, designer, category, style, fileUrl, fileName, fileFormat, featured (boolean), addedAt (timestamp)
- Zod validation for runtime type checking of font data
- Fonts sorted by addedAt in descending order (newest first, oldest on last pages)
- Featured fonts system marks highest-quality fonts for homepage display

**API Endpoints:**
- GET /api/fonts - Retrieve all fonts
- GET /api/fonts/:id - Retrieve single font by ID
- POST /api/fonts - Create new font entry
- DELETE /api/fonts/:id - Remove font entry

**Font Loading Strategy:**
- Server startup script (`load-fonts.ts`) scans `/client/public/fonts` directory
- Organizes fonts by category folders (ثلث, ديواني, رقعة, كوفي, نسخ)
- Automatically extracts metadata from file structure
- Extracts file modification time (mtime) as `addedAt` timestamp for sorting
- Supports TTF, OTF, WOFF, WOFF2 formats
- Current font distribution:
  - ثلث: 6 fonts
  - ديواني: 12 fonts
  - رقعة: 18 fonts
  - كوفي: 16 fonts
  - نسخ: 13 fonts
  - تصميم: 78 fonts
  - Total: 143 fonts
- Curated featured fonts list: 17 premium fonts selected for quality and uniqueness

**Key Architectural Decisions:**
- Storage abstraction with IStorage interface enables future database migration
- Font files stored in public directory for direct browser access
- File-based font discovery eliminates manual database seeding
- URL encoding handles Arabic filenames in font paths

### External Dependencies

**Core Libraries:**
- @tanstack/react-query - Server state management
- drizzle-orm & drizzle-zod - Database ORM and schema validation
- @neondatabase/serverless - PostgreSQL driver (configured but not active)
- zod - Runtime type validation

**UI Components:**
- @radix-ui/* - Headless UI component primitives (dialog, popover, dropdown, etc.)
- tailwindcss - Utility-first CSS framework
- class-variance-authority & clsx - Conditional className utilities
- lucide-react - Icon library

**Development Tools:**
- vite - Build tool and dev server
- typescript - Type checking
- tsx - TypeScript execution for server
- @replit/vite-plugin-* - Replit-specific development enhancements

**Font Processing:**
- Custom font loader utility handles dynamic @font-face injection
- Supports URL encoding for Arabic filenames
- Format detection from file extensions
- Font family name generation to avoid conflicts

**Notable Dependency Patterns:**
- All Radix UI components wrapped in custom components with consistent styling
- React Hook Form with Zod resolvers for form validation (configured but not actively used)
- Date-fns for date formatting utilities
- Wouter instead of React Router for smaller bundle size