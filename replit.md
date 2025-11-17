# Arabic Fonts Library Platform

## Overview

An Arabic fonts library platform inspired by Google Fonts and Adobe Fonts, designed specifically for Arabic typography with RTL (right-to-left) interface support. The platform features a curated collection of 34 Arabic fonts organized across multiple categories (Thuluth, Diwani, Ruqaa, Kufi, Naskh) with real-time font rendering and customizable preview capabilities.

## Recent Changes (November 2025)

**Latest Update - Timestamp Sorting System:**
- Added `addedAt` timestamp field to font schema for tracking when fonts are added
- Fonts now display in reverse chronological order (newest first)
- New fonts automatically appear at the top of the list
- Added 10 new Kufi fonts (total now 16 Kufi fonts)
- Total font count: 34 fonts

**Single-Page Architecture:**
- Consolidated to single homepage displaying all fonts
- "الخطوط المميزة" (Featured Fonts) integrated as a category filter
- Category filter order: "الكل" → "الخطوط المميزة" → individual categories
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
- Fonts sorted by addedAt in descending order (newest first)
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
  - ثلث: 2 fonts
  - ديواني: 6 fonts
  - رقعة: 2 fonts
  - كوفي: 16 fonts (recently added 10 new fonts)
  - نسخ: 8 fonts
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