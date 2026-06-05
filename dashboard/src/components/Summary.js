import React from "react";
import { useHoldingsData } from "../hooks/useHoldingsData";
import { useUserData } from "../hooks/useUserData";
import { formatCompactINR } from "../utils/holdingsSummary";

const Summary = () => {
  const { loading, summary } = useHoldingsData();
  const { user } = useUserData();
  const pnlClass = summary.totalPnl >= 0 ? "profit" : "loss";
  const pnlSign = summary.totalPnl >= 0 ? "+" : "";
  const margin = Number(user?.margin) || 0;
  const username = user?.username || "User";

  if (loading && summary.count === 0) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <>
      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{formatCompactINR(margin)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>
            </p>
            <p>
              Opening balance{" "}
              <span>{formatCompactINR(margin)}</span>
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
