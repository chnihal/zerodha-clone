import { useState, useEffect, useContext, useCallback } from "react";
import api from "../api/client";
import GeneralContext from "../components/GeneralContext";
import { computeHoldingsSummary } from "../utils/holdingsSummary";

const REFRESH_INTERVAL_MS = 60 * 1000;

export const useHoldingsData = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { orderRefreshToken } = useContext(GeneralContext);

  const loadHoldings = useCallback(() => {
    return api
      .get("/allHoldings")
      .then((res) => {
        setHoldings(res.data);
      })
      .catch((error) => {
        console.error("Failed to load holdings:", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const refreshHoldings = async () => {
      if (orderRefreshToken === 0) {
        try {
          await api.post("/syncHoldings");
        } catch (error) {
          console.error("Failed to sync holdings from orders:", error.message);
        }
      }

      if (!cancelled) {
        await loadHoldings();
      }
    };

    refreshHoldings();
    const intervalId = setInterval(loadHoldings, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [loadHoldings, orderRefreshToken]);

  const summary = computeHoldingsSummary(holdings);

  return { holdings, loading, summary, reloadHoldings: loadHoldings };
};
