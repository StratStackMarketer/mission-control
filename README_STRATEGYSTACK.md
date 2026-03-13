# Mission Control - Strategy Stack Edition

A powerful dashboard and command center for managing tasks, projects, approvals, events, and team coordination. Built for **Strategy Stack Marketing Agency** with ClawBot integration.

## Features

✨ **Core Capabilities**
- **Task Management**: Create, prioritize, and track tasks with status workflows (todo → in_progress → done)
- **Project Management**: Organize tasks into projects with progress tracking
- **Approvals System**: Request and manage approvals with audit trails
- **Calendar Integration**: Track and manage events and deadlines
- **Org Charts**: Visualize team structure and relationships
- **Portfolio Management**: Showcase work and case studies
- **Ideas Repository**: Capture and develop business ideas with confidence ratings

🤖 **ClawBot Integration**
- Real-time task synchronization with ClawBot agents
- Automated approval workflows
- Agent assignment and performance tracking
- Cross-agent communication via the Mission Control hub

🎨 **Design System**
- Dark mode theme optimized for extended use
- JMobbin-inspired UI components
- Responsive design for desktop and mobile
- Accessible color contrast and typography

## Quick Start

### Prerequisites
- Node.js 18+ (with npm)
- SQLite (included with most systems)
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/StratStackMarketer/mission-control.git
   cd mission-control
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   echo 'DATABASE_URL="file:./dev.db"' > .env
   ```

4. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at: **http://localhost:3000**

## ClawBot Integration Setup

### 1. Environment Configuration

Add these variables to your `.env`:

```env
DATABASE_URL="file:./dev.db"
CLAWBOT_API_KEY="your-clawbot-api-key"
CLAWBOT_WEBHOOK_URL="https://your-mission-control-instance.com/api/webhooks/clawbot"
```

### 2. Database Setup

The Prisma schema includes models for ClawBot integration:
- **Task model**: Supports `assignedTo` field for agent assignment
- **Approval model**: Tracks approval requests from agents
- **CronJob model**: Manages scheduled ClawBot tasks

Run migrations:
```bash
npx prisma db push
```

### 3. API Endpoints for ClawBot

Available API routes:

```
POST   /api/tasks              → Create tasks from agents
GET    /api/tasks              → Fetch tasks
PUT    /api/tasks/[id]         → Update task status
DELETE /api/tasks/[id]         → Archive tasks

POST   /api/approvals          → Request approvals
GET    /api/approvals          → List pending approvals
PUT    /api/approvals/[id]     → Approve/deny requests

POST   /api/webhooks/clawbot   → Receive ClawBot events
GET    /api/webhooks/clawbot   → Confirm webhook setup
```

### 4. Webhook Configuration

ClawBot can push real-time updates:

**Example webhook payload:**
```json
{
  "type": "task.created",
  "agentId": "agent-001",
  "data": {
    "title": "Review marketing campaign",
    "priority": "high",
    "dueDate": "2026-03-20T17:00:00Z"
  }
}
```

## Database Models

### Tasks
```prisma
- id: Unique identifier
- title: Task name
- description: Full description
- status: todo | in_progress | done | blocked
- priority: low | medium | high | urgent
- dueDate: ISO datetime
- assignedTo: Agent or user identifier
- projectId: Link to parent project
- tags: JSON array of tags
```

### Approvals
```prisma
- id: Unique identifier
- title: Approval request title
- description: Details
- status: pending | approved | denied
- requestedBy: Agent identifier
- response: Approval decision
- notes: Admin notes
- metadata: JSON context
```

### Projects
```prisma
- id: Unique identifier
- name: Project name
- description: Overview
- status: planning | active | paused | completed
- progress: 0-100 percentage
- docs: Markdown documentation
```

## Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# Test production build locally
npm run start
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

The app works with any Node.js hosting:
- **Heroku**: `npm run build && npm start`
- **AWS Lambda**: Use Node.js 18+ runtime
- **Self-hosted**: Docker or direct Node.js installation

## Configuration

### Dark Mode (Default)

Dark mode is enabled by default with the following theme:
- **Background**: `#0F0F1E`
- **Cards**: `#1A1A2E`
- **Text**: `#F0F0F0`
- **Primary Accent**: `#5B4EE8`

To customize, edit `/app/globals.css` and update the `:root` CSS variables.

### UI Components

All components are styled with CSS classes in `globals.css`:
- `.card`: Standard card container
- `.btn`: Button with variants (primary, secondary, ghost)
- `.badge`: Status badges (status-specific colors)
- `.stat-card`: Metric display card
- `.input`, `.textarea`: Form inputs

## Development

### Project Structure

```
mission-control/
├── app/                  # Next.js app directory
│   ├── page.tsx         # Dashboard
│   ├── tasks/           # Task management
│   ├── projects/        # Project management
│   ├── approvals/       # Approval workflows
│   ├── calendar/        # Calendar view
│   └── api/             # API routes
├── components/          # Reusable React components
├── lib/                 # Utilities and helpers
├── prisma/              # Database schema
├── public/              # Static assets
└── app/globals.css      # Design system & theme
```

### Adding New Pages

1. Create a folder in `/app`: `mkdir app/my-feature`
2. Add a page: `touch app/my-feature/page.tsx`
3. Follow the component pattern from existing pages
4. Database queries use Prisma Client

### Database Migrations

After schema changes:
```bash
npx prisma db push
# or for manual migration:
npx prisma migrate dev --name feature_name
```

## Testing

### Run Tests
```bash
npm test
```

### Manual Testing Checklist

- [ ] Create a new task
- [ ] Update task status
- [ ] Create a project
- [ ] Add tasks to project
- [ ] Request an approval
- [ ] Check dashboard stats
- [ ] Navigate between pages
- [ ] Test dark mode visibility
- [ ] Check responsive design (mobile view)

## Troubleshooting

### Database Connection Issues
```bash
# Reset database (WARNING: deletes all data)
rm dev.db
npx prisma db push
```

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Missing Prisma Client
```bash
npx prisma generate
npm install
```

## Performance

- **Database**: SQLite optimized with indexes on frequently queried fields
- **Caching**: Next.js built-in caching for static content
- **API**: Response compression and pagination for large datasets

Monitor performance:
```bash
npm run build --analyze
```

## Security Considerations

1. **Environment Variables**: Store API keys in `.env.local` (never commit)
2. **Database**: SQLite should be backed up regularly in production
3. **API Authentication**: Add auth middleware to ClawBot routes
4. **CORS**: Configure if accessing from multiple domains

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test locally
3. Commit with clear messages: `git commit -am "feat: add new feature"`
4. Push and create a Pull Request

## Roadmap

- [ ] Multi-team support
- [ ] Advanced reporting and analytics
- [ ] Integration with external tools (Slack, Discord, etc.)
- [ ] Mobile app
- [ ] Advanced permission system
- [ ] Activity feeds and notifications

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review existing GitHub issues
3. Contact the Strategy Stack team

## License

© 2026 Strategy Stack Marketing Agency. All rights reserved.

---

Built with ❤️ using Next.js, Prisma, and TailwindCSS
