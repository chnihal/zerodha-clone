const https = require("https");

const CACHE_TTL_MS = 60 * 1000;
const TWELVE_DATA_BASE_URL = "https://api.twelvedata.com";

const providerSymbols = {
  BHARTIARTL: "BHARTIARTL:NSE",
  HDFCBANK: "HDFCBANK:NSE",
  HINDUNILVR: "HINDUNILVR:NSE",
  HUL: "HINDUNILVR:NSE",
  INFY: "INFY:NSE",
  ITC: "ITC:NSE",
  KPITTECH: "KPITTECH:NSE",
  "M&M": "M&M:NSE",
  ONGC: "ONGC:NSE",
  QUICKHEAL: "QUICKHEAL:NSE",
  RELIANCE: "RELIANCE:NSE",
  SBIN: "SBIN:NSE",
  TATAPOWER: "TATAPOWER:NSE",
  TCS: "TCS:NSE",
  WIPRO: "WIPRO:NSE",
  NIFTY50: "NSEI",
  SENSEX: "BSESN",
};

const fallbackQuotes = {
  INFY: { price: 1555.45, percent: "-1.60%", isDown: true },
  ONGC: { price: 116.8, percent: "-0.09%", isDown: true },
  TCS: { price: 3194.8, percent: "-0.25%", isDown: true },
  KPITTECH: { price: 266.45, percent: "3.54%", isDown: false },
  QUICKHEAL: { price: 308.55, percent: "-0.15%", isDown: true },
  WIPRO: { price: 577.75, percent: "0.32%", isDown: false },
  "M&M": { price: 779.8, percent: "-0.01%", isDown: true },
  RELIANCE: { price: 2112.4, percent: "1.44%", isDown: false },
  HUL: { price: 512.4, percent: "1.04%", isDown: false },
  NIFTY50: { price: 24500.5, percent: "-0.12%", isDown: true },
  SENSEX: { price: 80234.1, percent: "-0.08%", isDown: true },
};

const cache = new Map();

const normalizeSymbol = (symbol) => String(symbol || "").trim().toUpperCase();

const parseNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getJson = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(new Error("Market data provider returned invalid JSON"));
          }
        });
      })
      .on("error", reject);
  });

const buildFallbackQuote = (symbol, fallbackRecord) => {
  const normalized = normalizeSymbol(symbol);
  const fallback = fallbackQuotes[normalized] || fallbackRecord || {};
  const price = parseNumber(fallback.price) || 0;
  const percent = fallback.percent || fallback.day || "0.00%";
  const isDown =
    typeof fallback.isDown === "boolean"
      ? fallback.isDown
      : typeof fallback.isLoss === "boolean"
      ? fallback.isLoss
      : String(percent).startsWith("-");

  return {
    symbol: normalized,
    price,
    change: null,
    percent,
    isDown,
    source: "fallback",
    updatedAt: new Date().toISOString(),
  };
};

const normalizeProviderQuote = (symbol, quote) => {
  const normalized = normalizeSymbol(symbol);
  const price =
    parseNumber(quote.close) ||
    parseNumber(quote.price) ||
    parseNumber(quote.previous_close);
  const percentNumber = parseNumber(quote.percent_change);
  const change = parseNumber(quote.change);

  if (!price) {
    return null;
  }

  return {
    symbol: normalized,
    price,
    change,
    percent:
      percentNumber === null
        ? "0.00%"
        : `${percentNumber > 0 ? "+" : ""}${percentNumber.toFixed(2)}%`,
    isDown:
      change !== null ? change < 0 : percentNumber !== null && percentNumber < 0,
    source: "twelvedata",
    updatedAt: new Date().toISOString(),
  };
};

const readCachedQuote = (symbol) => {
  const cached = cache.get(symbol);

  if (!cached || Date.now() - cached.savedAt > CACHE_TTL_MS) {
    return null;
  }

  return cached.quote;
};

const saveCachedQuote = (quote) => {
  cache.set(quote.symbol, {
    quote,
    savedAt: Date.now(),
  });
};

const getMarketQuotes = async (symbols, fallbackRecords = {}) => {
  const normalizedSymbols = [...new Set(symbols.map(normalizeSymbol).filter(Boolean))];

  if (normalizedSymbols.length === 0) {
    return [];
  }

  const quotesBySymbol = {};
  const symbolsToFetch = [];

  normalizedSymbols.forEach((symbol) => {
    const cachedQuote = readCachedQuote(symbol);

    if (cachedQuote) {
      quotesBySymbol[symbol] = cachedQuote;
    } else {
      symbolsToFetch.push(symbol);
    }
  });

  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (apiKey && symbolsToFetch.length > 0) {
    const providerSymbolToAppSymbol = {};
    const providerSymbolsToFetch = symbolsToFetch.map((symbol) => {
      const providerSymbol = providerSymbols[symbol] || `${symbol}:NSE`;
      providerSymbolToAppSymbol[providerSymbol] = symbol;
      return providerSymbol;
    });

    const url = new URL("/quote", TWELVE_DATA_BASE_URL);
    url.searchParams.set("symbol", providerSymbolsToFetch.join(","));
    url.searchParams.set("apikey", apiKey);

    try {
      const providerResponse = await getJson(url);
      const responseEntries = providerSymbolsToFetch.length === 1
        ? [[providerSymbolsToFetch[0], providerResponse]]
        : Object.entries(providerResponse);

      responseEntries.forEach(([providerSymbol, quote]) => {
        if (!quote || quote.status === "error" || quote.code) {
          return;
        }

        const appSymbol = providerSymbolToAppSymbol[providerSymbol] || normalizeSymbol(quote.symbol);
        const normalizedQuote = normalizeProviderQuote(appSymbol, quote);

        if (normalizedQuote) {
          quotesBySymbol[appSymbol] = normalizedQuote;
          saveCachedQuote(normalizedQuote);
        }
      });
    } catch (error) {
      console.error("Market data fetch failed:", error.message);
    }
  }

  return normalizedSymbols.map((symbol) => {
    if (quotesBySymbol[symbol]) {
      return quotesBySymbol[symbol];
    }

    const fallbackQuote = buildFallbackQuote(symbol, fallbackRecords[symbol]);
    saveCachedQuote(fallbackQuote);
    return fallbackQuote;
  });
};

module.exports = { getMarketQuotes };
