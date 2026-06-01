import React, { useState, useContext, useEffect } from "react";

import api from "../api/client";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const SellActionWindow = ({ uid, defaultPrice = 0 }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(defaultPrice);
  const { closeSellWindow, notifyOrderPlaced } = useContext(GeneralContext);

  useEffect(() => {
    setStockPrice(defaultPrice);
    setStockQuantity(1);
  }, [uid, defaultPrice]);

  const handleSellClick = async () => {
    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    if (!Number.isFinite(qty) || qty <= 0) {
      window.alert("Enter a valid quantity");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      window.alert("Enter a valid price greater than zero");
      return;
    }

    try {
      await api.post("/newOrder", {
        name: uid,
        qty,
        price,
        mode: "SELL",
      });
      notifyOrderPlaced();
      closeSellWindow();
    } catch (error) {
      const message =
        error.response?.data?.error || "Failed to place sell order";
      window.alert(message);
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  return (
    <div className="container" id="sell-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(Number(stockPrice) * Number(stockQuantity)).toFixed(2)}</span>
        <div>
          <button type="button" className="btn btn-red" onClick={handleSellClick}>
            Sell
          </button>
          <button type="button" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
