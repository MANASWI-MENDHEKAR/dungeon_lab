# 🏰 DUNGEON LAB
### Journal of Applied Dungeoneering & Subterranean Hazard Studies
*Vol. 47 · Est. 1347 AD · ISSN 1347-DOOM · Peer Reviewed (Mostly)*

> **The world's only academic journal dedicated to the rigorous, peer-reviewed study of dungeon design.**
> Powered by Gemini 2.0 Flash. Completely useless. Deeply important.

---

## 🎮 What Is This?

DUNGEON LAB is a **fake academic dungeon builder** where you:

1. **Paint dungeon tiles** onto a grid (lava pits, goblin nests, teapot rooms, boss chambers...)
2. **Watch absurd live metrics update** — Hero Mortality Probability, Goblin Wellbeing Index, Lava Carbon Footprint, Evil Density (evil/ft²)
3. **Get roasted in real-time** by three AI-powered peer reviewers (powered by Gemini 2.0 Flash) who argue about thermodynamics, monster welfare, and 14th-century building codes
4. **Submit for Peer Review** — receive a full fake academic paper with DOI, abstract, reviewer comments, and a verdict stamp (ACCEPTED / DESK REJECTED)

It solves zero real-world problems. That is the point.

---

## 🫖 The Teapot Room (RFC 2324)

Place the **Teapot Room** tile (🫖) in your dungeon, and:
- The backend exposes `GET /brew` → returns **HTTP 418 I'm a Teapot**
- The peer review paper includes an HTCPCP/1.0 compliance notice
- Larry Masinter is cc'd

```bash
curl https://your-backend.onrender.com/brew
# HTTP/1.1 418 I'm a Teapot
# {"error":"I'm a Teapot","rfc":"RFC 2324 §2.3.2","blame":"Larry Masinter"}
```

---

## 🤖 Google AI Usage

This project uses **Gemini 2.0 Flash** via the Google AI Generative Language API for:

- **Live reviewer comments** — every tile you place triggers a real-time roast from one of three AI-powered academic personas (Prof. Grimm, Dr. Skullvane, Dr. Voss)
- **Full peer review papers** — Gemini generates a complete fake academic paper including abstract, methodology critique, statistical analysis, reviewer comments, ethical review board ruling, and verdict

The Gemini API key is kept safe on the backend (Render environment variables) and never exposed to users.

---

## 🚀 Deployment Guide (Step by Step)

### Step 1 — Get Your Gemini API Key (Free)
1. Go to → https://aistudio.google.com
2. Click **Get API Key** → **Create API Key**
3. Copy it somewhere safe

### Step 2 — Deploy Backend to Render (Free)

1. Create account at https://render.com (free)
2. Click **New → Web Service**
3. Connect your GitHub repo (push the `backend/` folder)
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
5. Add Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: your key from Step 1
6. Click **Deploy** — wait ~2 minutes
7. Copy your Render URL (looks like `https://dungeon-lab-backend.onrender.com`)

### Step 3 — Update Frontend Config

Open `frontend/index.html` and find this line near the top of the `<script>`:

```javascript
const BACKEND = 'https://dungeon-lab-backend.onrender.com';
```

Replace with your actual Render URL.

### Step 4 — Deploy Frontend to Netlify (Free)

**Option A — Drag & Drop (easiest):**
1. Go to https://netlify.com → sign up free
2. Drag the `frontend/` folder onto the Netlify dashboard
3. Done! You get a URL like `https://dungeon-lab-abc123.netlify.app`

**Option B — GitHub:**
1. Push `frontend/` to GitHub
2. Connect repo on Netlify
3. Set publish directory to `frontend`

### Step 5 — Test It
- Open your Netlify URL
- Green pill = backend connected = AI reviewers active
- Place tiles, get roasted, submit for peer review
- Try `curl https://your-backend.onrender.com/brew` for the 418

---

## 📁 Project Structure

```
dungeon-lab/
├── backend/
│   ├── server.js          ← Express + Gemini proxy
│   ├── package.json
│   ├── .env.example       ← Copy to .env for local dev
│   └── .gitignore         ← .env is gitignored (key stays safe!)
└── frontend/
    └── index.html         ← The entire dungeon app (one file!)
```

---

## 🧑‍💻 Local Development

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env → add your GEMINI_API_KEY
npm install
npm run dev   # runs on localhost:3001

# Frontend
# Just open frontend/index.html in your browser
# Change BACKEND const to 'http://localhost:3001'
```

---

## 🏆 Fake Metrics Explained

| Metric | Formula | Why |
|--------|---------|-----|
| Hero Mortality | `traps×13.1 + monsters×9.2 + boss×28` | Peer-reviewed (by us) |
| Goblin Wellbeing | `100 - traps×14 - lava×22 + rooms×12` | Union contract §7 |
| Evil Density | `(traps×2.2 + monsters×1.9) / tiles` | Municipal Code §666 |
| Lava Carbon Footprint | `lava×847 + dragons×12,400 Mt/yr` | IPCC Dungeon Report 2024 |
| Trap Density | `traps / rooms` | Standard: 2.7 (Tomb of Horrors, 1978) |

---

## 📜 License

WTFPL — Do What The F*** You Want To Public License.
The Dungeon Ethical Review Board has approved this license as "chaotic neutral."

---

*DUNGEON LAB is not responsible for: goblin trauma, lava-related EU fines, OSHA violations, RFC 2324 enforcement actions, or any dungeons that accidentally achieve a 99.9% hero mortality rate. Reviewer #4's opinions are their own and do not reflect the journal's editorial stance. (Reviewer #4 has been muted.)*
