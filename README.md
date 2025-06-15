# Verdicto

**Verdicto** — це децентралізована платформа для вирішення спорів, що складається з трьох основних частин:
- 🧾 `contract/` — смартконтракт `DisputeResolution` на Solidity
- 🧠 `backend/` — API, побудоване на NestJS
- 💻 `client/` — інтерфейс користувача на React (Next.js)

---

## 🔧 Вимоги

- Node.js (>=18.x)
- Yarn або npm
- Hardhat (для Solidity)
- Docker (опційно для БД)
- MetaMask або інший Ethereum-провайдер для тестування смартконтрактів

---

## 📄 contract — DisputeResolution смартконтракт

### Встановлення

```bash
cd contracts
yarn install
```

### Встановлення
```bash
npx hardhat compile
```

### Тести

```bash
npx hardhat test
```

### Деплой на тестову мережу Sepolia

```bash
npx hardhat ignition deploy ./ignition/modules/DisputeResolution.ts --network sepolia --verify
```

## 📄 backend — NestJS API

### Встановлення
```bash
cd backend && yarn install
```

### Налаштування .env

```bash
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_PORT=
CONTRACT_ADDRESS=
INFURA_API_KEY=
```

### Запуск

```bash
yarn start:dev
```

### 💻 client — Next.js інтерфейс

## Встановлення

```bash
cd client
yarn install
```

## Налаштування
.env
```bash
NEXT_PUBLIC_IMGBB_API_KEY=
NEXT_PUBLIC_PINATA_JWT=
```

## Запуск
```bash
yarn dev
``` 