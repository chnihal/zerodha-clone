
A full-stack Zerodha Trading Platform built for learning and portfolio demos. It includes a marketing landing site, an authenticated trading dashboard, live market quotes, order placement, and holdings that stay in sync with your trades.

**Live repo:** [github.com/chnihal/zerodha-clone](https://github.com/chnihal/zerodha-clone)

## Features

- **Landing page** — Home, products, pricing, support, and signup flows
- **Trading dashboard** — Watchlist, holdings, positions, orders, and funds views
- **Live market data** — NIFTY 50, SENSEX, and stock LTP via Twelve Data (with sensible fallbacks)
- **Buy & sell** — Place orders from the watchlist; holdings rebuild from order history
- **Orders history** — All BUY/SELL actions stored in MongoDB and shown on the Orders page
- **Auth** — JWT-based signup, login, and session verification

## Tech stack

| Layer      | Technologies                                      |
| ---------- | ------------------------------------------------- |
| Frontend   | React, React Router, MUI, Chart.js              |
| Dashboard  | React, Axios, Chart.js                            |
| Backend    | Node.js, Express, MongoDB, Mongoose, JWT        |
| Market API | [Twelve Data](https://twelvedata.com/) (optional) |

## Project structure

```
zerodha-clone/
├── frontend/     # Public marketing site (port 3000)
├── dashboard/    # Trading dashboard UI (port 3001)
├── backend/      # REST API (port 3002)
└── package.json  # Shared root dependencies
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas (or local MongoDB)
- Twelve Data API key (optional, for live quotes)

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/chnihal/zerodha-clone.git
cd zerodha-clone
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
MONGO_URL=your_mongodb_****
TOKEN_KEY=your_***_secret
TWELVE_DATA_API_KEY=your_twelve_****_api_***
CLIENT_ORIGINS=http://localhost:****
```

Start the API:

```bash
npm run dev
# or: npm start
```

Server runs at **http://localhost:3002**

### 3. Dashboard setup

```bash
cd dashboard
npm install
cp .env.example .env
```

Start the dashboard:

```bash
npm start
```

Opens at **http://localhost:3001**

### 4. Landing page (optional)

```bash
cd frontend
npm install
npm start
```

Opens at **http://localhost:3000**

## API overview

| Method | Endpoint           | Description                          |
| ------ | ------------------ | ------------------------------------ |
| GET    | `/allHoldings`     | Holdings with live prices            |
| GET    | `/allOrders`       | Order history                        |
| POST   | `/newOrder`        | Place BUY/SELL order                 |
| POST   | `/syncHoldings`    | Rebuild holdings from orders         |
| GET    | `/market/quotes`   | Live quotes for symbols              |
| POST   | `/signup`          | Register user                        |
| POST   | `/login`           | Login                                |

## Usage notes

- When buying or selling, enter a **price greater than 0** (LTP is pre-filled from the watchlist).
- Holdings sync automatically on load and after each order.
- Without `TWELVE_DATA_API_KEY`, the app uses cached/fallback prices from the database.

## Author

**Nihal Chetlapelly** — [@chnihal](https://github.com/chnihal)

## License

This project is for educational purposes. Zerodha and Kite are trademarks of their respective owners.
