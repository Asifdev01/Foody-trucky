# Foody-truck (Share2Serve)

A food-rescue platform that connects surplus-food donors (restaurants, businesses, individuals) with charities. Includes a public website and an admin back-office.

## What This Is For

Every day, restaurants, businesses and households end up with good food they can't use, while charities and the people they serve go without. Share2Serve bridges that gap:

- **Donors** offer surplus food instead of throwing it away.
- **Charities** discover available donations and get discovered by donors.
- **Admins** review, approve and track every donation from submission to distribution.

The goal is simple: cut food waste and get food to people who need it.

## Features

- JWT auth with rotating refresh tokens and role-based access (`user` / `admin`)
- Public charity directory with filtering, sorting and pagination
- Food donations with a status lifecycle: `Pending` → `Accepted` → `Distributed` (or `Rejected`)
- Admin dashboard for donors, food donations and charities
- Security: helmet, CORS, mongo-sanitize, XSS sanitising, rate limiting

## Tech Stack

- **Frontend:** React 18, Vite, React Router v7, MUI v6
- **Backend:** Node.js, Express 4, MongoDB (Mongoose 8)
- **Auth and security:** JWT, bcryptjs, express-validator, helmet
- **Testing:** Jest, Supertest, mongodb-memory-server

## Structure

```
Foody-truck/
├── backend/   # app.js, server.js, config, controllers, models, routes,
│              # middleware, validators, utils, scripts, tests
└── src/       # main.jsx, Routes.jsx, theme.js, api, context,
               # components (feature, ui), pages (public + admin)
```

## Getting Started

```bash
# install
npm install
cd backend && npm install

# configure
cp .env.example .env   # set MONGODB_URI, JWT_SECRET, CLIENT_URL, ...

# seed (optional)
node scripts/seedAdmin.js
node scripts/seedCharities.js

# run
npm run dev            # in backend/
npm run dev            # in project root (frontend)

# test
cd backend && npm test
```

## API (under `/api`)

| Area | Endpoints | Access |
|------|-----------|--------|
| Auth | `POST /auth/signup`, `/auth/login`, `/auth/refresh`, `/auth/logout`; `GET /auth/me` | Public / Auth |
| Charities | `GET /charities`, `GET /charities/:id` | Public |
| Charities | `POST`, `PUT`, `DELETE` | Admin |
| Donors | `GET`, `POST /donors` | Admin |
| Food donations | `GET /food-donations/available` | Public |
| Food donations | `GET`, `POST`, `PUT`, `DELETE /food-donations` | Admin |

## License

Add your license here.
