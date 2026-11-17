# DollarPath - Modelo de Banco de Dados (Prisma & PostgreSQL)

O modelo de dados segue o princípio de **rastreabilidade e consistência financeira**:
- Todos os campos monetários utilizam `Decimal(18, 4)` para evitar problemas de arredondamento com float.
- O saldo e o preço médio das posições são calculados a partir das transações registradas, mantendo auditoria completa.
- Separação entre dados externos (cotações, notícias coletadas) e entradas do investidor.

## Entidades Principais

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum AssetType {
  STOCK
  ETF
  REIT
  CRYPTO
  CASH
}

enum TransactionType {
  BUY
  SELL
  DIVIDEND
  FEE
  EXCHANGE
}

enum NewsCategory {
  URGENT
  PORTFOLIO
  OPPORTUNITY
  MARKET_OVERVIEW
}

model Asset {
  id              String        @id @default(uuid())
  ticker          String        @unique
  name            String
  type            AssetType     @default(STOCK)
  sector          String
  currency        String        @default("USD")
  country         String        @default("US")
  status          String        @default("ACTIVE")
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  transactions    Transaction[]
  dividends       Dividend[]
  newsRelations   NewsAsset[]
  opportunities   Opportunity[]
  contributionPlans ContributionPlan[]
}

model Transaction {
  id              String          @id @default(uuid())
  assetId         String
  asset           Asset           @relation(fields: [assetId], references: [id])
  type            TransactionType
  date            DateTime
  quantity        Decimal         @db.Decimal(18, 6)
  unitPrice       Decimal         @db.Decimal(18, 4)
  currency        String          @default("USD")
  exchangeRate    Decimal?        @db.Decimal(18, 4) // BRL por USD
  fees            Decimal?        @db.Decimal(18, 4)
  notes           String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

model MonthlyBudget {
  id                      String    @id @default(uuid())
  month                   String    @unique // Formato: YYYY-MM
  income                  Decimal   @db.Decimal(18, 2)
  expenses                Decimal   @db.Decimal(18, 2)
  emergencyReserveBalance Decimal   @db.Decimal(18, 2)
  plannedInvestment       Decimal   @db.Decimal(18, 2)
  currency                String    @default("BRL")
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
}

model ContributionPlan {
  id               String   @id @default(uuid())
  assetId          String
  asset            Asset    @relation(fields: [assetId], references: [id])
  targetPercentage Decimal? @db.Decimal(5, 2)
  targetValue      Decimal? @db.Decimal(18, 2)
  priority         Int      @default(1)
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model Dividend {
  id             String    @id @default(uuid())
  assetId        String
  asset          Asset     @relation(fields: [assetId], references: [id])
  exDate         DateTime
  paymentDate    DateTime
  amountPerShare Decimal   @db.Decimal(18, 4)
  quantity       Decimal   @db.Decimal(18, 6)
  totalAmount    Decimal   @db.Decimal(18, 4)
  currency       String    @default("USD")
  createdAt      DateTime  @default(now())
}

model NewsArticle {
  id                        String       @id @default(uuid())
  title                     String
  summary                   String
  analysis                  String?
  isInterpretationConfirmed Boolean      @default(false)
  source                    String
  url                       String
  publishedAt               DateTime
  collectedAt               DateTime     @default(now())
  imageUrl                  String?
  category                  NewsCategory @default(MARKET_OVERVIEW)
  isBreaking                Boolean      @default(false)
  status                    String       @default("ACTIVE")

  assets                    NewsAsset[]
}

model NewsAsset {
  newsId      String
  assetId     String
  relevance   Int          @default(1) // 1-5
  relation    String?      // ex: "DIRECT", "SECTOR", "COMPETITOR"

  news        NewsArticle  @relation(fields: [newsId], references: [id], onDelete: Cascade)
  asset       Asset        @relation(fields: [assetId], references: [id], onDelete: Cascade)

  @@id([newsId, assetId])
}

model Opportunity {
  id           String    @id @default(uuid())
  ticker       String
  assetId      String?
  asset        Asset?    @relation(fields: [assetId], references: [id])
  thesis       String
  sector       String
  score        Decimal?  @db.Decimal(5, 2)
  risks        String[]
  catalysts    String[]
  radarStyle   String    @default("GROWTH_WITH_FUNDAMENTALS")
  reviewDate   DateTime  @default(now())
  status       String    @default("ACTIVE")
}

model Goal {
  id           String    @id @default(uuid())
  name         String
  targetValue  Decimal   @db.Decimal(18, 2)
  currentValue Decimal   @db.Decimal(18, 2)
  currency     String    @default("BRL")
  deadlineYears Int
  notes        String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```
