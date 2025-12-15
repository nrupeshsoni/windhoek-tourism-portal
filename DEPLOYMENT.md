# Windhoek Tourism Portal - Deployment Guide

## Netlify Environment Variables

Add these environment variables in **Netlify Dashboard > Site Settings > Environment Variables**:

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | Supabase Dashboard → Settings → Database → Connection string (Session mode) |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://fykchaqksvuwweuzgkxt.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API → service_role |
| `JWT_SECRET` | Session signing secret | Generate: `openssl rand -base64 32` |

### Email Configuration (EmailIt SMTP)

| Variable | Value |
|----------|-------|
| `SMTP_HOST` | `smtp.emailit.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `emailit` |
| `SMTP_PASSWORD` | Your EmailIt API key |
| `SMTP_FROM` | `"Windhoek Tourism Portal" <noreply@yourdomain.com>` |

### Site Configuration

| Variable | Value |
|----------|-------|
| `SITE_URL` | Your Netlify site URL (e.g., `https://namibia-tourism.netlify.app`) |
| `ADMIN_EMAIL` | Admin email for notifications |
| `VITE_APP_TITLE` | `Windhoek Tourism Portal` |

---

## Supabase Setup

### 1. Database Tables
Tables are created with prefix `windhoek_na_26_`:
- `windhoek_na_26_users` - User accounts
- `windhoek_na_26_categories` - Tourism categories (33 total)
- `windhoek_na_26_listings` - Business listings (6,985 NTB businesses)
- `windhoek_na_26_media` - Media assets
- `windhoek_na_26_routes` - Travel routes (69 curated routes)
- `windhoek_na_26_route_stops` - Route waypoints
- `windhoek_na_26_trips` - User trip plans
- `windhoek_na_26_trip_days` - Trip day itineraries
- `windhoek_na_26_trip_items` - Trip items/stops
- `windhoek_na_26_favorites` - User favorites
- `windhoek_na_26_listing_media` - Listing-media relationships
- `windhoek_na_26_chat_conversations` - AI chatbot conversations
- `windhoek_na_26_chat_messages` - Chat messages

### 2. Storage Buckets
Already created:
- `namibia-media` (public)
- `namibia-images` (public)
- `namibia-videos` (public)
- `namibia-documents` (private)

### 3. Enable Authentication Providers

#### Email/Password Auth
1. Go to **Authentication → Providers**
2. Enable **Email** provider
3. Configure SMTP settings (optional, for custom emails)

#### Google OAuth (Optional)
1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com)
2. In Supabase: **Authentication → Providers → Google**
3. Add Client ID and Client Secret
4. Add authorized redirect URI: `https://[your-project].supabase.co/auth/v1/callback`

#### GitHub OAuth (Optional)
1. Create OAuth App in [GitHub Developer Settings](https://github.com/settings/developers)
2. In Supabase: **Authentication → Providers → GitHub**
3. Add Client ID and Client Secret
4. Authorization callback URL: `https://[your-project].supabase.co/auth/v1/callback`

### 4. Configure Auth URLs
In **Authentication → URL Configuration**:
- Site URL: `https://your-site.netlify.app`
- Redirect URLs: 
  - `https://your-site.netlify.app/auth/callback`
  - `https://your-site.netlify.app/reset-password`

### 5. Row Level Security (Optional)
For additional security, enable RLS on tables:
```sql
-- Enable RLS on tables
ALTER TABLE windhoek_na_26_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE windhoek_na_26_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE windhoek_na_26_trips ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can only see their own data
CREATE POLICY "Users can view own profile" ON windhoek_na_26_users
  FOR SELECT USING (auth.uid()::text = "openId");
```

Note: The application uses server-side authorization via tRPC procedures, so RLS is optional but adds defense-in-depth.

---

## Netlify Deployment Steps

### 1. Connect Repository
1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `namibia-tourism-portal`

### 2. Configure Build Settings
- **Build command**: `pnpm build`
- **Publish directory**: `dist/public`
- **Node version**: Set `NODE_VERSION=18` in environment variables

### 3. Add Environment Variables
Add all variables from the tables above in **Site Settings → Environment Variables**

### 4. Deploy
Click "Deploy site" - Netlify will automatically build and deploy

### 5. Custom Domain (Optional)
1. Go to **Domain settings**
2. Add your custom domain
3. Configure DNS as instructed
4. Enable HTTPS

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/nrupeshsoni/namibia-tourism-portal.git
cd namibia-tourism-portal

# Install dependencies
pnpm install

# Create .env file with your variables
cp .env.example .env
# Edit .env with your values

# Run development server
pnpm dev
```

---

## Troubleshooting

### Database Connection Issues
- Ensure you're using the **Session mode** pooler URL (port 5432 or 6543)
- Check that your IP is not blocked in Supabase

### Email Not Sending
- Verify EmailIt API key is correct
- Check SMTP port (587 with STARTTLS)
- Verify sender email domain

### Auth Not Working
- Ensure Supabase Auth URLs are configured correctly
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Verify redirect URLs in Supabase dashboard

---

## Support

For issues with:
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **EmailIt**: [emailit.com/docs](https://emailit.com/docs)
