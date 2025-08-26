# Vercel Deployment Guide

## Prerequisites
1. Supabase project with database tables set up
2. Vercel account

## Steps to Deploy

### 1. Prepare Environment Variables
In your Vercel dashboard, add these environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NODE_ENV`: Set to `production`

### 2. Database Setup
Run the SQL commands in `supabase-schema.sql` in your Supabase SQL editor to create the required tables.

### 3. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to connect your GitHub repo
```

### 4. Configure Build Settings
Vercel should automatically detect the configuration from `vercel.json`, but verify:
- Build Command: `npm run vercel-build`
- Output Directory: `dist`
- Functions: `api/`

## Files Added for Vercel Compatibility
- `vercel.json` - Vercel configuration
- `api/index.ts` - Serverless function entry point
- `.env.example` - Environment variables template

## Important Notes
- Frontend will be served as static files
- Backend API will run as Vercel serverless functions
- Database connections use Supabase (already configured)
- File uploads and real-time features may need additional configuration