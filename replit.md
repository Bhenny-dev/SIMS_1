# SIMS - Sports Information Management System

## Overview
SIMS is a comprehensive sports information management system built with React, TypeScript, and Vite. It provides a platform for managing teams, events, leaderboards, and user profiles in a sports/academic competition environment.

## Project Architecture
- **Frontend Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Routing**: React Router DOM 7.9.5
- **UI Components**: Tailwind CSS (via CDN), Bootstrap Icons
- **Charts**: Recharts 3.3.0
- **Animations**: Framer Motion 11.3.1
- **AI Integration**: Google Gemini AI (@google/genai 1.29.0)

## Key Features
- User authentication (login/signup) with role-based access (Admin, Officer, Team Lead, User)
- Team management and leaderboards
- Event management with multiple categories (Literary, Arts, Sports, CIT Quest, General Assembly)
- Real-time notifications system
- AI-powered event guidelines generation using Gemini
- Reports and suggestions system
- Dark mode support

## Technical Details
- **Data Storage**: Mock API using localStorage (no separate backend)
- **Port**: 5000 (configured for Replit webview)
- **Host**: 0.0.0.0 (allows proxy access through Replit iframe)
- **Base Path**: / (configured for Replit deployment)

## Environment Variables
- `GEMINI_API_KEY`: Required for AI-powered event guideline generation

## Current State
- Successfully imported from GitHub
- Configured for Replit environment
- Development server running on port 5000
- Workflow set up and running

## Recent Changes (November 12, 2025)
- Migrated from GitHub Pages configuration to Replit
- Changed port from 3000 to 5000 for Replit compatibility
- Updated base path from `/SIMS_1/` to `/` 
- Added HMR configuration for proper hot reload through Replit proxy
- Added `allowedHosts: true` to allow Replit proxy host
- Configured workflow for webview output
- Updated .gitignore to preserve Replit configuration files
- Added GEMINI_API_KEY environment variable for AI features
- Configured deployment settings for autoscale deployment

## User Preferences
None set yet.

## Dependencies Management
All dependencies are managed through npm and are listed in package.json. The project uses Vite for development and building.
