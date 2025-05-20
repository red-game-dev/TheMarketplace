-- Drop existing tables and types if they exist
DROP TABLE IF EXISTS users, transactions, nft_metadata
CASCADE;
DROP TYPE IF EXISTS transaction_status
CASCADE;

-- Create custom types
CREATE TYPE transaction_status AS ENUM
('pending', 'completed', 'failed');

-- Create tables
CREATE TABLE users
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  created_at TIMESTAMP
  WITH TIME ZONE DEFAULT timezone
  ('utc'::text, now
  ()) NOT NULL,
  updated_at TIMESTAMP
  WITH TIME ZONE DEFAULT timezone
  ('utc'::text, now
  ()) NOT NULL
);

CREATE TABLE transactions
(
  id UUID PRIMARY KEY,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  token_id TEXT NOT NULL,
  status TEXT NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 137,
  network_name TEXT NOT NULL DEFAULT '',
  tx_hash TEXT,
  error TEXT,
  created_at TIMESTAMP
  WITH TIME ZONE DEFAULT timezone
  ('utc'::text, now
  ()) NOT NULL,
  updated_at TIMESTAMP
  WITH TIME ZONE DEFAULT timezone
  ('utc'::text, now
  ()) NOT NULL
);

CREATE TABLE nft_metadata
(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_address TEXT NOT NULL,
  token_id TEXT NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 137,
  network_name TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL,
  last_updated TIMESTAMP
  WITH TIME ZONE DEFAULT timezone
  ('utc'::text, now
  ()) NOT NULL,
  last_checked TIMESTAMP
  WITH TIME ZONE DEFAULT timezone
  ('utc'::text, now
  ()) NOT NULL,
  image_url TEXT,
  name TEXT,
  description TEXT,
  UNIQUE
  (contract_address, token_id, chain_id)
);

-- Create indexes
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_transactions_from_address ON transactions(from_address);
CREATE INDEX idx_transactions_to_address ON transactions(to_address);
CREATE INDEX idx_nft_metadata_contract ON nft_metadata(contract_address);
CREATE INDEX idx_nft_metadata_token ON nft_metadata(token_id);
CREATE INDEX idx_nft_metadata_last_updated ON nft_metadata(last_updated);