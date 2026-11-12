CREATE TABLE scores (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX scores_rank ON scores (score DESC, created_at ASC, id ASC);
