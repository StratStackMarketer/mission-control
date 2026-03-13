# Mission Control - Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] Run linter: `npm run lint`
- [ ] Check for TypeScript errors: `npm run type-check`
- [ ] All tests passing: `npm test`
- [ ] No console errors in dev build
- [ ] Git history is clean and meaningful

### Environment Configuration
- [ ] `.env.local` file created with production variables
- [ ] Database URL points to production database
- [ ] ClawBot API key configured
- [ ] Webhook URLs configured
- [ ] CORS settings reviewed
- [ ] No sensitive data in version control

### Database
- [ ] Latest migrations applied: `npx prisma db push`
- [ ] Database backup created (if upgrading)
- [ ] Prisma client generated: `npx prisma generate`
- [ ] Database indexes verified

### Performance
- [ ] Production build created: `npm run build`
- [ ] Build succeeds without warnings
- [ ] Bundle size analyzed
- [ ] Images optimized
- [ ] API response times tested

## Deployment Process

### Choose Your Platform

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Environment variables set in Vercel dashboard:
# - DATABASE_URL
# - CLAWBOT_API_KEY
# - CLAWBOT_WEBHOOK_URL
```

- [ ] Vercel account created and project linked
- [ ] Environment variables configured in Vercel dashboard
- [ ] Domain configured
- [ ] Deployment successful
- [ ] Test production URL

#### Option 2: Docker Deployment
```bash
# Build docker image
docker build -t mission-control .

# Run container
docker run -e DATABASE_URL="file:./data/dev.db" \
           -e CLAWBOT_API_KEY="key" \
           -p 3000:3000 \
           mission-control
```

- [ ] Dockerfile created
- [ ] Docker image builds successfully
- [ ] Container runs without errors
- [ ] All environment variables passed

#### Option 3: Self-Hosted (Node.js)
```bash
# Build production
npm run build

# Start
npm run start

# Use process manager (PM2)
npm install -g pm2
pm2 start "npm run start" --name "mission-control"
```

- [ ] Server has Node.js 18+ installed
- [ ] PM2 or equivalent process manager configured
- [ ] SSL certificate configured
- [ ] Nginx/Apache reverse proxy configured
- [ ] Database accessible from server
- [ ] Firewall rules updated

## Post-Deployment

### Verification
- [ ] Application loads at production URL
- [ ] Dashboard displays correctly
- [ ] Dark mode renders properly
- [ ] API endpoints responsive
- [ ] Database connectivity working
- [ ] File uploads/attachments working
- [ ] Pagination functioning

### Testing
- [ ] Create a test task (verify API works)
- [ ] Update task status (verify database writes)
- [ ] Create an approval (verify workflows)
- [ ] Check calendar events
- [ ] Test on mobile browser
- [ ] Test with different screen sizes

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure application logging
- [ ] Set up uptime monitoring
- [ ] Database backups scheduled
- [ ] Performance monitoring enabled
- [ ] Alert rules configured for:
  - [ ] High error rates
  - [ ] Database connection failures
  - [ ] High response times
  - [ ] Disk space warnings

### Security
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] API authentication verified
- [ ] Sensitive data not logged
- [ ] Rate limiting configured
- [ ] Input validation tested

### Documentation
- [ ] Deployment guide updated
- [ ] Emergency procedures documented
- [ ] Troubleshooting guide created
- [ ] Team trained on operational procedures

## Rollback Plan

If deployment fails:

### Quick Rollback (Vercel)
```bash
vercel rollback
```

### Docker Rollback
```bash
# Stop current container
docker stop mission-control

# Start previous version
docker run -d --name mission-control-prev image-id
```

### Node.js Rollback
```bash
# Checkout previous version
git checkout main~1

# Rebuild and restart
npm run build
pm2 restart mission-control
```

- [ ] Previous version tagged in git
- [ ] Database backup exists
- [ ] Rollback procedure tested
- [ ] Team aware of rollback process

## Post-Launch Monitoring (24-48 Hours)

- [ ] Monitor error rates
- [ ] Check API latency
- [ ] Review user feedback
- [ ] Verify all features working
- [ ] Check for any data inconsistencies
- [ ] Performance metrics normal
- [ ] No unexpected resource usage

## Success Criteria

✅ Deployment is successful if:
- Application loads without errors
- All core features functional
- Database working correctly
- ClawBot integration responding
- Performance acceptable
- No increase in error rates
- Team can perform basic operations

## Contact & Escalation

| Role | Contact | Availability |
|------|---------|---|
| DevOps Lead | Russ Chandler | 24/7 |
| ClawBot Engineer | Strategy Stack | Business hours |
| Database Admin | Russ Chandler | 24/7 |

---

**Deployment Status**: [ ] Not Started [ ] In Progress [ ] Complete [ ] Failed

**Date Deployed**: ___________

**Deployed By**: ___________

**Issues Encountered**: 

**Notes**:

