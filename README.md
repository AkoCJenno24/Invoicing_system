<<<<<<< HEAD
# InvoiceFlow — Invoicing System

A modern invoicing application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn/ui**.

## Features

- **Dashboard** — revenue, pending, overdue, and invoice counts
- **Invoice management** — create, edit, view, delete, and update status
- **Line items** — dynamic rows with quantity, unit price, and auto-calculated totals
- **Tax & discount** — configurable per invoice
- **Client details** — bill-to information on every invoice
- **Print-ready preview** — print invoices from the detail page
- **Company settings** — branding, defaults, payment terms, and bank details
- **Local persistence** — data saved in browser localStorage with sample invoices on first load

## Getting Started

```bash
cd invoicing-system
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Tech Stack

- React 19 + TypeScript
- Vite 8
- React Router 7
- Tailwind CSS 4
- shadcn/ui (Base UI + Radix patterns)
- date-fns, lucide-react, sonner

## Project Structure

```
src/
├── components/
│   ├── dashboard/     # Stats cards
│   ├── invoices/      # Invoice form, table, preview
│   ├── layout/        # App shell and sidebar
│   └── ui/            # shadcn/ui components
├── context/           # Invoice state + localStorage
├── lib/               # Utilities and storage
├── pages/             # Route pages
└── types/             # TypeScript interfaces
```
=======
# Invoicing_system
>>>>>>> 447a0dec11a580b1c0a916114b617c2ccc8d8a1c
