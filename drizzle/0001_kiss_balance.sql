ALTER TABLE users ADD COLUMN IF NOT EXISTS kiss_balance integer NOT NULL DEFAULT 0;

UPDATE users u
SET kiss_balance = COALESCE((
  SELECT SUM(CASE WHEN d.creator_id = u.id THEN d.current_offer ELSE -d.current_offer END)
  FROM deals d
  WHERE d.nest_id = u.nest_id AND d.status = 'sealed'
), 0)
WHERE u.nest_id IS NOT NULL;
