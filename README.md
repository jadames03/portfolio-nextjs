# Portfolio Projects

Admin-managed project showcase built with Next.js App Router, TypeScript, Tailwind CSS, and Prisma (SQLite).

## Features
- Filterable public homepage with tabs for All, Development, Design, and AI projects.
- Detailed project pages with cover imagery, tag pills, and body copy.
- Password-protected admin area secured via HTTP Basic Auth middleware.
- Create, update, delete projects with tag multi-select, auto-generated slugs, and inline validation.
- REST API powered by Prisma with dedicated admin endpoints and shared toast notifications.

## Getting Started

```bash
git clone <repo>
cd portfolio
npm install
```

### Environment
Copy `.env.example` and set credentials.

```bash
cp .env.example .env
# set ADMIN_USER and ADMIN_PASS to desired credentials
```

### Database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Development

```bash
npm run dev
```

Visit:
- `http://localhost:3000/` for the public site.
- `http://localhost:3000/admin/projects` (browser prompts for Basic Auth).

## Scripts
- `npm run dev` – start Next.js dev server.
- `npm run build` – production build.
- `npm run start` – start production server.
- `npm run lint` – Next.js linting config.

## API Overview

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/projects` | List projects. Optional `tag=development|design|ai|all`, `q=<search>` |
| `GET` | `/api/projects/[idOrSlug]` | Fetch a single project |
| `GET` | `/api/admin/tags` | List tags for admin forms *(Basic Auth)* |
| `POST` | `/api/admin/projects` | Create project *(Basic Auth)* |
| `PUT` | `/api/admin/projects/[id]` | Update project *(Basic Auth)* |
| `DELETE` | `/api/admin/projects/[id]` | Delete project *(Basic Auth)* |

All admin routes require Basic Auth credentials defined by `ADMIN_USER` and `ADMIN_PASS`.

## Tech Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Prisma** ORM with SQLite
- **lucide-react** icon set

## Notes
- Seed script ensures Development, Design, and AI tags exist.
- Slugs must be unique; conflict errors surface inline in admin forms.
- Toast notifications appear for admin actions (create, update, delete).
