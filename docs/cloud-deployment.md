# DollarPath — Guia de Deploy em Nuvem ☁️🚀

Este documento fornece as instruções para publicar a aplicação DollarPath na nuvem de forma privada, segura e escalável quando você decidir transitar do ambiente local para produção.

---

## Estratégias Recomendadas de Hospedagem

### Opção 1: Arquitetura Moderna Serverless / PaaS (Recomendada)
- **Frontend (Web PWA)**: Vercel, Netlify ou Cloudflare Pages (Gratuito / Baixo Custo).
- **Backend (API)**: Railway, Render ou Fly.io.
- **Banco de Dados**: PostgreSQL Gerenciado no Neon Serverless Postgres ou Supabase.

### Opção 2: Container Único via Docker Compose (VPS Própria)
- Uma VPS acessível (DigitalOcean Droplet, Hetzner Cloud, AWS Lightsail).
- Docker + Docker Compose executando Web (Nginx), API (Node) e Banco (PostgreSQL) com certificado SSL Let's Encrypt automático via Traefik ou Caddy.

---

## 1. Deploy do Frontend (Vercel / Netlify)

1. Crie uma conta no [Vercel](https://vercel.com) ou [Netlify](https://netlify.com).
2. Conecte seu repositório Git.
3. Configure o projeto:
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install` (na raiz do monorepo)
4. Variáveis de ambiente no dashboard da Vercel/Netlify:
   - `VITE_API_URL`: URL da sua API na nuvem (ex: `https://api.dollarpath.seudominio.com`).

---

## 2. Deploy do Banco de Dados (Neon / Supabase)

1. Acesse [Neon.tech](https://neon.tech) ou [Supabase](https://supabase.com).
2. Crie um novo banco de dados PostgreSQL.
3. Copie a connection string fornecida no formato:
   ```
   DATABASE_URL="postgresql://usuario:senha@ep-xyz.region.neon.tech/dollarpath?sslmode=require"
   ```

---

## 3. Deploy da API (Railway / Render)

1. Crie um novo serviço no [Railway](https://railway.app).
2. Defina o **Root Directory** como `apps/api` ou use o Dockerfile em `apps/api/Dockerfile`.
3. Configure as variáveis de ambiente no Railway:
   - `DATABASE_URL`: URL do Neon / Supabase obtida no passo anterior.
   - `FRONTEND_URL`: URL do seu frontend (ex: `https://dollarpath.vercel.app`).
   - `NODE_ENV`: `production`
   - `PORT`: `4000`
4. Execute as migrations do Prisma:
   ```bash
   npx prisma migrate deploy
   ```

---

## 4. Deploy com Docker Compose (VPS / Servidor Dedicado)

Se optar por rodar em servidor próprio:
1. Instale o Docker e Docker Compose na máquina:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose
   ```
2. Clone o repositório na VPS e crie o arquivo `.env`:
   ```bash
   cp .env.example .env
   # Edite o .env com senhas fortes
   nano .env
   ```
3. Suba todos os serviços em segundo plano:
   ```bash
   docker compose up -d --build
   ```
4. O app estará rodando nas portas:
   - Web: `http://SEU_IP:3000`
   - API: `http://SEU_IP:4000`

---

## 5. Checklist de Segurança e Privacidade para Nuvem

- [ ] **HTTPS Obrigatório**: Nunca trafegue informações financeiras sem criptografia TLS/SSL.
- [ ] **Variáveis Sensíveis Ocultas**: `.env` nunca deve ser comitado no GitHub/GitLab.
- [ ] **CORS Restrito**: A API deve aceitar requisições única e exclusivamente da origem do seu frontend.
- [ ] **Autenticação**: Como o projeto foi concebido para uso pessoal privado, adicionar autenticação com token (JWT ou sessão de senha forte) antes de expor a API abertamente na internet.
- [ ] **Backups Automáticos**: Configure rotinas diárias de dump do banco PostgreSQL no Neon/Supabase.
