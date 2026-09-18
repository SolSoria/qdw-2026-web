# Quito Design Week 2026

React + TypeScript migration of the QDW26 website, powered by Vite. The original visual assets are preserved in `public/assets`.

## Local development

```bash
npm install
npm run dev
```

The `/admin` route is a content-management UI for programs, speakers, and workshops. It currently persists edits in browser `localStorage`, which makes the interface usable immediately while the Supabase project is configured.

## Recommended production architecture

Use **Supabase** rather than a self-managed free PostgreSQL host:

- Supabase Postgres stores structured content and user roles.
- Supabase Auth handles admin login and invitations.
- Supabase Storage stores images in the `site-media` bucket, with CDN delivery and image transformations.
- Row Level Security limits writes to rows linked to `admin_users`; public visitors only read published content.

Run `supabase/schema.sql` in the Supabase SQL editor, add the values from `.env.example`, then replace the local-storage adapter in `src/App.tsx` with Supabase queries. Never expose a service-role key in the browser. A paid tier may be needed once image traffic or storage exceeds the free quotas.
