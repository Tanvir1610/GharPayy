# 🏠 Gharpayy – PG Reservation Platform

A full-stack PG (Paying Guest) reservation system built with **Next.js 15**, **Supabase**, and **Tailwind CSS**, featuring 30+ verified Bangalore PGs with complete booking, visit scheduling, and admin management.

---

## ✨ Features

### For Tenants
- 🔍 Browse 30+ verified PGs across Bangalore with smart filters
- 🎯 Smart Match engine scores PGs against your preferences
- 📅 Online booking with room selection + cost breakdown
- 🗓️ Schedule visits with date + time slot selection
- ❤️ Save favorite PGs
- 📊 Personal dashboard: bookings, visits, saved PGs
- 📝 Post your requirement form (auto-matches PGs)

### For Owners / Admins
- 🏢 Admin dashboard with KPIs (PGs, users, bookings)
- ✅ Booking approval / rejection
- 📈 PGs by area analytics
- 👥 Lead management

### Technical
- **Next.js 15** App Router with Server Components
- **Supabase** Auth + PostgreSQL + Row Level Security
- **TypeScript** end-to-end
- **Tailwind CSS** with custom design system (Syne + DM Sans fonts)
- **Framer Motion** animations
- API routes for all data operations
- Responsive mobile-first design

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
The `.env.local` file is already configured with your Supabase project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://cuaoprxlcbornfxkxkot.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up the database
Run the SQL schema in your Supabase project:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → SQL Editor
3. Paste and run the contents of `supabase/schema.sql`

### 4. Seed PG data
```bash
npx tsx scripts/seed.ts
```
This seeds **30+ real PGs** from Gharpayy's data across:
- Koramangala, Bellandur, Whitefield
- Mahadevapura, Marathahalli, Electronic City
- HSR Layout, Jayanagar, MG Road, Nagawara

### 5. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage (hero, areas, featured PGs)
│   ├── browse/page.tsx          # PG listing with filters
│   ├── pg/[id]/page.tsx         # PG detail + booking
│   ├── post-requirement/        # Lead form
│   ├── dashboard/page.tsx       # Tenant dashboard
│   ├── admin/page.tsx           # Admin panel
│   ├── login/ & register/       # Auth pages
│   └── api/                     # REST API routes
│       ├── pgs/route.ts
│       ├── bookings/route.ts
│       └── leads/route.ts
│
├── components/
│   ├── layout/                  # Navbar, Footer
│   ├── pg/                      # PGCard, BrowseClient, PGDetailClient, HeroSearch
│   ├── booking/                 # BookingModal, VisitModal
│   └── dashboard/               # DashboardClient, AdminClient
│
├── lib/
│   ├── supabase/                # client.ts, server.ts
│   ├── utils.ts                 # helpers
│   └── smartMatch.ts            # matching algorithm
│
├── hooks/
│   ├── useAuth.ts               # auth state
│   └── usePGs.ts                # PG data fetching
│
└── types/index.ts               # all TypeScript types
```

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User accounts (extends auth.users) |
| `pg_properties` | PG listings with all details |
| `bookings` | Booking requests and confirmations |
| `visit_schedules` | Visit appointments |
| `leads` | Enquiry / requirement forms |
| `saved_pgs` | User wishlists |
| `reviews` | PG ratings and comments |

All tables have **Row Level Security (RLS)** enabled.

---

## 🌐 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL
```

---

## 👤 Creating an Admin User

1. Register normally at `/register`
2. In Supabase SQL Editor, run:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```
3. Sign in and visit `/admin`

---

## 🎨 Design System

- **Primary font**: Syne (display/headings)
- **Body font**: DM Sans
- **Brand orange**: `#f97316` (Tailwind `orange-500`)
- **Dark navy**: `#1a1730`
- **Design tokens**: CSS variables in `globals.css`

### Key CSS classes
```css
.btn-primary    /* orange gradient button */
.btn-secondary  /* white outlined button */
.card           /* white rounded card with hover */
.input          /* styled form input */
.badge          /* pill badge */
.filter-chip    /* toggle filter button */
```

---

## 📋 PG Data Coverage

Sourced from Gharpayy's IQ sheet — covers **30 PGs** across **10 areas**:

| Area | PGs | Gender Types |
|------|-----|-------------|
| Koramangala | 14 | Boys, Girls, Co-live |
| Bellandur | 4 | Co-live |
| Mahadevapura | 4 | Co-live |
| Whitefield | 2 | Co-live |
| Marathahalli | 3 | Co-live |
| Electronic City | 2 | Co-live |
| HSR Layout | 2 | Co-live (Premium) |
| Jayanagar | 1 | Girls |
| MG Road | 1 | Girls |
| Nagawara | 2 | Co-live |

---

## 📄 License

Private — Gharpayy © 2025
