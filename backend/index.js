require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const { getMarketQuotes } = require("./services/marketDataService");
const { getAuthenticatedUser } = require("./util/auth");
const { enrichHoldingWithQuote } = require("./services/holdingsService");
const {
  normalizeSymbol,
  rebuildHoldingsFromOrders,
} = require("./services/orderService");

const { HoldingsModel } = require("./Models/HoldingsModel");
const { PositionsModel } = require("./Models/PositionsModel");
const { OrdersModel } = require("./Models/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();
const defaultClientOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://zerodha-clone-frontend.netlify.app",
  "https://zerodha-dashboardclone.netlify.app",
];
const configuredClientOrigins = (process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(
  new Set([...defaultClientOrigins, ...configuredClientOrigins])
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", authRoute);

// app.get("/addHoldings", async (req, res) => {
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.day,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Done!");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });
//   res.send("Done!");
// });

const mergeDuplicateHoldings = (holdings) => {
  const mergedByName = {};

  holdings.forEach((holding) => {
    const data = holding.toObject ? holding.toObject() : holding;

    if (!mergedByName[data.name]) {
      mergedByName[data.name] = { ...data };
      return;
    }

    const existing = mergedByName[data.name];
    const totalQty = existing.qty + data.qty;
    existing.avg =
      totalQty > 0
        ? (existing.avg * existing.qty + data.avg * data.qty) / totalQty
        : existing.avg;
    existing.qty = totalQty;
  });

  return Object.values(mergedByName);
};

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});

  if (allHoldings.length > 0) {
    const mergedHoldings = mergeDuplicateHoldings(allHoldings);

    if (mergedHoldings.length !== allHoldings.length) {
      await HoldingsModel.deleteMany({});
      await HoldingsModel.insertMany(mergedHoldings);
      allHoldings = await HoldingsModel.find({});
    }
  }
  const fallbackRecords = Object.fromEntries(
    allHoldings.map((holding) => [holding.name, holding.toObject()])
  );
  const quotes = await getMarketQuotes(
    allHoldings.map((holding) => holding.name),
    fallbackRecords
  );
  const quoteBySymbol = Object.fromEntries(
    quotes.map((quote) => [quote.symbol, quote])
  );

  const holdingsWithLivePrices = allHoldings.map((holding) => {
    const quote = quoteBySymbol[holding.name];
    return enrichHoldingWithQuote(holding, quote);
  });

  res.json(holdingsWithLivePrices);
});

app.get("/allOrders", async (req, res) => {
  const allOrders = await OrdersModel.find({}).sort({ createdAt: -1 });
  res.json(allOrders);
});

app.get("/market/quotes", async (req, res) => {
  const symbols = String(req.query.symbols || "")
    .split(",")
    .map((symbol) => symbol.trim())
    .filter(Boolean);

  const quotes = await getMarketQuotes(symbols);
  res.json({ quotes });
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/syncHoldings", async (req, res) => {
  try {
    await rebuildHoldingsFromOrders(HoldingsModel, OrdersModel);
    const holdings = await HoldingsModel.find({});
    res.json({ message: "Holdings synced from orders", count: holdings.length });
  } catch (error) {
    console.error("Holdings sync failed:", error.message);
    res.status(500).json({ error: "Failed to sync holdings" });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    const { mode } = req.body;
    const name = normalizeSymbol(req.body.name);
    const qty = Number(req.body.qty);
    const price = Number(req.body.price);

    if (!name || !mode || !Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ error: "Invalid order details" });
    }

    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ error: "Price must be greater than zero" });
    }

    const normalizedMode = String(mode).toUpperCase();

    if (!["BUY", "SELL"].includes(normalizedMode)) {
      return res.status(400).json({ error: "Order mode must be BUY or SELL" });
    }

    const orderValue = qty * price;

    if (normalizedMode === "BUY" && (Number(user.margin) || 0) < orderValue) {
      return res.status(400).json({ error: "Insufficient account balance" });
    }

    if (normalizedMode === "SELL") {
      await rebuildHoldingsFromOrders(HoldingsModel, OrdersModel);
      const holding = await HoldingsModel.findOne({ name });

      if (!holding || holding.qty < qty) {
        return res.status(400).json({ error: "Insufficient quantity to sell" });
      }
    }

    const newOrder = await OrdersModel.create({
      name,
      qty,
      price,
      mode: normalizedMode,
      userId: user._id,
    });

    user.margin =
      normalizedMode === "BUY"
        ? (Number(user.margin) || 0) - orderValue
        : (Number(user.margin) || 0) + orderValue;
    await user.save();

    await rebuildHoldingsFromOrders(HoldingsModel, OrdersModel);

    res.json({ message: "Order saved!", order: newOrder, margin: user.margin });
  } catch (error) {
    console.error("Order placement failed:", error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Failed to place order" });
  }
});

const startServer = async () => {
  try {
    if (!uri) {
      throw new Error("MONGO_URL is not set in .env");
    }

    if (!process.env.TOKEN_KEY) {
      throw new Error("TOKEN_KEY is not set in .env");
    }

    await mongoose.connect(uri);
    console.log("DB connected!");

    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}!`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
