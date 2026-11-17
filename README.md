# DollarPath 💵🚀

Central pessoal de inteligência para investimentos em ativos denominados em dólar (USD).

## 💡 Sobre o Projeto
O DollarPath é uma aplicação web progressiva (PWA) de alto padrão visual (Dark Premium), desenhada para investidores focados no mercado americano (NYSE / NASDAQ).
Diferente de planilhas estáticas ou dashboards sobrecarregados de gráficos complexos, o DollarPath funciona como um **radar editorial e de inteligência**:
- **Notícias Contextuais**: Notícias filtradas para os ativos em custódia (NVDA, CVX, MU, AMZN, etc.), separando categoricamente fatos de interpretações.
- **Radar de Oportunidades**: Análise fundamentalista e catalisadores com pontuações transparentes e auditáveis.
- **Controle Patrimonial**: Gestão de transações em USD com acompanhamento de taxa de câmbio USD/BRL e preço médio.
- **Planejamento & Metas**: Gestão do orçamento de aportes e simulações de metas financeiras de longo prazo.

## 🛠️ Tecnologias
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Navegação & Estado**: React Router 7 + TanStack Query + Lucide Icons + Recharts
- **PWA**: vite-plugin-pwa (instalável em computador e smartphone)
- **Monorepo**: npm workspaces (`apps/web`, `apps/api`, `packages/shared`)
- **Backend & Dados (Planejado para etapas subsequentes)**: Node.js Express + Prisma ORM + PostgreSQL

## 🚀 Como Rodar Localmente

1. Clone o repositório e instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento do frontend:
```bash
npm run dev:web
```

3. Abra [http://localhost:5173](http://localhost:5173) no seu navegador.
