# Tournament Management Platform

## Overview

This is a Free Fire tournament management platform that allows organizers to create and manage tournaments while enabling players to discover and join competitive events. The application provides a comprehensive solution for tournament organization, player registration, and competition tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the client-side application
- **Vite** as the build tool and development server for fast development and optimized production builds
- **Wouter** for client-side routing, providing a lightweight alternative to React Router
- **TanStack Query** for server state management, caching, and synchronization
- **React Hook Form** with Zod validation for form handling and data validation
- **Tailwind CSS** for utility-first styling with custom design system variables
- **shadcn/ui** component library built on Radix UI primitives for accessible, customizable components

### Backend Architecture
- **Express.js** server with TypeScript providing RESTful API endpoints
- **Memory storage** implementation for development/testing (with interface for future database integration)
- **Middleware-based architecture** with request logging, error handling, and CORS support
- **Zod schema validation** for API request/response validation
- **Session-based architecture** ready for authentication implementation

### Database Design
- **Drizzle ORM** configured for PostgreSQL with type-safe database operations
- **Three main entities**:
  - Users (id, username, password)
  - Tournaments (comprehensive tournament data including prize pools, registration limits, status)
  - Tournament Registrations (linking users to tournaments with team information)
- **UUID primary keys** for all entities
- **Foreign key relationships** maintaining data integrity

### Development Workflow
- **Monorepo structure** with shared TypeScript schemas between client and server
- **Hot module replacement** in development with Vite integration
- **TypeScript path mapping** for clean imports (@/, @shared/)
- **Build process** that bundles both client and server for production deployment

### UI/UX Design System
- **Design tokens** defined in CSS variables for consistent theming
- **Component variants** using class-variance-authority for systematic styling
- **Responsive design** with mobile-first approach
- **Accessibility features** through Radix UI primitives
- **Custom color palette** with orange accent colors for Free Fire branding

### Tournament Features
- **Multiple tournament types** (solo, duo, squad)
- **Real-time status tracking** (open, starting, live, completed)
- **Prize pool management** with entry fees
- **Player registration limits** and current registration counts
- **Time-based registration deadlines**

## External Dependencies

### Core Technologies
- **@neondatabase/serverless** - Serverless PostgreSQL database connection
- **drizzle-orm** - Type-safe ORM for PostgreSQL operations
- **drizzle-kit** - Database migrations and schema management

### UI Components & Styling
- **@radix-ui/** - Accessible component primitives (dialogs, dropdowns, forms, etc.)
- **tailwindcss** - Utility-first CSS framework
- **class-variance-authority** - Component variant management
- **lucide-react** - Icon library

### State Management & Forms
- **@tanstack/react-query** - Server state management and caching
- **react-hook-form** - Form handling and validation
- **@hookform/resolvers** - Form validation resolvers
- **zod** - Schema validation library

### Development Tools
- **vite** - Build tool and development server
- **typescript** - Type safety and development experience
- **@vitejs/plugin-react** - React support for Vite
- **esbuild** - Fast JavaScript bundler for production builds

### Additional Utilities
- **wouter** - Lightweight client-side routing
- **date-fns** - Date manipulation and formatting
- **clsx** - Conditional className utilities
- **nanoid** - URL-safe unique ID generation