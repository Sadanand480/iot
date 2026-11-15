# CloudHub — React Cloud Service Dashboard

A responsive service marketplace/dashboard prototype built with **React, Vite, Recharts, Framer Motion, and Lucide React**.

## Features

- Responsive dashboard layout with sidebar navigation
- Usage analytics chart and service distribution chart
- Search and category filtering for the service catalog
- Publish-service modal with form validation
- Subscribe/unsubscribe workflows
- My Subscriptions and My Services pages
- Service detail modal with endpoint display
- Profile settings
- Browser `localStorage` persistence
- Responsive mobile navigation and animations

## Run locally (Windows)

Install Node.js LTS first: https://nodejs.org/

1. Extract this ZIP.
2. Open the extracted project folder in VS Code.
3. Open Terminal > New Terminal.
4. Run these commands:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite, usually `http://localhost:5173`.

To create a production build:

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Create a GitHub repository and upload all project files.
2. Go to https://vercel.com/ and import that GitHub repository.
3. Vercel normally detects Vite automatically. Use:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click Deploy.

You can also deploy the same Vite frontend to Netlify: https://www.netlify.com/

## Important project scope

This version is a **frontend prototype**. It saves service records, profile settings, and subscriptions in the current browser using `localStorage`. The seeded service endpoints and analytics are sample/demo data. It does not yet have real user authentication, a shared backend, or a live API gateway.

For a true multi-user cloud application, add a backend REST API (for example Node.js + Express), authentication, and a shared database (such as PostgreSQL/Supabase). Then replace the localStorage data layer with API requests. Never put private API keys in frontend code.
