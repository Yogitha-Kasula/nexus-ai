# Nexus AI

A consultation booking website where visitors can explore services, submit an
inquiry, and book a call. Inquiries are stored in a Supabase database, and
bookings are handled through Cal.com.

## Features

- Responsive landing page with scroll animations
- Inquiry form that saves leads to Supabase
- Cal.com booking link for scheduling consultations
- Component-based React codebase

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- GSAP (ScrollTrigger) and Motion for animations
- Lucide React (icons)
- Supabase (database)
- Cal.com (scheduling)

## Getting Started

**Prerequisites:** Node.js

1. Clone the repository

```bash
git clone https://github.com/Yogitha-Kasula/nexus-ai.git
cd nexus-ai
```

2. Install dependencies

```bash
npm install
```

3. Create your environment file

Copy `.env.example` to `.env` and fill in your values.

4. Start the development server

```bash
npm run dev
```

The app runs at http://localhost:3000.

## Database Setup

Create an `inquiries` table in your Supabase project (SQL Editor) before using
the contact form.

## Configuration

The Cal.com booking link is set in `src/App.tsx` (`CAL_COM_URL`). Replace it
with your own link.

## Author

Yogitha Kasula
