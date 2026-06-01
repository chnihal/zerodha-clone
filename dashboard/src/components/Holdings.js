import React from "react";
import { VerticalGraph } from "./VerticalGraph";
import { useHoldingsData } from "../hooks/useHoldingsData";

const formatAmountParts = (value) => {
  const [whole, decimal = "00"] = Number(value).toFixed(2).split(".");
  return {
    whole: Number(whole).toLocaleString("en-IN"),
    decimal: decimal.padEnd(2, "0").slice(0, 2),
  };
};

const Holdings = () => {
  const { holdings: allHoldings, loading, summary } = useHoldingsData();

  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const investmentParts = formatAmountParts(summary.totalInvestment);
  const currentValueParts = formatAmountParts(summary.currentValue);

  return (
    <>
      <h3 className="title">Holdings ({summary.count})</h3>

      {loading && allHoldings.length === 0 ? (
        <p>Loading holdings...</p>
      ) : (
        <div className="order-table">
          <table>
            <tbody>
              <tr>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Avg. cost</th>
                <th>LTP</th>
                <th>Cur. val</th>
                <th>P&L</th>
                <th>Net chg.</th>
                <th>Day chg.</th>
              </tr>

              {allHoldings.map((stock) => {
                const curValue = stock.price * stock.qty;
                const pnl = curValue - stock.avg * stock.qty;
                const isProfit = pnl >= 0;
                const profClass = isProfit ? "profit" : "loss";
                const dayClass = stock.isLoss ? "loss" : "profit";

                return (
                  <tr key={stock.name}>
                    <td>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>{stock.avg.toFixed(2)}</td>
                    <td>{stock.price.toFixed(2)}</td>
                    <td>{curValue.toFixed(2)}</td>
                    <td className={profClass}>{pnl.toFixed(2)}</td>
                    <td className={profClass}>{stock.net}</td>
                    <td className={dayClass}>{stock.day}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="row">
        <div className="col">
          <h5>
            {investmentParts.whole}.<span>{investmentParts.decimal}</span>
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            {currentValueParts.whole}.<span>{currentValueParts.decimal}</span>
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={summary.totalPnl >= 0 ? "profit" : "loss"}>
            {summary.totalPnl.toFixed(2)} ({summary.totalPnl >= 0 ? "+" : ""}
            {summary.totalPnlPercent.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
