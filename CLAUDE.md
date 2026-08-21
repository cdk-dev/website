# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the cdk.dev website - a community hub for the Cloud Development Kit (CDK) ecosystem. It's built with Next.js (App Router) and deployed to Cloudflare Workers.

## Essential Commands

```bash
# Development
npm run dev           # Start Next.js dev server on http://localhost:3000
npm run build         # Build for production
npm run lint          # Run ESLint

# Deployment
npm run deploy:worker # Deploy to Cloudflare Workers (requires wrangler auth)

# Type checking
npx tsc --noEmit     # Run TypeScript type checking
```

## Architecture

### Tech Stack
- **Next.js <15** with App Router (`/app` directory)
- **React <19** with TypeScript
- **Cloudflare Workers** deployment via `@opennextjs/cloudflare`
- **Tailwind CSS** for styling with custom configuration
- **Bluesky API** integration for fetching community posts

### Key Architectural Patterns

1. **Data Fetching**: Server actions in `/app/_actions/` fetch content from Bluesky API
   - `actions.ts` - Fetches posts from @cdk.dev Bluesky account
   - Uses `@atcute/bluesky` client with hand-written TypeScript types
   - Implements caching and pagination

2. **Component Structure**:
   - All components in `/app/_components/` are client/server components as needed
   - Posts are fetched server-side and rendered with engagement metrics
   - Dynamic image optimization configured for S3 and Bluesky CDN

3. **Deployment Architecture**:
   - Primary: Cloudflare Workers via `wrangler.toml` configuration
   - Build output adapted by `@opennextjs/cloudflare`
   - Edge-optimized with static asset handling

### Critical Files

- `/app/layout.tsx` - Root layout with metadata, fonts, analytics
- `/app/_actions/actions.ts` - Bluesky API integration logic
- `/app/_components/PostList.tsx` - Main content display with pagination
- `/wrangler.toml` - Cloudflare Workers configuration
- `/next.config.mjs` - Image domains and optimization settings

## Development Guidelines

### When modifying posts/content:
- Posts are fetched from Bluesky API, not stored locally
- Check `/app/_actions/actions.ts` for API integration
- Posts support text, images, and embedded content

### When updating styles:
- Use Tailwind CSS utilities defined in `tailwind.config.ts`
- Global styles in `/app/globals.css`
- Component-specific styles use Tailwind classes

### When adding new pages:
- Create new directories under `/app` for routes
- Follow Next.js App Router conventions (page.tsx, layout.tsx)
- Ensure metadata is properly configured for SEO

### Image handling:
- External images from `s3.eu-central-003.backblazeb2.com` and `cdn.bsky.app` are configured
- Use Next.js Image component for optimization
- Public assets go in `/public/`