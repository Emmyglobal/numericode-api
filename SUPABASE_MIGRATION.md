# Migration Guide: Railway → Render + Supabase

This guide walks you through migrating your NumeriCode API from Railway to Render with Supabase as the database.

## ⚠️ Important: No Railway Access?

If your Railway trial has **expired** and you no longer have access:

✅ **You can still proceed!** Your project has all schema definitions in `src/db/migrate.ts`

**What to do:**
1. Set up Supabase (Step 1)
2. Use your migration file to recreate the schema (Step 2.2)
3. Start fresh with Supabase (no need for old Railway data)
4. Deploy to Render (Step 4)

You'll be up and running in ~30 minutes!

## Step 1: Set Up Supabase Project

### 1.1 Create Supabase Account
- Go to [https://supabase.com](https://supabase.com)
- Sign up or log in
- Click "New project"
- Fill in:
  - **Project name**: `numericode`
  - **Database password**: Create a strong password (save this!)
  - **Region**: Choose closest to your users
- Click "Create new project"
- Wait for initialization (5-10 minutes)

### 1.2 Get Connection String
Once the project is created:
1. Go to **Settings** → **Database**
2. Under "Connection string", select **URI**
3. Copy the connection string (it looks like: `postgresql://postgres:password@db.xxxxx.supabase.co:6543/postgres`)
4. Save this for later

**Important**: This includes the default password. You'll use this to connect initially.

### 1.3 Create Database Name
By default, Supabase provides a `postgres` database. If you need to create a custom database:
1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query:
```sql
CREATE DATABASE numericode;
```
3. Execute it

*Note: For simplicity, you can keep using the default `postgres` database.*

## Step 2: Migrate Your Database Schema

### 2.1 Export Current Schema from Railway
If you **no longer have access to Railway** (trial expired):

You have several options:

#### Option A: Use Your Application Code (Recommended)
If you use a migration tool like:
- **Knex.js migrations** - Check `migrations/` folder
- **TypeORM migrations** - Check `src/migration/` folder
- **Sequelize migrations** - Check `migrations/` folder
- **Prisma migrations** - Check `prisma/migrations/` folder

Look for migration files in your project and run them against Supabase.

#### Option B: Recreate Schema Manually
If your schema is relatively simple, you can:
1. Review your database models in the application code
2. Check any existing SQL files or documentation
3. Manually create the tables in Supabase SQL Editor

#### Option C: Use Old Database Dump (If You Have One)
If you have a backup file:
```bash
# Use existing schema dump if available
psql -h db.xxxxx.supabase.co -U postgres -d postgres < schema.sql
```

#### Option D: Reverse-Engineer from Code
Look at your controllers to understand your schema structure, then create tables in Supabase.

**If you still have Railway access before it's fully deleted:**

```bash
# Connect to your Railway database and dump the schema
pg_dump -h your-railway-host -U postgres -d numericode --schema-only > schema.sql
```

Or use pgAdmin/DBeaver to export the schema.

### 2.2 Import Schema to Supabase

**GOOD NEWS**: Your project already has a migration file with all schema definitions!

#### Use Your Migration File (Best Option)

1. **Configure `.env` with Supabase connection**:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:6543/postgres
   NODE_ENV=development
   ```

2. **Run migrations directly from your project**:
   ```bash
   cd numericode-api
   npm install
   npm run db:migrate
   ```

   This will execute `src/db/migrate.ts` which contains all your table definitions.

3. **Verify tables were created** in Supabase SQL Editor:
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname='public';
   ```

#### Alternative: Manual Import via SQL Editor

If you want to manually run the schema:

1. Open [src/db/migrate.ts](src/db/migrate.ts) in your project
2. Copy the entire SQL statement (starts with `CREATE EXTENSION IF NOT EXISTS...`)
3. In Supabase, go to **SQL Editor** → **New Query**
4. Paste the SQL and click **Run**

### 2.3 Migrate Your Data (Optional)

Since your Railway trial has expired, you likely don't have access to export existing data. 

**Options:**

- **If you have no need for old data**: Skip this step. Start fresh with Supabase.
- **If you have a backup file** (SQL dump from before): Use it:
  ```bash
  psql -h db.xxxxx.supabase.co -U postgres -d postgres < data.sql
  ```
- **If you need to preserve data**: Contact Railway support to request a data export before your account is deleted.

## Step 3: Configure Environment Variables

### 3.1 Create `.env` file locally

Copy `.env.example` to `.env` and fill in:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:6543/postgres
JWT_SECRET=generate_a_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_URL=https://yourdomain.com
SENDGRID_API_KEY=your_key
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
```

### 3.2 Test Connection Locally

```bash
npm install
npm run build
npm start
```

Test your API: `curl http://localhost:3001/health`

## Step 4: Deploy to Render

### 4.1 Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Connect your GitHub repository

### 4.2 Deploy Web Service

1. From Render dashboard: **New** → **Web Service**
2. Select your `numericode-api` repository
3. Fill in:
   - **Name**: `numericode-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if needed)

### 4.3 Add Environment Variables in Render

In Render dashboard for your service:
1. Go to **Environment** tab
2. Add all variables from `.env`:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = Your Supabase connection string
   - `JWT_SECRET` = Generate a random string
   - `JWT_EXPIRES_IN` = `7d`
   - `CLIENT_URL` = Your frontend URL
   - `SENDGRID_API_KEY` = Your SendGrid key
   - `GOOGLE_CLIENT_ID` = Your Google OAuth ID
   - `GOOGLE_CLIENT_SECRET` = Your Google OAuth Secret

### 4.4 Deploy

- Push your code to GitHub (make sure `render.yaml` is included)
- Render will automatically detect and deploy
- Check **Logs** tab for deployment status

## Step 5: Verify Deployment

Once deployed:

```bash
# Test health endpoint
curl https://your-render-service.onrender.com/health

# Test API
curl https://your-render-service.onrender.com/api/endpoint
```

## Step 6: Update Frontend Configuration

Update your frontend to use the new Render API URL:

In your frontend `.env`:
```
VITE_API_URL=https://your-render-service.onrender.com
```

## Troubleshooting

### Connection Refused
- Verify `DATABASE_URL` is correct
- Check Supabase project is running
- Ensure credentials are right

### 502 Bad Gateway
- Check Render logs: `tail -f /var/log/app.log`
- Verify all environment variables are set
- Check database connectivity

### Database Migration Issues
- Ensure schema syntax is compatible with Supabase PostgreSQL
- Check for UUID extensions if using UUIDs
- Verify all foreign keys are created

### Performance Issues
- Consider upgrading from free plan
- Add indexes to frequently queried columns
- Monitor Supabase dashboard for slow queries

## Important Notes

- **Free tier limits**: Render and Supabase both have free tiers with usage limits
- **Auto-sleep**: Render free services auto-sleep after 15 minutes of inactivity
- **Connection pooling**: Supabase provides built-in connection pooling
- **SSL/TLS**: Always use secure connections in production
- **Backups**: Supabase provides automatic daily backups on paid plans

## Rollback Plan

If you need to roll back:
1. Keep your Railway database running temporarily
2. Update `DATABASE_URL` back to Railway connection string
3. Redeploy to Render
4. Once verified, decommission Railway

## Support Links

- Supabase Docs: https://supabase.com/docs
- Render Docs: https://render.com/docs
- PostgreSQL Connection: https://www.postgresql.org/docs/current/libpq-connect.html
