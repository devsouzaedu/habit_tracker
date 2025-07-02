# 📊 Tracker de Hábitos & Instagram

Um aplicativo completo para rastrear hábitos diários e acompanhar o crescimento do Instagram, construído com React, TypeScript, Vite e Supabase.

## ✨ Funcionalidades

### 🎯 Tracker de Hábitos
- ✅ Criação e gerenciamento de hábitos personalizados
- 📊 Categorização por tipo (Trabalho, Leitura, Exercício, etc.)
- 🏆 Sistema de prioridades (Alta, Média, Baixa)
- 📈 Estatísticas detalhadas e análise de progresso
- 🔥 Controle de streaks (sequências)
- 🎨 Personalização com cores e ícones
- 📝 Notas e observações

### 📱 Instagram Analytics
- 📈 Acompanhamento de seguidores
- 📊 Gráficos de crescimento
- 📋 Histórico de dados
- 📈 Estatísticas de crescimento
- 📝 Notas sobre estratégias

### ☁️ Sincronização
- 💾 Armazenamento local automático
- ☁️ Sincronização opcional com Supabase
- 🔄 Backup e restauração de dados
- 📱 Acesso multi-dispositivo

## 🚀 Tecnologias

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + DaisyUI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: Supabase (opcional)
- **Date Handling**: date-fns

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação Local
```bash
# Clone o repositório
git clone [seu-repositorio]
cd tracker-habitos-new

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração do Supabase (Opcional)
1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie o arquivo `.env.example` para `.env`
4. Adicione suas credenciais:
```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```
5. Execute o script SQL em `supabase-setup.sql`

## 📦 Build e Deploy

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

### Deploy na Vercel
1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático! 🚀

## 📱 Como Usar

### Hábitos
1. **Adicionar Hábito**: Clique em "Adicionar Novo Hábito"
2. **Configurar**: Defina nome, categoria, prioridade e meta
3. **Marcar**: Clique nos dias da semana para marcar como concluído
4. **Acompanhar**: Veja suas estatísticas na aba "Estatísticas"

### Instagram
1. **Adicionar Dados**: Vá para a aba "Instagram"
2. **Registrar**: Adicione número de seguidores e notas
3. **Visualizar**: Acompanhe o gráfico de crescimento
4. **Analisar**: Veja estatísticas detalhadas

## 🎨 Temas
- 🌙 Modo escuro/claro
- 🎨 Interface moderna e responsiva
- 📱 Otimizado para mobile

## 🔒 Privacidade
- 💾 Dados armazenados localmente no navegador
- ☁️ Sincronização opcional e controlada pelo usuário
- 🔐 Sem rastreamento ou coleta de dados pessoais

## 📄 Licença
MIT License

## 🤝 Contribuições
Contribuições são bem-vindas! Abra uma issue ou envie um pull request.

---

Feito com ❤️ para ajudar você a construir hábitos melhores e acompanhar seu crescimento!
