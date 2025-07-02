-- Queries SQL para configurar o Supabase
-- Execute estas queries no SQL Editor do seu projeto Supabase

-- 1. Criar tabela para dados do Instagram
CREATE TABLE IF NOT EXISTS instagram_data (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date DATE NOT NULL,
    followers INTEGER NOT NULL,
    following INTEGER,
    posts INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela para dados dos hábitos
CREATE TABLE IF NOT EXISTS habits_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    habit_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_instagram_data_user_id ON instagram_data(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_data_date ON instagram_data(date);
CREATE INDEX IF NOT EXISTS idx_habits_data_user_id ON habits_data(user_id);

-- 4. Criar constraint única para evitar duplicatas
ALTER TABLE instagram_data ADD CONSTRAINT unique_user_date UNIQUE (user_id, date);
ALTER TABLE habits_data ADD CONSTRAINT unique_user_habits UNIQUE (user_id);

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE instagram_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits_data ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas de segurança (permite acesso apenas aos próprios dados)
-- Para instagram_data
CREATE POLICY "Users can view own instagram data" ON instagram_data
    FOR SELECT USING (true); -- Como não temos auth, permitir todos por enquanto

CREATE POLICY "Users can insert own instagram data" ON instagram_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own instagram data" ON instagram_data
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own instagram data" ON instagram_data
    FOR DELETE USING (true);

-- Para habits_data
CREATE POLICY "Users can view own habits data" ON habits_data
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own habits data" ON habits_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own habits data" ON habits_data
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own habits data" ON habits_data
    FOR DELETE USING (true);

-- 7. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Criar triggers para atualizar updated_at
CREATE TRIGGER update_instagram_data_updated_at 
    BEFORE UPDATE ON instagram_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_data_updated_at 
    BEFORE UPDATE ON habits_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Pronto! Suas tabelas estão configuradas e prontas para uso. 