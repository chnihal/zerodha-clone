import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

export const useUserData = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = useCallback(() => {
    setError("");

    return api
      .get("/me")
      .then((res) => {
        setUser(res.data.user || null);
      })
      .catch((err) => {
        setUser(null);
        setError(err.response?.data?.message || err.message || "Failed to load user");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return { user, loading, error, reloadUser: loadUser };
};
