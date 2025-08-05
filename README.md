# 💰 Digital Wallet API

## Project Overview

The **Digital Wallet API** is a secure, modular, and role-based backend system for a digital wallet service similar to **Bkash** or **Nagad**. Built with **Express.js**, **TypeScript**, and **Mongoose**, this API allows users to register, manage wallets, and perform core financial operations including deposits, withdrawals, transfers, and transaction history with robust security measures.

---

## Key Features

### Authentication & Authorization
- JWT-based authentication
- Three user roles: **user**, **agent**, **admin**
- Secure password hashing using **bcrypt**
- Role-based route protection with middleware

### Wallet Management
- Automatic wallet creation on registration
- Initial balance of **৳50**
- Admin can block/unblock wallets
- Balance inquiry & transaction history for all roles

### Financial Operations
- **Users** can add (top-up) money
- **Users** can withdraw money
- **Users** can send money to other users
- **Agents** can cash-in to user wallets
- **Agents** can cash-out from user wallets
- **Admins** can see all transactions

### Admin Features
- View all users, agents, wallets, and transactions
- Block or unblock user wallets
- Approve or suspend agents



---

## Tech Stack

### Core
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose

### Security
- JWT for authentication
- bcryptjs for password hashing
- Zod for validation
- cookie-parser for handling cookies

### Utilities
- dotenv for environment configuration
- cors for cross-origin requests
- morgan for logging
- Postman for testing

---

## API Endpoints

### Authentication

| Endpoint                | Method | Description                | Access  |
|------------------------|--------|----------------------------|---------|
| `/api/v1/auth/register`| POST   | Register new user/agent    | Public  |
| `/api/v1/auth/login`   | POST   | Login user/agent/admin     | Public  |

### Wallet Operations

| Endpoint                      | Method | Description                          | Access     |
|------------------------------|--------|--------------------------------------|------------|
| `/api/v1/wallet/add-money`   | POST   | Add money to own wallet              | User       |
| `/api/v1/wallet/withdraw`    | POST   | Withdraw money from own wallet       | User       |
| `/api/v1/wallet/send-money`  | POST   | Send money to another user           | User       |
| `/api/v1/wallet/cash-in`     | POST   | Agent adds money to user's wallet    | Agent      |
| `/api/v1/wallet/cash-out`    | POST   | Agent withdraws from user's wallet   | Agent      |
| `/api/v1/wallet/me`          | GET    | Get wallet details                   | User/Agent |

### Transactions

| Endpoint                       | Method | Description                   | Access     |
|--------------------------------|--------|-------------------------------|------------|
| `/api/v1/transactions/me`      | GET    | Get own transaction history   | User/Agent |
| `/api/v1/transactions/all`     | GET    | Get all transactions          | Admin      |

### Admin Operations

| Endpoint                                      | Method | Description                            | Access |
|----------------------------------------------|--------|----------------------------------------|--------|
| `/api/v1/admin/users`                         | GET    | Get all users                          | Admin  |
| `/api/v1/admin/agents`                        | GET    | Get all agents                         | Admin  |
| `/api/v1/admin/wallets`                       | GET    | Get all wallets                        | Admin  |
| `/api/v1/admin/wallets/:id/block`             | PATCH  | Block/unblock a wallet(Toggle)                 | Admin  |
| `/api/v1/admin/agents/:id/approve`            | PATCH  | Approve/suspend an agent(Toggle)                | Admin  |

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### Installation

```bash
git clone https://github.com/mdmasharafilhossain/Digital-Wallet-System-API.git
cd digital-wallet-api
npm install
```

Create a .env file using the template and edit .env:
```bash
DB_URL=your_mongoDB_url
NODE_ENV=development
BCRYPT_SALT_ROUND=any_number
JWT_ACCESS_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES=time
PORT=5000

# do not chnage admin phone and password, just login 
ADMIN_PHONE=01345678901
ADMIN_PASSWORD=admin1234
```

Run the Project
```bash
npm run dev
```
