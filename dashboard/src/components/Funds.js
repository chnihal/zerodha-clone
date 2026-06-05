import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const Funds = () => {
  const [margin, setMargin] = useState(null);
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchMe = async () => {
    try {
      const resp = await api.get("/me");
      if (resp.data && resp.data.user) setMargin(resp.data.user.margin || 0);
    } catch (err) {
      // ignore for now
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleDeposit = async () => {
    setMessage("");
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setMessage("Enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const resp = await api.post("/deposit", { amount: amt });
      if (resp.data && resp.data.success) {
        setMargin(resp.data.margin);
        setMessage("Deposit successful");
      } else {
        setMessage(resp.data?.message || "Deposit failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI </p>
        <button className="btn btn-green" onClick={handleDeposit} disabled={loading}>
          {loading ? "Processing..." : "Add funds"}
        </button>
        <Link className="btn btn-blue">Withdraw</Link>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Amount to add</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginLeft: 8 }}
        />
        {message && <div style={{ marginTop: 8 }}>{message}</div>}
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">{margin !== null ? margin : "-"}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">0.00</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">{margin !== null ? margin : "-"}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>{margin !== null ? margin : "-"}</p>
            </div>
            <div className="data">
              <p>Opening Balance</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <Link className="btn btn-blue">Open Account</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
