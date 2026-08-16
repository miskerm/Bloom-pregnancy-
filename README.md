# Bloom — Pregnancy Nutrition Companion

A single-page pregnancy nutrition guide with a Three.js "growth orb" hero
and an AI chat assistant, ready to deploy to Vercel.

## Project structure

```
.
├── api/
│   └── chat.js          ← serverless function, proxies chat to Anthropic
├── src/
│   ├── BloomApp.jsx      ← the main app component
│   ├── main.jsx          ← React entry point
│   └── index.css         ← Tailwind entry
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Run it locally

```bash
npm install
npm run dev
```

This starts the frontend, but the chat won't work yet locally unless you
also run it through `vercel dev` (see below) — plain `vite dev` doesn't
execute the `/api` serverless function.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com, "Add New Project", import the repo.
   Vercel auto-detects Vite and the `/api` folder — no config needed.
3. In the Vercel project's **Settings → Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your real key from console.anthropic.com
4. Deploy. Vercel gives you a live URL like `bloom.vercel.app`.
5. (Optional) Add a custom domain under **Settings → Domains**.

To test the API locally before deploying, install the Vercel CLI
(`npm i -g vercel`) and run `vercel dev` instead of `npm run dev` — this
runs both the frontend and the `/api/chat` function together.

## Notes

- The chat's system prompt keeps answers to general nutrition guidance and
  tells users to contact their midwife/OB for anything urgent or
  symptom-specific — worth keeping that guardrail if you extend it further.
- `api/chat.js` truncates message length/count as a basic cost guardrail;
  adjust the limits there if needed.
- This is general nutrition information, not medical advice — the app
  says so in its footer and in the chat's opening message.
