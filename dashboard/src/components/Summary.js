import React from "react";
import { useHoldingsData } from "../hooks/useHoldingsData";
import { formatCompactINR } from "../utils/holdingsSummary";

const Summary = () => {
  const { loading, summary } = useHoldingsData();
  const pnlClass = summary.totalPnl >= 0 ? "profit" : "loss";
  const pnlSign = summary.totalPnl >= 0 ? "+" : "";

  if (loading && summary.count === 0) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <>
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{formatCompactINR(summary.currentValue)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>
            </p>
            <p>
              Opening balance{" "}
              <span>{formatCompactINR(summary.totalInvestment)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({summary.count})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnlClass}>
              {formatCompactINR(summary.totalPnl)}{" "}
              <small>
                {pnlSign}
                {summary.totalPnlPercent.toFixed(2)}%
              </small>
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value{" "}
              <span>{formatCompactINR(summary.currentValue)}</span>
            </p>
            <p>
              Investment{" "}
              <span>{formatCompactINR(summary.totalInvestment)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
