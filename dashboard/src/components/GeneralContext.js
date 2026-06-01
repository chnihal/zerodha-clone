import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: () => {},
  closeBuyWindow: () => {},
  openSellWindow: () => {},
  closeSellWindow: () => {},
  notifyOrderPlaced: () => {},
  orderRefreshToken: 0,
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState({ name: "", price: 0 });
  const [orderRefreshToken, setOrderRefreshToken] = useState(0);

  const notifyOrderPlaced = () => {
    setOrderRefreshToken((token) => token + 1);
  };

  const handleOpenBuyWindow = (stock) => {
    setSelectedStock({
      name: stock.name,
      price: Number(stock.price) || 0,
    });
    setIsBuyWindowOpen(true);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStock({ name: "", price: 0 });
  };

  const handleOpenSellWindow = (stock) => {
    setSelectedStock({
      name: stock.name,
      price: Number(stock.price) || 0,
    });
    setIsSellWindowOpen(true);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedStock({ name: "", price: 0 });
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
        notifyOrderPlaced,
        orderRefreshToken,
      }}
    >
      {props.children}
      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedStock.name}
          defaultPrice={selectedStock.price}
        />
      )}
      {isSellWindowOpen && (
        <SellActionWindow
          uid={selectedStock.name}
          defaultPrice={selectedStock.price}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
