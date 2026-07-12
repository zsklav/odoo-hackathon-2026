# TransitOps — Smart Transport Operations Platform

**Odoo Hackathon 2026 · Virtual Round**

An end-to-end transport operations platform: digitize vehicles, drivers,
dispatch, maintenance, fuel and expenses — with enforced business rules and
operational insight.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Prisma + PostgreSQL** _(planned)_
- **Auth + Role-Based Access Control**

## Core modules

| Module | What it does |
| --- | --- |
| Vehicle Registry | Master list · unique reg no · status (Available / On Trip / In Shop / Retired) |
| Driver Management | Profiles · license expiry · safety score · status |
| Trip Dispatch | Assign vehicle + driver · rule validation · Draft → Dispatched → Completed → Cancelled |
| Maintenance | Service logs · auto sets vehicle to "In Shop" & hides from dispatch |
| Fuel & Expenses | Fuel logs, tolls · auto operational cost per vehicle |
| Reports & Analytics | Fuel efficiency · fleet utilization · ROI · CSV export |

### Roles
Fleet Manager · Driver · Safety Officer · Financial Analyst

### Key business rules (these win points — enforce them)
- Vehicle registration number must be **unique**
- Retired / In Shop vehicles **never** appear in dispatch
- Drivers with **expired license** or **Suspended** status **can't** be assigned
- A vehicle/driver already **On Trip** can't be double-booked
- **Cargo weight ≤ vehicle capacity**
- Dispatch → both become **On Trip**; Complete/Cancel → back to **Available**
- Active maintenance → vehicle **In Shop**; closing → **Available**

## Getting started (every teammate)

```bash
# 1. Clone
git clone https://github.com/zsklav/odoo-hackathon-2026.git
cd odoo-hackathon-2026

# 2. Install
npm install

# 3. Run dev server
npm run dev
# open http://localhost:3000
```

## Team commit rules (read before you push)

Individual commits are **scored per member** — protect your contribution:

```bash
# Set YOUR own identity (use the email tied to YOUR GitHub account)
git config user.name  "Your Name"
git config user.email "your-github-email@example.com"
```

- Commit **your own** work under **your own** identity.
- **Push at least once every hour**, with clear messages ("add trip dispatch validation", not "update").
- **All code stays on the `main` branch** (single-branch rule).
- **No squash-merges** that erase co-authors — if you pair, add
  `Co-authored-by: Name <email>` to the commit.

Verify authorship anytime:
```bash
git log --pretty="%an <%ae> — %s"
```

## Team

- **Team Lead:** Valkyriezz (`zsklav`)
- FlashL3opard (`Yash Sheorey`)
- Mystic Owl (`Siddharth-732`)
