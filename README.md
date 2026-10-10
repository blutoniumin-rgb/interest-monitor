# Kiss Monitor

A mobile-first app for couples. Share a **Love Nest** with a 6-character code, propose **Kiss Deals**, bargain over the price (up to 6 counter-offers between you), and watch your shared kiss total grow.

Built with Next.js 15, Neon Postgres, Drizzle ORM, Tailwind CSS v4 and Framer Motion.

## Setup

1. Create a free database at [neon.tech](https://neon.tech) and copy its connection string.
2. Create `.env.local`:

   ```bash
   cp .env.example .env.local
   # then fill in DATABASE_URL and SESSION_SECRET (openssl rand -base64 32)
   ```

3. Install and create the tables:

   ```bash
   npm install
   npm run db:migrate
   ```

4. Run it:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 on your phone (same Wi-Fi, use your computer's IP) or in a mobile-sized browser window. Use two browsers (or one private window) to play both partners.

## How it works

- **Get Started**: a name plus a 4-digit love code. A new name creates an account; the same name and code logs back in on any device. Five wrong codes lock the name for 5 minutes.
- **Love Nest**: one person taps *Build our Nest* and gets a code. The other taps *Fly into a Nest* and enters it. Each person can be in only one nest, and each nest holds two people.
- **Kiss Deals**: either partner proposes a deal with a kiss price. The other partner can accept, counter or decline. Counter-offers alternate, and there are 6 in total between you. After the 6th, the last price can only be accepted or declined.
- **Total**: accepting a deal adds its final price to the couple's total at the top of the home screen.
- **Live updates**: the app polls every 3 seconds, shows a toast for new deals and counter-offers, and puts a badge on the bell.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run db:generate` | Create a new migration after editing `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to Neon |
| `npm run db:studio` | Browse the database |

## Deploy on Vercel

1. Push this repo to GitHub and import it at [vercel.com/new](https://vercel.com/new). Framework preset is Next.js; no extra build settings.
2. In the project’s Environment Variables, add the same two values as `.env`:
   - `DATABASE_URL` — the Neon **pooled** connection string
   - `SESSION_SECRET` — a long random string (`openssl rand -base64 32`)
3. Apply migrations once against that database (`npm run db:migrate`) before the first visit. Vercel does not run them on deploy.
4. Deploy. Cookies are marked secure in production, so sign-in works on the `https` URL Vercel gives you.
