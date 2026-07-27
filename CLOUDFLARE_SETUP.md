# CardioInterview - Cloudflare Pages Deployment

Your code is now on GitHub! Here's how to deploy to Cloudflare Pages with AI integration enabled.

## Step 1: Sign up for Cloudflare (if you don't have an account)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click "Sign up" and create your account
3. Verify your email

## Step 2: Create Pages Project (Connected to GitHub)

1. In Cloudflare Dashboard, go to **Pages** (left sidebar)
2. Click **Create a project**
3. Select **Connect to Git**
4. Authorize GitHub (sign in with your GitHub account)
5. Find and select `vantagevijapura/cardio-interview-prep` repo
6. Click **Begin setup**

## Step 3: Configure Build Settings

**Framework preset:** None (or "Vite")

**Build settings:**
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `.` (leave as default)
- **Environment variables:** (none needed for MVP)

Click **Save and deploy**

⏳ Cloudflare will deploy your app in ~2-3 minutes. You'll get a URL like:
```
https://abc123.cardio-interview-prep.pages.dev
```

## Step 4: Enable Workers AI Binding (CRITICAL for Chat Mode)

Without this step, the AI feedback won't work!

1. In Cloudflare Dashboard, go to **Pages**
2. Click on your `cardio-interview-prep` project
3. Go to **Settings** → **Functions** (or **Bindings** tab if visible)
4. Look for **AI Binding** section
5. Add binding:
   - **Variable name:** `AI`
   - **Service:** AI
   - (Service should auto-populate)
6. Click **Save**

## Step 5: Test Your App

1. Navigate to your Pages URL (e.g., `https://abc123.cardio-interview-prep.pages.dev`)
2. Click **Chat Practice**
3. Select a category and type an answer
4. Click **Submit Answer**
5. You should see AI-generated feedback!

If you get "Failed to get feedback" error:
- Double-check AI binding is enabled (Step 4)
- Redeploy: go to Deployments tab → click the latest one → "Retry deployment"

## Step 6: Auto-Deployment

Your app will automatically deploy whenever you push to GitHub:
```bash
git add .
git commit -m "Your message"
git push origin main
```

Cloudflare will detect the push and redeploy automatically (~2 min).

## Troubleshooting

### "Failed to get feedback" in production
- **Issue:** AI binding not enabled
- **Fix:** Follow Step 4 above and retry

### Build fails with "npm not found"
- **Issue:** Node version mismatch
- **Fix:** In Settings → Environment, set `NODE_VERSION` to `18`

### Pages Function returns 404
- **Issue:** `/api/coach` endpoint not recognized
- **Fix:** Ensure `functions/api/coach.js` exists, then redeploy

### Stuck on "Pending" deployment
- **Wait:** Cloudflare deployments can take 2-5 minutes
- **Check:** Go to Deployments tab for status logs

## Next Steps

1. ✅ Deploy to Cloudflare Pages
2. 🧪 Test Chat Mode (AI feedback should work now!)
3. 🎤 Add Talk/Voice Mode
4. 📊 Monitor usage in Cloudflare Dashboard

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [Troubleshooting Guide](https://developers.cloudflare.com/pages/platform/limits-and-errors/)

---

**Cost Estimate:**
- Pages: Free (up to 500 builds/month, unlimited requests)
- Workers AI: ~$0.08 per 1M tokens (minimal for interview prep use)

**Monthly cost for typical user:** <$0.10
