import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import GeneralContext from "./GeneralContext";

const formatOrderTime = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { orderRefreshToken } = useContext(GeneralContext);

  const loadOrders = useCallback(() => {
    return api
      .get("/allOrders")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((error) => {
        console.error("Failed to load orders:", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders, orderRefreshToken]);

  if (loading) {
    return (
      <div className="orders">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven&apos;t placed any orders yet</p>
          <Link to="/" className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({orders.length})</h3>
      <div className="order-table">
        <table>
          <tbody>
            <tr>
              <th>Time</th>
              <th>Instrument</th>
              <th>Type</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Value</th>
            </tr>

            {orders.map((order) => {
              const isBuy = order.mode === "BUY";
              const modeClass = isBuy ? "profit" : "loss";
              const orderValue = Number(order.qty) * Number(order.price);

              return (
                <tr key={order._id}>
                  <td>{formatOrderTime(order.createdAt)}</td>
                  <td>{order.name}</td>
                  <td className={modeClass}>{order.mode}</td>
                  <td>{order.qty}</td>
                  <td>{Number(order.price).toFixed(2)}</td>
                  <td>{orderValue.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
