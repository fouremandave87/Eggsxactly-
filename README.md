# Eggsxactly

Track all the details of your flock or flocks.

A modern web application for tracking poultry flocks and egg production, built with React and Supabase.

## Features

- **Dashboard**: View overview of your entire flock and today's egg production
- **Bird Management**: Add, edit, and track individual birds (chickens and ducks)
- **Egg Tracker**: Record daily egg collection by bird with date selection
- **Data Export/Import**: Backup and restore your data
- **Statistics**: View production stats by type and date

## Tech Stack

- React 18
- Vite
- Supabase (PostgreSQL database)
- Modern CSS

## Database Setup

The application uses Supabase for data persistence. To set up the database:

1. The database schema is located in `supabase/migrations/20250101000000_initial_schema.sql`
2. This creates two tables:
   - `birds` - stores information about individual birds
   - `egg_records` - tracks daily egg collection

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
