const express = require('express');
const cors = require('cors');
 
const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
 
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
 
// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'DUNGEON LAB BACKEND ONLINE', teapot: false }));
 
// ── 418 Easter Egg ────────────────────────────────────────────
app.get('/brew', (req, res) => {
  res.status(418).json({
    error: "I'm a Teapot",
    message: "This server refuses to brew coffee because it is, permanently and defiantly, a teapot.",
    rfc: "RFC 2324 §2.3.2",
    blame: "Larry Masinter",
    http_status: 418
  });
});
 
app.post('/brew', (req, res) => {
  res.status(418).json({
    error: "I'm a Teapot",
    message: "HTCPCP/1.0 — Brew request denied. I am a teapot. I will always be a teapot.",
    rfc: "RFC 2324",
    http_status: 418
  });
});
 
// ── Live reviewer comment (single tile placed) ─────────────────
app.post('/api/reviewer', async (req, res) => {
  if (!GEMINI_KEY) return res.status(500).json({ error: 'No API key configured' });
 
  const { tile, dungeonSummary, reviewer } = req.body;
  if (!tile || !reviewer) return res.status(400).json({ error: 'Missing tile or reviewer' });
 
  const personas = {
    grimm: `You are PROF. ALDRIC GRIMM, pompous professor of subterranean architecture. You are obsessed with corridor widths, load-bearing walls, fire egress compliance, and 14th-century building codes.`,
    skullvane: `You are DR. SKULLVANE, monster behavioral scientist. You are deeply concerned about psychological wellbeing of dungeon creatures and cite made-up papers about goblin trauma and predator clustering anxiety.`,
    voss: `You are DR. LENA VOSS, trap thermodynamics engineer. You calculate thermal efficiency of every hazard, are horrified by inefficient lava placement, and reference heat equations obsessively.`,
  };
 
  const prompt = `${personas[reviewer] || personas.grimm}
 
A dungeon architect just placed: ${tile.emoji} ${tile.label} (type: ${tile.cat})
Current dungeon contents: ${dungeonSummary || 'mostly empty, deeply disappointing'}
 
Write ONE short, funny, academically pompous reaction (2-3 sentences). Reference fake studies, ridiculous metrics, or absurd academic concerns. Use citations like "(ref: Tomb of Horrors §3.4, 1978)" or "per JADSH Vol.23". Be outraged or baffled. No markdown, just plain text.`;
 
  try {
    const r = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    res.json({ text: text || 'Reviewer momentarily speechless. Filing a complaint about it.' });
  } catch (e) {
    res.status(500).json({ error: 'Gemini request failed', detail: e.message });
  }
});
 
// ── Full peer review paper ─────────────────────────────────────
app.post('/api/peer-review', async (req, res) => {
  if (!GEMINI_KEY) return res.status(500).json({ error: 'No API key configured' });
 
  const { dungeonLayout, metrics } = req.body;
  if (!dungeonLayout) return res.status(400).json({ error: 'Missing dungeon layout' });
 
  const prompt = `You are the editorial board of the Journal of Applied Dungeoneering & Subterranean Hazard Studies (JADSH).
 
DUNGEON SUBMITTED:
${dungeonLayout}
 
COMPUTED METRICS: ${metrics}
 
Generate a hilarious peer review report. Respond ONLY with valid JSON (no markdown, no backticks):
{
  "title": "pompous academic paper title about this dungeon",
  "abstract": "2-3 sentence scientific-sounding abstract",
  "methodology": "2-3 sentences critiquing dungeon methodology like a pedantic reviewer",
  "stats": "2-3 sentences about made-up statistical issues",
  "grimm": "Prof Grimm 2-sentence architectural review",
  "skullvane": "Dr Skullvane 2-sentence monster welfare comment",
  "voss": "Dr Voss 2-sentence thermodynamics comment",
  "r4": "Reviewer 4 comment (1-4 words, dismissive)",
  "verdict": "ACCEPT or MINOR_REVISION or MAJOR_REVISION or DESK_REJECT",
  "verdict_reason": "2-3 sentence pompous verdict explanation",
  "erb": "2-sentence Dungeon Ethical Review Board ruling on whether this dungeon is too evil or not evil enough"
}`;
 
  const fallback = {
    title: 'A Dungeon of Suspicious Methodology',
    abstract: 'This dungeon defies conventional analysis. The authors appear confused about basic subterranean principles. We are baffled this was submitted.',
    methodology: 'The methodology is unclear at best. No control group was established. The lava pit placement suggests the architect has never read a building code.',
    stats: 'Statistics were attempted. They failed. The p-value is, frankly, an embarrassment.',
    grimm: 'The corridor widths violate every principle established since 1347. I have filed 14 separate complaints with the relevant authorities.',
    skullvane: 'The monsters show signs of existential dread. No psychological impact assessment was conducted. This is a welfare crisis.',
    voss: 'Thermal efficiency is, frankly, embarrassing. The heat distribution suggests the architect confused a dungeon with a car park.',
    r4: 'mid.',
    verdict: 'DESK_REJECT',
    verdict_reason: 'Rejected without external review. Lacks methodological rigour, proper citations, and a statistically significant lava pit. We wish you luck. We do not mean this.',
    erb: 'Ethics board deeply concerned. Emergency meeting scheduled. The dungeon is simultaneously too evil and not evil enough, which is a remarkable achievement.'
  };
 
  try {
    const r = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await r.json();
    console.log('GEMINI FULL RESPONSE:', JSON.stringify(data).substring(0, 500));
    let raw = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    raw = raw.replace(/```json|```/g, '').trim();
    try {
      const parsed = JSON.parse(raw);
      res.json(parsed);
    } catch(e) {
      console.error('JSON parse failed, using fallback:', raw.substring(0, 200));
      res.json(fallback);
    }
  } catch (e) {
    console.error('Gemini request failed:', e.message);
    res.json(fallback);
  }
});
 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🏰 DUNGEON LAB backend running on port ${PORT}`));
 









