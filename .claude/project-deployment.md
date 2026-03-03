# Project Deployment & Architecture

## Project Overview
- **Platform**: Lovable Cloud (https://lovable.dev)
- **Repository**: https://github.com/Kaiguy277/kaiconsulting
- **Supabase Project ID**: zxsfsmrelpwfujmyypsa
- **Architecture**: Full-stack (React frontend + Supabase Edge Functions backend)

## Deployment Process

### How Deployment Works
1. **Push to GitHub triggers automatic deployment**
   - Lovable monitors the GitHub repository
   - Any push to `main` branch triggers deployment
   - Both frontend and backend deploy automatically
   - No manual Supabase CLI deployment needed

2. **Git Authentication**
   - **Use SSH (not HTTPS)** for git remote
   - SSH key already configured at `~/.ssh/id_ed25519.pub`
   - Remote URL: `git@github.com:Kaiguy277/kaiconsulting.git`
   - Test SSH: `ssh -T git@github.com` (should show "Hi Kaiguy277!")

### Deployment Commands
```bash
# Standard workflow
git add .
git commit -m "Descriptive message"
git push origin main  # Triggers automatic Lovable deployment

# If git remote is HTTPS, switch to SSH:
git remote set-url origin git@github.com:Kaiguy277/kaiconsulting.git
```

### What Gets Deployed
- **Frontend**: All React components in `/src`
- **Backend**: All Supabase Edge Functions in `/supabase/functions`
- **Shared modules**: Files in `/supabase/functions/_shared` (imported by multiple functions)
- **Configuration**: `/supabase/config.toml` defines function settings

## Project Structure

### Frontend (React + Vite)
- Framework: React 18 with TypeScript
- UI: shadcn/ui components + Tailwind CSS
- State: TanStack Query for server state
- API Client: Supabase JS client

### Backend (Supabase Edge Functions)
- Runtime: Deno
- Location: `/supabase/functions/`
- Shared code: `/supabase/functions/_shared/`
- Example functions:
  - `avalanche-summary/` - Main avalanche forecast aggregator
  - `firecrawl-scrape/` - Web scraping utility
  - `graph-chat/`, `graph-suggest/` - Graph-based features

### Key Files
- `.env` - Environment variables (Supabase credentials)
- `supabase/config.toml` - Function configuration (JWT verification, etc.)
- `package.json` - Frontend dependencies
- `tsconfig.json` - TypeScript configuration

## Weather Station Integration (Example Implementation)

### Files Created
1. `/supabase/functions/_shared/snotel-api.ts` - API client for SNOTEL weather data
2. `/supabase/functions/_shared/weather-station-config.ts` - Station mappings
3. `/src/components/avalanche/WeatherStationCard.tsx` - UI component
4. Updated `/supabase/functions/avalanche-summary/index.ts` - Integrated SNOTEL fetch
5. Updated `/src/lib/api/avalanche.ts` - Added TypeScript types
6. Updated `/src/pages/AvalancheSummary.tsx` - Display weather observations

### Deployment Flow for This Feature
1. Committed all changes: 6 files, 773 insertions
2. Pushed to GitHub: `git push origin main`
3. Lovable automatically deployed:
   - Frontend changes (React components, types)
   - Backend changes (Edge Function with SNOTEL integration)
4. Feature immediately available in production

## Common Issues & Solutions

### Issue: Git push fails with "could not read Username"
**Solution**: Switch from HTTPS to SSH remote
```bash
git remote set-url origin git@github.com:Kaiguy277/kaiconsulting.git
```

### Issue: Changes not visible after deployment
**Possible causes**:
- Deployment still in progress (wait 1-2 minutes)
- Browser cache (hard refresh: Ctrl+Shift+R)
- Check Lovable dashboard for deployment status

### Issue: Edge Function not working after deployment
**Check**:
1. Supabase function logs in dashboard
2. CORS headers configured correctly
3. Environment variables set (if needed)
4. Function exists in `/supabase/functions/` directory

## Environment Variables

### Local Development (.env)
```bash
VITE_SUPABASE_PROJECT_ID="zxsfsmrelpwfujmyypsa"
VITE_SUPABASE_URL="https://zxsfsmrelpwfujmyypsa.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGc..."
```

### Production (Lovable)
- Environment variables automatically synced from GitHub
- No manual configuration needed
- Lovable reads `.env` file from repository

## Testing After Deployment

### Frontend Testing
1. Visit production URL via Lovable dashboard
2. Test new features in browser
3. Check browser console for errors
4. Verify API calls succeed

### Backend Testing
1. Check Supabase function logs:
   - Go to Supabase Dashboard → Edge Functions → [function-name] → Logs
2. Test function directly:
   ```bash
   curl https://zxsfsmrelpwfujmyypsa.supabase.co/functions/v1/[function-name]
   ```
3. Monitor invocation counts and errors

## Best Practices

1. **Always commit before pushing**
   - Test locally first (when possible)
   - Write clear commit messages
   - Use atomic commits (one feature/fix per commit)

2. **Edge Function Development**
   - Put shared code in `/supabase/functions/_shared/`
   - Use TypeScript for type safety
   - Handle errors gracefully (return user-friendly messages)
   - Log important events for debugging

3. **Frontend Development**
   - Use TypeScript interfaces that match backend responses
   - Handle loading and error states
   - Test API integration thoroughly

4. **Deployment Workflow**
   ```bash
   # 1. Make changes
   # 2. Test locally
   # 3. Commit
   git add .
   git commit -m "Clear description of changes"

   # 4. Push (triggers deployment)
   git push origin main

   # 5. Wait ~1-2 minutes for deployment
   # 6. Test in production
   ```

## Useful Commands

```bash
# Check git status
git status

# View commit history
git log --oneline -10

# Check remote URL
git remote -v

# Test SSH connection to GitHub
ssh -T git@github.com

# View Supabase project info
cat supabase/config.toml

# List Edge Functions
ls -la supabase/functions/
```

## Additional Resources

- Lovable Dashboard: Check deployment status and logs
- GitHub Repository: https://github.com/Kaiguy277/kaiconsulting
- Supabase Dashboard: https://supabase.com/dashboard/project/zxsfsmrelpwfujmyypsa
- Local environment: `/home/kai/Documents/kaiconsulting.ai`
