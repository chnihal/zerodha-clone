import React, { useEffect, useState } from "react";
import api from "../api/client";
import Menu from "./Menu";

const INDEX_SYMBOLS = ["NIFTY50", "SENSEX"];
const REFRESH_INTERVAL_MS = 60 * 1000;

const defaultIndices = {
  NIFTY50: { label: "NIFTY 50", price: 0, percent: "0.00%", isDown: true },
  SENSEX: { label: "SENSEX", price: 0, percent: "0.00%", isDown: true },
};

const formatIndexPrice = (price) => {
  const value = Number(price);
  if (!Number.isFinite(value)) {
    return "-";
  }

  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const TopBar = () => {
  const [indices, setIndices] = useState(defaultIndices);

  useEffect(() => {
    const loadIndices = () => {
      api
        .get(
          `/market/quotes?symbols=${encodeURIComponent(INDEX_SYMBOLS.join(","))}`
        )
        .then((res) => {
          const quoteBySymbol = Object.fromEntries(
            (res.data.quotes || []).map((quote) => [quote.symbol, quote])
          );

          setIndices((current) => {
            const next = { ...current };

            INDEX_SYMBOLS.forEach((symbol) => {
              const quote = quoteBySymbol[symbol];
              if (!quote) {
                return;
              }

              next[symbol] = {
                ...next[symbol],
                price: quote.price,
                percent: quote.percent,
                isDown: quote.isDown,
              };
            });

            return next;
          });
        })
        .catch((error) => {
          console.error("Failed to load index quotes:", error.message);
        });
    };

    loadIndices();
    const intervalId = setInterval(loadIndices, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const renderIndex = (symbol, className) => {
    const index = indices[symbol];
    const directionClass = index.isDown ? "down" : "up";

    return (
      <div className={className}>
        <p className="index">{index.label}</p>
        <p className={`index-points ${directionClass}`}>
          {formatIndexPrice(index.price)}
        </p>
        <p className={`percent ${directionClass}`}>{index.percent}</p>
      </div>
    );
  };

  return (
    <div className="topbar-container">
      <div className="indices-container">
        {renderIndex("NIFTY50", "nifty")}
        {renderIndex("SENSEX", "sensex")}
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
