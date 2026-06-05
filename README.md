# Zerodha Clone

A full-stack Zerodha-inspired trading platform built for learning and portfolio demonstrations. It includes a public marketing website, an authenticated trading dashboard, live market quotes, order placement, and portfolio management with holdings synchronized from trading activity.

## Live Demo

### Landing Page

https://zerodha-frontendclone.netlify.app

### Trading Dashboard

https://zerodha-dashboardclone.netlify.app

### Backend API

https://zerodha-backend-s52h.onrender.com

### GitHub Repository

https://github.com/chnihal/zerodha-clone

---

## Features

### Landing Website

* Home, Products, Pricing, and Support pages
* User Signup and Login
* Responsive design

### Trading Dashboard

* Watchlist management
* Holdings overview
* Positions tracking
* Orders history
* Funds management

### Market Data

* Live NIFTY 50 and SENSEX quotes
* Live stock prices using Twelve Data API
* Automatic fallback pricing when API data is unavailable

### Trading Operations

* Buy and Sell stocks
* Real-time portfolio updates
* Holdings rebuilt automatically from order history

### Authentication & Security

* JWT-based authentication
* Protected dashboard routes
* Secure password hashing with bcrypt

---

## Tech Stack

| Layer          | Technologies                        |
| -------------- | ----------------------------------- |
| Frontend       | React, React Router, Bootstrap      |
| Dashboard      | React, Material UI, Axios, Chart.js |
| Backend        | Node.js, Express.js                 |
| Database       | MongoDB Atlas, Mongoose             |
| Authentication | JWT, bcryptjs                       |
| Market Data    | Twelve Data API                     |
| Deployment     | Netlify, Render                     |

---

## Project Structure

```text
zerodha-clone/
├── frontend/      # Marketing website
├── dashboard/     # Trading dashboard
├── backend/       # REST API
└── package.json
```

---

## Prerequisites

* Node.js 18+
* MongoDB Atlas account
* Twelve Data API Key (optional)

---

## Installation

### Clone Repository

```bash
git clone https://github.com/chnihal/zerodha-clone.git
cd zerodha-clone
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Configure:

```env
MONGO_URL=your_mongodb_connection_string
TOKEN_KEY=your_jwt_secret
TWELVE_DATA_API_KEY=your_api_key
CLIENT_ORIGINS=http://localhost:3000,http://localhost:3001
```

Start backend:

```bash
npm run dev
```

Server runs on:

```text
http://localhost:3002
```

### Dashboard Setup

```bash
cd dashboard
npm install
npm start
```

Runs on:

```text
http://localhost:3001
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Runs on:

```text
http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| GET    | /allHoldings   | Fetch holdings       |
| GET    | /allOrders     | Fetch order history  |
| POST   | /newOrder      | Place BUY/SELL order |
| POST   | /syncHoldings  | Rebuild holdings     |
| GET    | /market/quotes | Fetch market quotes  |
| POST   | /signup        | Register user        |
| POST   | /login         | Authenticate user    |

---

## Usage Notes

* Buy and Sell orders update holdings automatically.
* Holdings are rebuilt from order history for consistency.
* If a Twelve Data API key is not provided, fallback prices are used.
* Dashboard access requires authentication.

---

## Future Enhancements

* Real-time WebSocket market feeds
* Portfolio performance analytics
* Advanced charting and indicators
* Watchlist persistence
* Trade history exports

---

## Screenshots

* Landing Page
* Login / Signup Page
* Dashboard
* Holdings View
* Orders View

---

## Author

**Nihal Chetlapelly**

GitHub: https://github.com/chnihal

---

## License

This project is created for educational and portfolio purposes only.

Zerodha and Kite are trademarks of their respective owners.
