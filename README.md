# Goat Notes

A note-taking web application built with Next.js. Created while following the [freeCodeCamp Next.js tutorial](https://www.youtube.com/watch?v=6ChzCaljcaI&t=3253s) by Antonio Erdeljac as a way to learn Next.js fundamentals.

## Features

- **Create & edit notes** — start a new note with one click; changes are auto-saved with a short debounce
- **Delete notes** — remove a note with a confirmation prompt
- **Fuzzy search** — filter through your notes in real time using Fuse.js
- **Authentication** — email/password sign-up and login via Supabase
- **Dark / light theme** — toggle between themes with system-preference detection
- **Auto-load** — middleware automatically opens the most recently edited note on launch

## Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript |
| Database | PostgreSQL via [Prisma](https://www.prisma.io) |
| Auth | [Supabase](https://supabase.com) (email/password) |
| UI | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Search | [Fuse.js](https://www.fusejs.io) |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A PostgreSQL database (Supabase provides one by default)

### Environment variables

Create a `.env.local` file in the project root with the following values:

```env
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
DATABASE_URL=<your-postgresql-connection-string>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Installation

```bash
npm install
```

### Database setup

Run Prisma migrations to create the required tables:

```bash
npm run migrate
```

### Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── actions/        # Server actions (note CRUD, auth)
├── app/            # Next.js App Router pages
│   ├── page.tsx        # Main note editor
│   ├── login/          # Login page
│   └── sign-up/        # Sign-up page
├── auth/           # Supabase client helpers
├── components/     # React components (sidebar, editor, UI)
├── db/             # Prisma schema
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and constants
├── middleware.ts   # Auth & routing middleware
├── providers/      # React context providers
└── styles/         # Global styles
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server with Turbopack |
| `npm run build` | Generate Prisma client and build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run migrate` | Generate Prisma client and run database migrations |
