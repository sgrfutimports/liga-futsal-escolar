<div align="center">

# ⚽ Liga Futsal Escolar

**Sistema de gerenciamento de campeonato de futsal escolar**  
Gerencie times, atletas, partidas e classificações em tempo real.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 📋 Funcionalidades

- 🏆 **Classificação** — Tabela de pontos em tempo real
- 👥 **Times** — Cadastro e gerenciamento de equipes
- 🧑‍🤝‍🧑 **Atletas** — Registro de jogadores por time
- ⚽ **Partidas** — Cronograma e resultados dos jogos
- 🔐 **Painel Admin** — Área administrativa protegida
- 📊 **Relatórios PDF/Excel** — Exportação de dados

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- Conta no [Supabase](https://supabase.com)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/liga-futsal-escolar.git
cd liga-futsal-escolar

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 4. Configure o banco de dados
# Execute o arquivo supabase_schema.sql no painel SQL do Supabase

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:3000`

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima do Supabase |
| `GEMINI_API_KEY` | Chave da API Gemini (opcional) |

## 🗄️ Banco de Dados

O schema do banco está em `supabase_schema.sql`. Para configurar:

1. Acesse seu projeto no [Supabase](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo de `supabase_schema.sql`

## 🛠️ Scripts disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera o build de produção
npm run preview  # Visualiza o build localmente
npm run lint     # Verifica erros de TypeScript
```

## 📁 Estrutura do Projeto

```
liga-futsal-escolar/
├── src/
│   ├── components/    # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── lib/           # Configurações (Supabase, etc.)
│   └── types/         # Tipos TypeScript
├── public/            # Arquivos estáticos
├── supabase_schema.sql # Schema do banco de dados
├── .env.example        # Exemplo de variáveis de ambiente
└── vite.config.ts      # Configuração do Vite
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona minha feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
