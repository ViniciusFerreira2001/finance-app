# Back-End Directive

## Objetivo
Manter e evoluir o back-end serverless do app de finanças pessoais usando **Firebase Cloud Functions + Firestore + Firebase Auth**.

---

## Arquitetura

```
backend/
├── firebase.json          # Configuração do Firebase
├── .firebaserc            # Alias do projeto
├── firestore.rules        # Regras de segurança do Firestore
├── firestore.indexes.json # Índices compostos do Firestore
└── functions/
    ├── index.js           # Entry point (Express app → Cloud Function)
    ├── package.json
    └── src/
        ├── middleware/auth.js         # Verificação do Firebase ID token
        ├── validators/transaction.js  # Validação de entrada
        └── handlers/
            ├── createTransaction.js   # POST /transactions
            ├── getTransactions.js     # GET  /transactions
            ├── getBalance.js          # GET  /transactions/balance
            ├── updateTransaction.js   # PATCH /transactions/:id
            └── deleteTransaction.js   # DELETE /transactions/:id
```

---

## Endpoints

| Método | Rota | Handler | Descrição |
|--------|------|---------|-----------|
| `POST` | `/transactions` | `createTransaction` | Cria nova transação |
| `GET` | `/transactions` | `getTransactions` | Lista transações (desc por data) |
| `GET` | `/transactions/balance` | `getBalance` | Calcula saldo atual |
| `PATCH` | `/transactions/:id` | `updateTransaction` | Edita amount/category/description |
| `DELETE` | `/transactions/:id` | `deleteTransaction` | Remove transação |

Todos os endpoints exigem header `Authorization: Bearer <Firebase ID Token>`.

---

## Modelo de Dados – Coleção `transactions`

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| `id` | string | auto | ID do documento Firestore |
| `type` | string | ✅ | `"income"` ou `"expense"` |
| `amount` | number | ✅ | Número positivo |
| `category` | string | ✅ | Texto livre |
| `description` | string | - | Opcional |
| `date` | timestamp | ✅ | Data da transação |
| `createdAt` | timestamp | auto | Server timestamp |
| `userId` | string | auto | UID do Firebase Auth |

**Saldo nunca é armazenado** — sempre calculado dinamicamente.

---

## Regras de Negócio

- Usuário só acessa suas próprias transações (`userId == req.user.uid`).
- `amount` deve ser número positivo.
- `type` deve ser exatamente `"income"` ou `"expense"`.
- `updateTransaction` só permite editar `amount`, `category` e `description`.
- Saldo = Σ `income` - Σ `expense` (calculado no `getBalance` handler).

---

## Variáveis de Ambiente

Nenhuma variável adicional é necessária além das credenciais padrão do Firebase Admin SDK. Para ambiente de produção, o SDK usa automaticamente as credenciais da Service Account vinculada ao projeto.

---

## Comandos de Desenvolvimento

```bash
# Instalar dependências
cd backend/functions && npm install

# Rodar localmente com emulador (recomendado)
cd backend && firebase emulators:start --only functions,firestore,auth

# Deploy para produção
cd backend && firebase deploy --only functions,firestore

# Ver logs das functions
firebase functions:log
```

O Emulator Suite sobe em:
- Functions: `http://localhost:5001`
- Firestore: `http://localhost:8080`
- Auth: `http://localhost:9099`
- UI: `http://localhost:4000`

---

## Configuração Inicial (Primeiro Deploy)

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Atualize `backend/.firebaserc` com seu Project ID real.
3. Instale o Firebase CLI: `npm install -g firebase-tools`
4. Autentique: `firebase login`
5. Ative Firestore, Authentication e Functions no console.
6. Instale as dependências: `cd backend/functions && npm install`
7. Deploy: `cd backend && firebase deploy`

---

## Região

Cloud Functions hospedadas em **`southamerica-east1` (São Paulo)** para menor latência no Brasil.

---

## Learnings (atualize conforme evolui o sistema)

- _Nenhum aprendizado ainda._
