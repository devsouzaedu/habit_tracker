# 🚀 Configuração do Supabase para Sincronização

Este guia te ajudará a configurar a sincronização na nuvem usando Supabase.

## 📋 **Pré-requisitos**
- Conta no [Supabase](https://supabase.com) (gratuita)
- Projeto criado no Supabase

## 🔧 **Passo a Passo**

### 1. **Criar Conta e Projeto**
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub
4. Clique em "New Project"
5. Escolha sua organização
6. Preencha:
   - **Name**: `tracker-habitos`
   - **Database Password**: (crie uma senha forte)
   - **Region**: `South America (São Paulo)`
7. Clique em "Create new project"

### 2. **Obter Credenciais**
1. No dashboard do projeto, vá em **Settings** > **API**
2. Copie:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. **Configurar Variáveis de Ambiente**
1. Copie o arquivo `env.example` para `.env`:
   ```bash
   cp env.example .env
   ```

2. Edite o arquivo `.env` com suas credenciais:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   VITE_USER_ID=seu-nome-unico
   ```

### 4. **Criar Tabelas no Banco**
1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase-setup.sql`
4. Cole no editor e clique em "Run"
5. ✅ Você verá "Success. No rows returned"

### 5. **Verificar Tabelas**
1. Vá em **Table Editor**
2. Você deve ver as tabelas:
   - `instagram_data`
   - `habits_data`

### 6. **Ativar Sincronização**
1. Reinicie o projeto: `npm run dev`
2. Vá na aba **Configurações**
3. Na seção **Sincronização**:
   - Clique no ⚙️ (engrenagem)
   - Ative "Habilitar sincronização na nuvem"
   - Digite seu ID único (ex: `joao-silva-123`)
   - Clique em "Salvar"

## ✅ **Testando**

### **Instagram Tracker**
1. Vá na aba **📈 Instagram**
2. Adicione alguns dados
3. Verifique se o status mostra "Sincronizado" ☁️

### **Habit Tracker**
1. Crie alguns hábitos
2. Marque como concluído
3. Os dados serão sincronizados automaticamente

### **Verificar no Supabase**
1. No dashboard, vá em **Table Editor**
2. Clique em `instagram_data` - você deve ver seus dados
3. Clique em `habits_data` - você deve ver um registro JSON

## 🔄 **Funcionalidades**

### **Sincronização Automática**
- ✅ Dados salvos localmente primeiro (backup)
- ✅ Sincronização automática quando online
- ✅ Funciona offline (dados locais)
- ✅ Sincronização forçada com botão 🔄

### **Multi-dispositivo**
- Use o mesmo `VITE_USER_ID` em diferentes dispositivos
- Dados sincronizam automaticamente
- Último dispositivo usado prevalece

### **Segurança**
- 🔒 Dados separados por usuário
- 🔒 Chaves públicas (seguro expor)
- 🔒 Row Level Security ativado

## 🆘 **Troubleshooting**

### **"Erro na sincronização"**
1. Verifique se as credenciais estão corretas no `.env`
2. Confirme que as tabelas foram criadas
3. Verifique a conexão com internet

### **"Dados não aparecem"**
1. Confirme que está usando o mesmo `USER_ID`
2. Verifique se há dados na tabela no Supabase
3. Tente sincronização forçada (botão 🔄)

### **"Tabelas não existem"**
1. Execute novamente o SQL do arquivo `supabase-setup.sql`
2. Verifique se não há erros no SQL Editor

## 💰 **Limites Gratuitos**
- **Banco**: 500MB (suficiente para anos)
- **Requisições**: 50.000/mês
- **Bandwidth**: 1GB/mês
- **Usuários**: Ilimitados

## 🎯 **Próximos Passos**
- [ ] Adicionar autenticação real
- [ ] Implementar compartilhamento de dados
- [ ] Criar backup automático
- [ ] Adicionar notificações

---

**🎉 Pronto! Sua sincronização está configurada e funcionando!** 