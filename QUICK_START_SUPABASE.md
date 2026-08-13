# Quick Start: Supabase + Render (No Railway Access)

Since your Railway trial expired, here's the fastest path to get your NumeriCode API running on Supabase + Render.

## ⏱️ Expected Time: 30-45 minutes

---

## Step 1: Create Supabase Project (5 min)

1. Go to **[supabase.com](https://supabase.com)**
2. Click **"New project"**
3. Sign in with GitHub or email
4. Fill in:
   - **Project name**: `numericode`
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"** and wait for initialization

---

## Step 2: Set Up Your Database Schema (5 min)

Once Supabase project is created:

### Option A: Use Your Migration File (Recommended)

1. In your project folder, create/edit `.env`:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:6543/postgres
   NODE_ENV=development
   ```

   (Get connection string from Supabase: **Settings → Database → Connection Pooling → URI**)

2. Run the migration:
   ```bash
   npm install
   npm run db:migrate
   ```

3. Done! ✅ Your schema is now in Supabase

### Option B: Manual SQL (If Option A fails)

1. Open [src/db/migrate.ts](src/db/migrate.ts)
2. In Supabase, go to **SQL Editor → New Query**
3. Copy the SQL starting from `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`
4. Paste and run

---

## Step 3: Test Locally (5 min)

```bash
npm run build
npm start
```

Visit: `http://localhost:3001/health`

Should see: `OK` ✅

---

## Step 4: Deploy to Render (10 min)

### 4.1 Push to GitHub

Make sure your code is on GitHub with:
- `.env.example` (optional, for reference)
- `render.yaml` (already updated)
- `src/db/migrate.ts` (your schema)

```bash
git add .
git commit -m "Ready for Render + Supabase"
git push
```

### 4.2 Create Render Service

1. Go to **[render.com](https://render.com)**
2. Sign up with GitHub
3. Click **"New" → "Web Service"**
4. Select your `numericode-api` repository
5. Fill in:
   - **Name**: `numericode-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Click **"Create Web Service"**

### 4.3 Add Environment Variables

In Render dashboard, go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:6543/postgres` |
| `JWT_SECRET` | Generate a random string (use `openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | Your frontend URL (e.g., `https://yourdomain.com`) |
| `SENDGRID_API_KEY` | Your SendGrid API key |
| `GOOGLE_CLIENT_ID` | Your Google OAuth ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth secret |

Click **"Save Changes"**

### 4.4 Deploy

Render will automatically deploy. Check **Logs** to see progress.

Once deployed, you'll get a URL like: `https://numericode-api.onrender.com`

---

## Step 5: Verify Deployment (2 min)

```bash
curl https://your-render-url.onrender.com/health
```

Should respond with `OK` ✅

---

## Step 6: Update Your Frontend

In your frontend `.env`:
```
VITE_API_URL=https://your-render-url.onrender.com
```

Then rebuild and redeploy your frontend.

---

## Troubleshooting

### ❌ Database connection error
- Verify `DATABASE_URL` is correct
- Check password in Supabase
- Ensure `NODE_ENV` is set

### ❌ 502 Bad Gateway
- Check Render logs
- Verify all environment variables are set
- Database might be starting up (wait 1-2 min)

### ❌ Migration script fails
- Make sure `NODE_ENV` is set (even if just `development`)
- Check `.env` file exists with `DATABASE_URL`
- Try running `npm run build` first

### ❌ Timeout connecting
- Supabase might be initializing (wait 5 min)
- Check Supabase dashboard to ensure project is running

---

## Important Notes

- **Free tier**: Render auto-sleeps after 15 min inactivity. Upgrade to prevent this.
- **Supabase**: Free tier has 500MB storage. Check usage in Settings.
- **Keep Railway?**: Don't delete Railway immediately. Wait 24 hours to confirm Render is stable.
- **Backups**: Export your Supabase data regularly for safety.

---

## Next Steps

1. ✅ Test all API endpoints
2. ✅ Verify user authentication
3. ✅ Check email notifications (SendGrid)
4. ✅ Test Google OAuth
5. ✅ Monitor Render logs for errors

---

## Need Help?

- **Supabase Issues**: https://supabase.com/docs
- **Render Issues**: https://render.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs/current/libpq-connect.html

Good luck! 🚀
