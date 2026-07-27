# CardioInterview - Cloudflare Pages Deployment Guide

## Prerequisites

1. **Cloudflare Account** - Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI** - Already installed via `npm install -D wrangler`
3. **GitHub Repository** - Push your code to GitHub (required for Pages auto-deployment)

## Step 1: Authenticate Wrangler

```bash
npx wrangler login
```

This will open your browser to authorize Wrangler with your Cloudflare account.

## Step 2: Create a GitHub Repository

1. Create a new repo at [github.com/new](https://github.com/new)
2. Push the cardio-interview-prep project:

```bash
cd /Users/nv/Library/CloudStorage/Dropbox/DevProjects/cardio-interview-prep
git init
git add .
git commit -m "Initial CardioInterview commit"
git remote add origin https://github.com/YOUR_USERNAME/cardio-interview-prep.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Cloudflare Pages

### Option A: Via Wrangler (CLI)

```bash
# Build the project
npm run build

# Deploy to Pages
npx wrangler pages deploy dist
```

This will give you a unique URL like: `https://abc123.cardio-interview-prep.pages.dev`

### Option B: Via Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Select **Connect to Git**
4. Authorize GitHub and select your `cardio-interview-prep` repo
5. Build settings:
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `.` (or leave blank)
6. Click **Save and Deploy**

Cloudflare will auto-deploy on every push to `main`.

## Step 4: Enable Workers AI Binding

After deployment, you need to enable the AI binding for the `/api/coach` function:

1. In Cloudflare Dashboard, go to **Pages** → **cardio-interview-prep**
2. Click **Settings** → **Functions**
3. Under **AI Binding**, set:
   - **Variable name**: `AI`
   - **AI model**: (automatically configured for your region)
4. Save

## Step 5: Test the Deployment

1. Navigate to your deployed URL (e.g., `https://abc123.cardio-interview-prep.pages.dev`)
2. Click **Chat Practice**
3. Type an answer to an interview question
4. Click **Submit Answer**
5. You should now see AI-generated feedback!

## Environment Variables (Optional)

If you need to add environment variables later:

1. **Local dev**: Create `.env.local`
   ```
   VITE_API_URL=http://localhost:8788
   ```

2. **Production**: In Cloudflare Dashboard → Pages → Settings → Environment Variables

## Project Structure

```
cardio-interview-prep/
├── src/                    # React frontend
│   ├── components/        # React components (ChatMode, NotecardGame, etc.)
│   ├── store.js          # Zustand state management
│   ├── App.jsx           # Main app component
│   └── index.css         # Tailwind CSS
├── functions/            # Cloudflare Pages Functions
│   └── api/
│       └── coach.js      # AI coaching endpoint
├── dist/                 # Built frontend (created by npm run build)
├── wrangler.toml         # Cloudflare configuration
├── vite.config.js        # Vite build configuration
└── package.json          # Dependencies
```

## Troubleshooting

### "Failed to get feedback" error in production

**Issue**: The AI binding isn't configured.
**Solution**: Follow Step 4 above to enable the AI binding.

### Pages function returns 404

**Issue**: The `/api/coach` endpoint isn't being recognized.
**Solution**: 
- Ensure `functions/api/coach.js` exists
- Check that the file exports an `onRequest` function
- Rebuild and redeploy: `npm run build && npx wrangler pages deploy dist`

### Build failing

**Issue**: `npm run build` returns errors.
**Solution**:
```bash
npm install  # Reinstall dependencies
npm run build  # Rebuild
```

## Costs

**Cloudflare Pages** is free for:
- Up to 500 builds/month
- Unlimited requests to your site
- Workers AI is billed separately (~$0.08 per 1M tokens with GLM flash)

For interview prep use-case, costs should be minimal (<$1/month per active user).

## Next Steps

1. ✅ Deploy to Cloudflare Pages
2. 🎨 Redesign UI (modern chat interface like Gemini)
3. 🎤 Add Talk/Voice Mode (audio practice)
4. 📚 Expand question banks

---

Questions? Check the [Cloudflare Pages docs](https://developers.cloudflare.com/pages/) or the [Workers AI docs](https://developers.cloudflare.com/workers-ai/).
