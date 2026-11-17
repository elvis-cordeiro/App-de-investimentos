# DollarPath — Especificação de Requisitos (Versão 1.1)

Atualizada em: **17 de novembro de 2026**

## 1. Visão Geral e Princípios
O **DollarPath** é uma aplicação web privada, responsiva e instalável como PWA, voltada ao controle financeiro pessoal e ao acompanhamento de uma carteira com foco de longo prazo em ativos denominados em dólar (USD).

### Princípios do Produto
- **Clareza**: Apresentar números, premissas, fontes e limitações de forma compreensível.
- **Decisão assistida**: Apoiar a análise do usuário, sem jamais executar operações automaticamente.
- **Histórico confiável**: Preservar movimentações e decisões; nunca sobrescrever o passado silenciosamente.
- **Disciplina sem pressão**: Apontar desvios e alternativas com linguagem respeitosa, sem culpa ou constrangimento.
- **Transparência**: Separar fatos confirmados, cálculos do sistema e hipóteses de mercado.

---

## 2. Objetivos Financeiros e Parâmetros Iniciais
- **Meta Patrimonial**: R$ 300.000 equivalentes investidos em ativos denominados em USD (A meta não representa US$ 300.000 brutos, mas seu equivalente cambial).
- **Meta Futura de Renda**: R$ 1.000 a R$ 1.500 mensais líquidos sem vender o núcleo da carteira (meta aspiracional e probabilística, sujeita a impostos e variações de proventos).
- **Horizonte de Planejamento**: 10 anos como referência base, com simulações personalizáveis.
- **Aporte Mensal de Referência**: R$ 300,00 sujeito à disponibilidade financeira e orçamento.
- **Reserva de Emergência**: R$ 4.000,00 (confirmar saldo real antes de utilizar em projeções de risco).
- **Ativos Iniciais do Radar/Carteira**: NVDA, CVX, MU, AMZN (não fixados no código; editáveis pela interface).

---

## 3. DollarPath Intelligence
O módulo de acompanhamento inteligente do plano atua como cérebro de governança financeira.

### 3.1 Perfil de Comportamento: Advisor
- **Papel**: Consultor estratégico, objetivo, analítico e construtivo.
- Explica o que mudou, por que mudou e o impacto estimado sobre a meta.
- Apresenta alternativas realistas (manter o plano, redistribuir aportes futuros ou rever prazos).
- Nunca pressiona a investir, nunca incentiva endividamento e nunca sugere comprometer despesas essenciais ou reserva de emergência.
- Nenhuma operação (compra/venda/transferência) é executada sem decisão e ação explícita do investidor.

### 3.2 Política de Notificações: Important
- Notifica **somente eventos relevantes ou mudanças materiais** no plano.
- Movimentações rotineiras atualizam dados sem gerar ruído desnecessário.
- Alertas consolidados no **Notification Center** interno.

### 3.3 Eventos Reconhecidos pelo Sistema
1. **Aporte planejado não realizado**: aporte previsto não registrado na janela do mês.
2. **Aporte abaixo do planejado**: valor registrado inferior ao previsto (ex: R$ 150 em vez de R$ 300).
3. **Retirada ou venda**: redução do capital investido por retirada ou desinvestimento.
4. **Aporte adicional**: aporte extraordinário ou acima do planejado.
5. **Alteração de premissas**: mudanças na taxa de câmbio USD/BRL, expectativa de retorno, meta ou prazo.

### 3.4 Componentes Internos
- **Contribution Monitor**: Monitora a aderência do cronograma mensal de aportes.
- **Goal Projection Engine**: Projeta prazo estimado e aporte mensal necessário.
- **Scenario Simulator**: Cenários Conservador, Base e Otimista com premissas transparentes.
- **Financial Alerts**: Aplica a política de relevância *Important*.
- **Decision History**: Trilha auditável de eventos, diagnósticos do Advisor e decisões adotadas.
- **Notification Center**: Central de avisos com badges de relevância e estado de leitura.

---

## 4. Diretrizes de Transparência e Projeções
- Projeções são **estimativas condicionais**, nunca promessas de retorno.
- Decomposição visual dos efeitos:
  $$\Delta \text{Patrimônio} = \text{Efeito Aportes} + \text{Desempenho dos Ativos} + \text{Variação Cambial}$$
- Exibição explícita da taxa de câmbio utilizada, data da cotação e premissas tributárias (ex: 30% retenção nos EUA).
