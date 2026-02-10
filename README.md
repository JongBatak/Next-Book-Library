# Perpus-JS (Elibrary)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)

An opinionated digital library (e-library) UI and API built with Next.js, React, Tailwind CSS, Three.js integrations, and MongoDB for persistence. This repository includes an interactive frontend with 3D/animated book components and server-side API routes for books, users, and transactions.

**Highlights**
- Full Next.js 14 app router structure under `app/`
- MongoDB via Mongoose for models in `models/`
- API routes under `app/api/` for auth, books, borrow/return, and seed
- 3D and animated components using `three`, `@react-three/fiber`, and `@react-three/drei`

**Tech Stack (with logos)**
- Next.js — framework & server rendering
- React — UI library
- Tailwind CSS — styling utility classes
- Node.js — runtime
- MongoDB (Mongoose) — database and ODM
- Three.js + @react-three/fiber — 3D rendering

## Features
- Browse a seeded catalog of books with cover images and metadata
- Admin/member roles (seeded sample users)
- Borrow and return API flows (server-side validation)
- Authentication endpoints for register/login (basic scaffolding)
- 3D/animated book showcases and scenes in `components/3d/`

## Repo layout (important paths)
- `app/` — Next.js App Router pages and API routes
- `components/` — React components including 3D scenes and UI
- `lib/db.js` — MongoDB connection helper
- `models/` — Mongoose models (`Book.js`, `User.js`, `Transaction.js`)
- `public/` — static assets and fonts

## Prerequisites
- Node.js 18+ (recommended)
- npm, pnpm, or yarn
- MongoDB instance (local or hosted — e.g., Atlas)

## Quick Start
1. Clone the repository

```bash
git clone <your-repo-url>
cd perpus-js
```

2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn
```

3. Create environment file

Create a `.env.local` file at the project root with at least:

```env
MONGODB_URI=mongodb://localhost:27017/elibrary
# or your MongoDB Atlas connection string
```

4. Run the dev server

```bash
npm run dev
# or pnpm dev / yarn dev
```

Open http://localhost:3000

## Scripts
- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server (after build)
- `npm run lint` — run ESLint

## Seeding the Database
This project includes a seeding API at `GET /api/seed` which will clear and populate sample users and 50 books (covers pulled from Unsplash). To seed the database:

```bash
# with the dev server running
curl -X GET http://localhost:3000/api/seed

# or open in browser: http://localhost:3000/api/seed
```

You should see a JSON response confirming the number of seeded books and users. The seed code is in [app/api/seed/route.js](app/api/seed/route.js).

## API Endpoints (summary)
- `GET /api/books` — list books (see [app/api/books/route.js](app/api/books/route.js))
- `POST /api/auth/register` — register a user ([app/api/auth/register/route.js](app/api/auth/register/route.js))
- `POST /api/auth/login` — login ([app/api/auth/login/route.js](app/api/auth/login/route.js))
- `POST /api/borrow` — borrow a book ([app/api/borrow/route.js](app/api/borrow/route.js))
- `POST /api/return` — return a book ([app/api/return/route.js](app/api/return/route.js))
- `GET /api/seed` — reseed demo data ([app/api/seed/route.js](app/api/seed/route.js))

Use `curl` or Postman to exercise the endpoints. Example: fetch books

```bash
curl -s http://localhost:3000/api/books | jq
```

## Authentication & Security
This repo provides basic register/login endpoints but does not ship a production-ready auth strategy. For production, consider:
- Using JWT or server-side sessions with secure cookies
- Hashing passwords (bcrypt) and salting properly
- Rate-limiting authentication endpoints
- Enabling CORS and input validation

## 3D / Animated Components
The `components/3d/` folder and other animated components demonstrate using `three` with `@react-three/fiber` and `@react-three/drei`. These are used to render interactive book scenes and visual flourishes in the UI. Performance tips:
- Keep low-poly meshes for web
- Use texture atlases and compressed images
- Use `drei` helpers for common tasks

## Troubleshooting
- MongoDB connection errors: verify `MONGODB_URI` and that MongoDB is accessible
- Port conflicts: ensure nothing else uses port 3000
- Missing images: seed uses Unsplash links; confirm network access

## Contributing
Contributions are welcome. Suggested steps:
1. Fork the repo
2. Create a feature branch
3. Open a PR with tests and a clear description

## License
See [LICENSE](LICENSE) for license information.

---

If you'd like, I can also:
- Add local logo SVGs under `public/logos/` and update the README to reference them
- Create example Postman collection for the API
- Add a simple script to seed the DB without hitting the HTTP route
