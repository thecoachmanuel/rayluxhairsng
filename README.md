# RayLux Hairs Storefront

RayLux Hairs is a Next.js storefront for selling premium human hair bundles, wigs, and accessories. It is optimized for fast loading, clean UX, and mobile responsiveness.

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Supabase (auth, database, and backend)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Environment Variables

Create a .env file in the project root and set:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_CURRENCY=₦
```

Do not commit secrets or private keys to version control.

## Supabase

Supabase is used for:

- Products (live catalogue)
- Orders and order items
- Coupons and discounts
- Storefront configuration (banner, hero slides, branding, shipping)
- Authentication

Ensure the Supabase tables are created to match the expected schema in the codebase.

## Scripts

- `npm run dev` – start development server
- `npm run build` – create production build
- `npm start` – run production server

