# DollarPath — Modelo de Banco de Dados Relacional (v1.1)

O modelo de dados do DollarPath foi atualizado para suportar nativamente o **DollarPath Intelligence (Advisor)** e a política de notificações **Important**.

## Entidades e Mapeamento

1. **Asset**: Cadastros de ativos em USD (stocks, ETFs, REITs).
2. **Transaction**: Histórico de ordens (BUY, SELL, DIVIDEND, FEE, EXCHANGE) que alimentam os saldos de forma auditável.
3. **MonthlyBudget**: Parâmetros de receitas, despesas, reserva de emergência e aporte mensal de referência (R$ 300).
4. **Goal**: Metas financeiras de longo prazo (ex: R$ 300.000 em 10 anos).
5. **GoalProjection & ProjectionScenario**:
   - Guarda a fotografia das premissas utilizadas em cada cálculo (Cenários Conservador, Base e Otimista).
   - Registra o aporte mensal necessário e o prazo projetado.
6. **DecisionLog**:
   - Registro permanente e auditável dos eventos financeiros detectados pelo sistema (ex: aporte não realizado, retirada, alteração de câmbio).
   - Armazena a explicação detalhada do Advisor e a decomposição dos efeitos ($\Delta \text{Aportes}$, $\Delta \text{Rentabilidade}$, $\Delta \text{Câmbio}$).
   - Armazena as alternativas apresentadas e a escolha do usuário.
7. **Alert**:
   - Central de notificações do sistema aplicando a política de relevância `Important`.
   - Evita ruído por movimentações rotineiras e foca em desvios materiais do plano.
