/*
  # Articles Catalog with Home Shortcuts

  ## Overview
  This migration creates the database structure for an article catalog with customizable home page shortcuts.
  
  ## New Tables
  
  ### `articles`
  Stores all articles in the catalog
  - `id` (uuid, primary key) - Unique article identifier
  - `title` (text) - Article title
  - `description` (text) - Article description/content
  - `icon` (text) - Icon name from lucide-react
  - `color` (text) - Icon background color (hex)
  - `url` (text, nullable) - Optional external URL
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `home_shortcuts`
  Stores user's selected shortcuts for the home page
  - `id` (uuid, primary key) - Unique shortcut identifier
  - `article_id` (uuid, foreign key) - Reference to article
  - `position` (integer) - Display order on home page
  - `created_at` (timestamptz) - Creation timestamp
  
  ## Security
  - RLS enabled on both tables
  - Public read access for all users
  - No authentication required (public catalog)
  - Insert/Update/Delete policies for managing content
  
  ## Notes
  - Articles can exist without being shortcuts
  - Shortcuts reference articles and define their position
  - Position determines the order of icons on home page
*/

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  icon text NOT NULL DEFAULT 'FileText',
  color text NOT NULL DEFAULT '#3b82f6',
  url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create home_shortcuts table
CREATE TABLE IF NOT EXISTS home_shortcuts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  position integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(position)
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_shortcuts ENABLE ROW LEVEL SECURITY;

-- Policies for articles
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Articles can be inserted by anyone"
  ON articles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Articles can be updated by anyone"
  ON articles FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Articles can be deleted by anyone"
  ON articles FOR DELETE
  TO public
  USING (true);

-- Policies for home_shortcuts
CREATE POLICY "Shortcuts are viewable by everyone"
  ON home_shortcuts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Shortcuts can be inserted by anyone"
  ON home_shortcuts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Shortcuts can be updated by anyone"
  ON home_shortcuts FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Shortcuts can be deleted by anyone"
  ON home_shortcuts FOR DELETE
  TO public
  USING (true);

-- Insert sample articles
INSERT INTO articles (title, description, icon, color, url) VALUES
  ('Поиск', 'Поисковая система', 'Search', '#ef4444', 'https://google.com'),
  ('Почта', 'Электронная почта', 'Mail', '#f59e0b', 'https://mail.google.com'),
  ('Карты', 'Карты и навигация', 'Map', '#10b981', 'https://maps.google.com'),
  ('YouTube', 'Видеохостинг', 'Youtube', '#dc2626', 'https://youtube.com'),
  ('Календарь', 'Календарь событий', 'Calendar', '#3b82f6', 'https://calendar.google.com'),
  ('Документы', 'Работа с документами', 'FileText', '#8b5cf6', null),
  ('Фото', 'Галерея фотографий', 'Image', '#ec4899', null),
  ('Новости', 'Последние новости', 'Newspaper', '#06b6d4', null),
  ('Музыка', 'Музыкальный плеер', 'Music', '#f97316', null),
  ('Настройки', 'Настройки приложения', 'Settings', '#6b7280', null)
ON CONFLICT DO NOTHING;

-- Insert sample shortcuts (first 6 articles)
INSERT INTO home_shortcuts (article_id, position)
SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1
FROM articles
LIMIT 6
ON CONFLICT DO NOTHING;