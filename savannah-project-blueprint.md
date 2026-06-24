# Savannah Water CMS: Project Blueprint & Roadmap

This document provides a comprehensive overview of the Savannah Water project architecture, implementation status, and future roadmap. It is designed to onboard AI agents and developers to the project's technical foundation.

---

## 1. Project Overview
Savannah Water is a luxury beverage brand landing page built with a focus on cinematic storytelling and high-end micro-interactions. The project includes a custom-built CMS (Content Management System) that allows administrators to manage text and media assets across the site without touching the codebase.

### Technical Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, GSAP (Animations), Lenis (Smooth Scroll).
- **Backend**: PHP 8.x (REST API), MySQL (Relational Database).
- **Authentication**: Custom PHP Session-based auth with CSRF protection and rate limiting.
- **Hosting**: Vercel (Frontend), Custom Linux Server (Backend/Database).

---

## 2. Core Architecture

### CMS Data Flow
The project uses a **"Shadow Field Resolution"** pattern for image handling:
1. **Media Library**: Images are uploaded and stored in the `media_assets` table.
2. **Persistence**: Section fields (e.g., `hero_image_id`) store only the integer ID of the asset.
3. **Backend Resolution**: PHP APIs (e.g., `get-homepage.php`) detect fields ending in `_id`, query the `media_assets` table, and inject companion `_url` and `_alt` fields into the JSON response.
4. **Frontend Consumption**: React components use a `getFullImageUrl()` helper to normalize paths and prefer CMS URLs over hardcoded local fallback assets.

### Admin Dashboard Structure
The Admin Dashboard (`src/pages/admin/Dashboard.tsx`) is a three-panel interface:
- **Panel 1 (Navigation)**: Main CMS modules (Home, About, Blog, Media Library, Settings).
- **Panel 2 (Module Structure)**: Vertical list of sections within the active module (e.g., Hero, Map, Farms).
- **Panel 3 (Editor)**: Dynamic form fields and media pickers for the selected section.

---

## 3. Implementation Status (June 2026)

### ✅ Phase 1: Authentication & Security
- Secure login with bcrypt hashing.
- CSRF middleware and rate-limiting for login attempts.
- Frontend route guards and `authService` for secure API communication.

### ✅ Phase 2: Homepage CMS Integration
- Full text and image management for all 8 homepage sections.
- Specialized editors for **Products Showcase** and **Heritage Stories**.
- Dynamic media picker integration for all homepage image fields.

### ✅ Phase 3: About Page CMS Integration
- 100% public rendering integration.
- Dynamic modules: **Hero**, **Story Timeline** (Alternating Layout), **Craftsmanship**, and **Signature Collections**.
- All sections prefer CMS assets with seamless local fallbacks.

### ✅ Phase 4: Media Library
- Centralized image management system.
- CRUD operations: Upload, Delete, and Metadata (Alt Text) management.
- Integrated `MediaPickerModal` for section-specific asset selection.

---

## 4. Roadmap: The Blog Module (Next Priority)

The next goal is to make the **Blog Page** fully functional, replicating the architectural success of the Home and About pages.

### Objective: Blog CMS Empowerment
We need to unlock the Blog module in the Admin Dashboard and implement a robust CRUD system for articles.

#### Step 1: Unlock Blog Module
- Enable the "Blog" tab in the Dashboard navigation.
- Configure `activePage === "blog"` state handling.

#### Step 2: Implement the Three-Panel Blog Interface
- **Panel 2 (Article List)**: A vertical list of all existing blog posts.
- **Panel 3 (Article Editor)**: A comprehensive editor for the selected post, including:
    - Title, Category, and Date.
    - Summary/Excerpt.
    - Featured Image (Media Picker).
    - Rich Text Content (Body).
    - Status (Draft/Published/Archived).

#### Step 3: Blog CRUD Features (Panel 2 Enhancement)
- **Create**: A "New Article" button at the top of Panel 2 to initialize a blank post.
- **Delete/Archive**: Quick actions on each article card in Panel 2 to remove or hide posts.
- **Search/Filter**: Ability to find articles by title or status.

#### Step 4: Public Rendering Integration
- Update the Blog landing page and individual article pages to consume the resolved CMS data.
- Maintain the luxury GSAP reveal animations while swapping static content for dynamic API data.

---

## 5. Directory Reference
- `/api`: PHP Backend (Controllers, Middleware, Config).
- `/src/services`: Frontend API communication services.
- `/src/hooks`: Custom React hooks for state management (e.g., `useHomepageCms`, `useAboutPageCms`).
- `/src/pages/admin`: Admin Dashboard and specialized section editors.
- `/src/screens`: Public-facing page components.
