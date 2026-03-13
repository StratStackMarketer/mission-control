# Mission Control - Quick Start Setup

Get Mission Control running locally in 5 minutes.

## Prerequisites

- **Node.js 18+** → [Download](https://nodejs.org/)
- **npm** (included with Node.js)
- **Git** → [Download](https://git-scm.com/)

## Setup Steps

### 1. Clone Repository (30 seconds)

```bash
git clone https://github.com/StratStackMarketer/mission-control.git
cd mission-control
```

### 2. Install Dependencies (2 minutes)

```bash
npm install
```

### 3. Create Environment File (10 seconds)

```bash
echo 'DATABASE_URL="file:./dev.db"' > .env
```

### 4. Initialize Database (30 seconds)

```bash
npx prisma generate
npx prisma db push
```

### 5. Start Development Server (30 seconds)

```bash
npm run dev
```

✅ **Done!** Open http://localhost:3000 in your browser.

---

## What You Get

| Page | URL | Purpose |
|------|-----|---------|
| 🏠 Dashboard | `/` | Overview & metrics |
| ✅ Tasks | `/tasks` | Task management |
| 📋 Projects | `/projects` | Project tracking |
| ✔️ Approvals | `/approvals` | Approval workflows |
| 📅 Calendar | `/calendar` | Event management |
| 🏢 Org Chart | `/org-chart` | Team structure |
| 💡 Ideas | `/ideas` | Idea repository |
| 🎨 Portfolio | `/portfolio` | Work showcase |

## Key Features

### Dark Mode ✨
- Enabled by default
- Colors optimized for extended use
- High contrast text for readability

### Design System 🎨
- Component library in `app/globals.css`
- Reusable classes (`.card`, `.btn`, `.badge`, etc.)
- Responsive design built-in

### Database 🗄️
- SQLite (included, no external DB needed)
- Prisma ORM for type-safe queries
- Auto-migration ready

### API Ready 🚀
- RESTful API endpoints at `/api/*`
- ClawBot integration support
- Webhook ready for real-time updates

---

## Common Tasks

### Add a New Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Task",
    "priority": "high",
    "dueDate": "2026-03-20T17:00:00Z"
  }'
```

### View All Tasks

```bash
curl http://localhost:3000/api/tasks
```

### Reset Database

```bash
rm dev.db
npx prisma db push
```

### Stop Dev Server

```
Press Ctrl+C in terminal
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `npm run dev -- -p 3001` |
| Database error | `npx prisma db push --force-reset` |
| Missing modules | `npm install --legacy-peer-deps` |
| Blank page | Check browser console (F12) for errors |

---

## Next Steps

1. **Explore the UI** - Click around, create some test tasks
2. **Read Full Docs** - See `README_STRATEGYSTACK.md` for complete guide
3. **Deploy** - Follow `DEPLOYMENT_CHECKLIST.md` for production setup
4. **Configure ClawBot** - See README for ClawBot integration steps

---

## Get Help

- 📖 **Full Guide**: `README_STRATEGYSTACK.md`
- 🚀 **Deployment**: `DEPLOYMENT_CHECKLIST.md`
- 🔌 **ClawBot**: Section in `README_STRATEGYSTACK.md`
- 🐛 **Issues**: GitHub Issues page

---

**Ready to go!** Start building with Mission Control 🎯
