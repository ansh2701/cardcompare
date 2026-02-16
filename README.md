# CardCompare — Credit Card Comparison Platform

A modern, full-stack credit card comparison platform built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **SQLite**. Browse, filter, search, and compare 36+ Indian credit, debit, forex, and prepaid cards — with an AI chatbot powered by **Groq**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)

## ✨ Features

- **Browse Cards** — 36+ cards across credit, debit, forex, and prepaid categories
- **Smart Filters** — Filter by card type, network (Visa/Mastercard/Amex/RuPay), issuer, rewards type
- **Sort & Search** — Sort by popularity, rating, fee, rewards; full-text search
- **Card Details** — Visual card preview, key stats, features, benefits, eligibility, fee structure
- **Side-by-Side Comparison** — Compare up to 4 cards with detailed attribute table
- **Visual Charts** — Recharts bar & radar charts for fee/rewards/overall comparison
- **AI Chatbot** — Groq-powered assistant with RAG context from the card database
- **Dark Theme** — Premium glassmorphism design with smooth animations
- **Responsive** — Mobile-first design with hamburger nav and scrollable tables

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Seed the database (36 cards)
node prisma/seed.js

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤖 AI Chatbot Setup

The chatbot requires a free [Groq API key](https://console.groq.com):

```bash
# Add to .env
GROQ_API_KEY="gsk_your_key_here"
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage (hero, categories, featured cards)
│   ├── cards/
│   │   ├── page.tsx             # Card listing (search, filters, pagination)
│   │   └── [slug]/page.tsx      # Card detail page
│   ├── compare/page.tsx         # Side-by-side comparison
│   └── api/
│       ├── cards/route.ts       # Cards API (filter, sort, search, paginate)
│       ├── search/route.ts      # Search autocomplete API
│       └── chat/route.ts        # Groq AI chat API (streaming + RAG)
├── components/
│   ├── navbar.tsx               # Responsive navigation
│   ├── footer.tsx               # Site footer
│   ├── card-thumbnail.tsx       # Card preview component
│   ├── card-detail-content.tsx  # Card detail view
│   ├── comparison-bar.tsx       # Floating compare bar
│   ├── comparison-charts.tsx    # Recharts bar + radar charts
│   ├── chat-widget.tsx          # Floating AI chat panel
│   └── home-card-grid.tsx       # Card grid wrapper
├── lib/
│   └── db.ts                    # SQLite database helper (CRUD, filter, search)
└── store/
    └── comparison-store.ts      # Zustand store (compare state, localStorage)
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | SQLite via better-sqlite3 |
| State | Zustand (localStorage persistence) |
| Charts | Recharts |
| AI | Groq SDK (Llama 3.3 70B) |
| Icons | Lucide React |

## 📝 License

MIT
