# Orbit Defense

An endless arcade space shooter. Move with A/D or the arrow keys, fire with Space, and pause with P. Touch controls are below the play area. When a run ends, enter a pilot name to record your score.

## Play offline

Open `index.html` directly in your browser. The offline leaderboard keeps the top 10 scores in that browser.

## Host the shared leaderboard

1. Create a Cloudflare D1 database and apply `drizzle/0000_scores.sql`.
2. Create the output directory `dist/server` and run `node worker.mjs` to bundle the game and leaderboard API.
3. Deploy `dist/server/index.js` as a Cloudflare Worker and bind the database as `DB`.

The Worker serves the game at `/` and reads and writes scores at `/api/scores`. Scores are client-reported and checked for valid format and plausible totals.
