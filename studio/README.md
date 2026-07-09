# Xethra — Private AI Video Studio

A Higgsfield-style AI video generation studio powered by **BytePlus ModelArk** (Seedance 2.0).

**Features**
- Text-to-video, image-to-video, reference-image generation
- All Seedance 2.0 model variants (standard, fast, face)
- Aspect ratio, resolution, duration, and audio controls
- Real-time generation queue with polling
- Video gallery with full-screen playback and download
- Single-user email/password login (only you can access it)
- Dark UI with iZop color palette

---

## 1. BytePlus Setup (5 minutes)

1. Log in to [console.byteplus.com](https://console.byteplus.com/ark)
2. Go to **ModelArk → Model Activation → Media tab**
3. Activate these models (click "Activate"):
   - `Dola-Seed-2.0` (dreamina-seedance-2-0-260128)
   - `Dola-Seed-2.0-lite` (dreamina-seedance-2-0-fast-260128)
4. Go to **ModelArk → API Keys → Create API Key**
5. Copy the key — you'll need it for `BYTEPLUS_API_KEY`

---

## 2. Environment Setup

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```env
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD_HASH=<see below>
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.vercel.app
BYTEPLUS_API_KEY=your-api-key
BYTEPLUS_BASE_URL=https://ark.ap-southeast.bytepluses.com/api/v3
```

**Generate your password hash** (run this once in terminal):

```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('YourPasswordHere', 12))"
```

Paste the output as `ADMIN_PASSWORD_HASH`.

---

## 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 4. Deploy to Vercel (your domain)

```bash
npm install -g vercel
vercel
```

Or push to GitHub and connect via [vercel.com](https://vercel.com).

**After deploy:**
1. Update `NEXTAUTH_URL` to your Vercel URL
2. In Vercel project settings → Environment Variables, add all vars from `.env.local`
3. For a custom domain: Vercel Dashboard → your project → Domains → Add domain

**Recommended domain name:** `xethra.com` (existing Vercel project)  
Register at [Namecheap](https://namecheap.com) or [Porkbun](https://porkbun.com), then point to Vercel.

---

## 5. Supported Models

| Model | ID | Notes |
|---|---|---|
| Seedance 2.0 | `dreamina-seedance-2-0-260128` | Best quality, 720p–1080p |
| Seedance 2.0 Fast | `dreamina-seedance-2-0-fast-260128` | 2× faster, 720p only |
| Seedance 2.0 Face | `dreamina-seedance-2-0-260128-face` | Real-person reference images |
| Seedance 2.0 Fast Face | `dreamina-seedance-2-0-fast-260128-face` | Fast + real-person |

> **Note:** `Face` model variants are required when uploading reference images of real people (Guy Kogen avatar generation). Non-face variants will reject real face images.

---

## 6. Video URLs expire in 24 hours

BytePlus temporary URLs are cleaned after 24 hours. **Download videos immediately** using the download button after generation.
