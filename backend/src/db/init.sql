-- Initialize the prompts database

CREATE TABLE IF NOT EXISTS prompts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    model VARCHAR(100),
    token_count INTEGER DEFAULT 0,
    rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    note TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);

-- Add note column if it doesn't exist (for existing databases)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'prompts' AND column_name = 'note'
    ) THEN
        ALTER TABLE prompts ADD COLUMN note TEXT;
    END IF;
END $$;

-- Add tags column if it doesn't exist (for existing databases)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'prompts' AND column_name = 'tags'
    ) THEN
        ALTER TABLE prompts ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Create GIN index on tags for faster array searches
CREATE INDEX IF NOT EXISTS idx_prompts_tags ON prompts USING GIN(tags);

-- Insert some sample prompts
INSERT INTO prompts (title, content, model) VALUES 
    ('Code Review Assistant', 'Review the following code for bugs, security vulnerabilities, and suggest improvements. Focus on readability and best practices.', 'GPT-4'),
    ('Technical Documentation', 'Create clear, concise technical documentation for the following feature. Include usage examples and API references.', 'Claude 3.5'),
    ('Debug Helper', 'Help me debug this issue. Analyze the error message and suggest potential fixes with explanations.', 'GPT-4o');

-- ============================================
-- NOTES TABLE (Apple Notes-like feature)
-- ============================================

CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled',
    content TEXT DEFAULT '',
    color VARCHAR(20) DEFAULT 'default',
    is_pinned BOOLEAN DEFAULT FALSE,
    folder VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for notes
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_is_pinned ON notes(is_pinned DESC);
CREATE INDEX IF NOT EXISTS idx_notes_folder ON notes(folder);

-- Add columns if they don't exist (for existing databases)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'notes'
    ) THEN
        CREATE TABLE notes (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL DEFAULT 'Untitled',
            content TEXT DEFAULT '',
            color VARCHAR(20) DEFAULT 'default',
            is_pinned BOOLEAN DEFAULT FALSE,
            folder VARCHAR(100),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

