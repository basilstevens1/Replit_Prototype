# Impact Altruism - Replit Development Guide

## Overview

Impact Altruism is a web application designed to help users track and visualize the real-world impact of their charitable donations. The application combines quantitative impact metrics (lives saved, QUALYs gained) with qualitative storytelling to create an engaging and meaningful donor experience. Users can log their donations, view calculated impact statistics, and see stories from communities their donations have helped.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system supporting light/dark themes
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with session-based authentication
- **API Design**: RESTful endpoints with proper error handling and validation
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Data Storage
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle migrations for version-controlled database changes
- **Key Tables**: 
  - Users (Replit Auth integration)
  - Donations (user donation records with metadata)
  - Impact calculations (computed metrics)
  - Sessions (authentication session storage)

### Design System
- **Color Palette**: Reference-based design inspired by Notion/Linear with semantic colors for different impact metrics
- **Typography**: Inter font family with clear hierarchy for data visualization
- **Component Architecture**: Modular components with consistent spacing and hover effects
- **Responsive Design**: Mobile-first approach with grid layouts and adaptive components

### Impact Calculation Engine
- **Metrics**: Lives saved and QUALYs gained based on GiveWell effectiveness estimates
- **Data Sources**: Integrated effectiveness research for major charitable organizations
- **Time Periods**: Monthly, annual, and lifetime impact tracking
- **Visualization**: Charts and metrics cards showing donation trends and impact over time

### Story Integration System
- **Content Management**: Template-based story system with user donation matching
- **Media Assets**: Integrated image assets for storytelling components
- **Personalization**: Stories are connected to user donations when possible to show direct impact
- **Categories**: Stories organized by charity focus areas (health, education, water, etc.)

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting for production data storage
- **Replit Auth**: Integrated authentication system with OpenID Connect
- **Vite**: Build tool and development server with hot module replacement

### UI and Styling
- **Radix UI**: Headless component primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Chart library for data visualization components

### Data and Forms
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation for API requests and form data
- **date-fns**: Date manipulation and formatting utilities

### Development Tools
- **TypeScript**: Static type checking for both frontend and backend
- **Drizzle Kit**: Database migration and introspection tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Production Services
- **Replit Deployment**: Hosting platform with integrated development environment
- **Google Fonts**: Web fonts (Inter) for typography consistency
- **Generated Images**: Custom AI-generated images for story content