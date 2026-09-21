ALTER TABLE test_email RENAME COLUMN verificationUrl TO actionUrl;

ALTER TABLE test_email
  ADD COLUMN kind TEXT NOT NULL DEFAULT 'verification';

DROP INDEX test_email_recipient_createdAt_idx;

CREATE INDEX test_email_recipient_kind_createdAt_idx
  ON test_email (recipient, kind, createdAt DESC);
