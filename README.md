# CNAB File upload web application

![home page](assets/home.png)

A Next.js application for parsing and processing CNAB (Centro Nacional de Automação Bancária) files.

## 🚀 Features

- File upload and processing
- CNAB format validation
- Transaction data visualization
- MySQL database integration
- Docker support
- Automated testing
- Modern UI with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: Next.js 15.3.0, React 19
- **Backend**: Next.js API Routes
- **Database**: MySQL (via Prisma 6.6.0)
- **Testing**: Jest + React Testing Library
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Container**: Docker
- **Type Safety**: TypeScript
- **Form Validation**: Zod

## 📋 Prerequisites

- Node.js (Latest LTS version)
- Docker and Docker Compose
- MySQL (if running without Docker)

## 🚀 Getting Started

1. **Install dependencies**
```bash
npm install
```

2. **Start MySQL database (using Docker)**
```bash
npm run mysql
```

3. **Start the development server**
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🧪 Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

# CNAB documentation

| Descrição do campo | Inicio | Fim | Tamanho | Comentário                                                                                                                |
| ------------------ | ------ | --- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| Tipo               | 1      | 1   | 1       | Tipo da transação                                                                                                         |
| Data               | 2      | 9   | 8       | Data da ocorrência                                                                                                        |
| Valor              | 10     | 19  | 10      | Valor da movimentação. *Obs.* O valor encontrado no arquivo precisa ser divido por cem(valor / 100.00) para normalizá-lo. |
| CPF                | 20     | 30  | 11      | CPF do beneficiário                                                                                                       |
| Cartão             | 31     | 42  | 12      | Cartão utilizado na transação                                                                                             |
| Hora               | 43     | 48  | 6       | Hora da ocorrência atendendo ao fuso de UTC-3                                                                             |
| Dono da loja       | 49     | 62  | 14      | Nome do representante da loja                                                                                             |
| Nome loja          | 63     | 81  | 19      | Nome da loja                                                                                                              |

## Transaction type documentation

| Tipo | Descrição              | Natureza | Sinal |
| ---- | ---------------------- | -------- | ----- |
| 1    | Débito                 | Entrada  | +     |
| 2    | Boleto                 | Saída    | -     |
| 3    | Financiamento          | Saída    | -     |
| 4    | Crédito                | Entrada  | +     |
| 5    | Recebimento Empréstimo | Entrada  | +     |
| 6    | Vendas                 | Entrada  | +     |
| 7    | Recebimento TED        | Entrada  | +     |
| 8    | Recebimento DOC        | Entrada  | +     |
| 9    | Aluguel                | Saída    | -     |@

## 🐳 Docker Support

The project includes Docker configuration for easy deployment. To run the entire application using Docker:

```bash
docker-compose up -d
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run mysql` - Start MySQL container
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
```

# Transactions API Route Documentation

This API endpoint handles the creation of transaction records in the database.

## Endpoint

```
POST /api/transactions
```

## Request Body

The request must include a JSON object with the following structure:

```typescript
{
  transactions: [
    {
      cardNumber?: string,
      date: string,      // Format: DD/MM/YYYY
      document: string,  // Required
      hour: string,      // Format: HH:MM:SS
      name: string,      // Required
      owner: string,     // Required
      type: string,      // Required
      value: number      // Required
    }
  ]
}
```

## Validation Rules

- `cardNumber`: Optional string
- `date`: Must match format DD/MM/YYYY
- `document`: Non-empty string
- `hour`: Must match format HH:MM:SS
- `name`: Non-empty string
- `owner`: Non-empty string
- `type`: Non-empty string
- `value`: Number

## Responses

### Success (200)
```json
{
  "success": true,
  "processedCount": number
}
```

### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": {
    // Validation error details
  }
}
```

### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

## Example Usage

```typescript
const response = await fetch('/api/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    transactions: [{
      cardNumber: "6777****1313",
      date: "01/03/2019",
      document: "84515254073",
      hour: "17:27:12",
      name: "MERCADO DA AVENIDA",
      owner: "MARCOS PEREIRA",
      type: "3",
      value: 192
    }]
  })
});
```

# Database Documentation

## Database Schema

The application uses MySQL as the database with Prisma as the ORM. Below is the database structure:

### Transaction Table Diagram

```mermaid
erDiagram
    Transaction {
        int id PK
        string date
        float value
        string document
        string cardNumber
        string hour
        string name
        string owner
        string type
    }
```

## Field Descriptions

| Field      | Type   | Description                     | Constraints                 |
| ---------- | ------ | ------------------------------- | --------------------------- |
| id         | Int    | Unique identifier               | Primary Key, Auto-increment |
| date       | String | Transaction date (DD/MM/YYYY)   | Required                    |
| value      | Float  | Transaction amount              | Required                    |
| document   | String | Document number (CPF)           | Required                    |
| cardNumber | String | Card number used in transaction | Required                    |
| hour       | String | Transaction time (HH:MM:SS)     | Required                    |
| name       | String | Store/Merchant name             | Required                    |
| owner      | String | Store owner name                | Required                    |
| type       | String | Transaction type                | Required                    |

## Database Configuration

The database connection is configured using environment variables. Here's the Prisma schema configuration:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma db reset

# Open Prisma Studio
npx prisma studio
```

## Prisma studio

![](assets/studio.png)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.