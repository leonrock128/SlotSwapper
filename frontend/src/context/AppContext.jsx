import { createContext, useEffect, useState } from "react";
import { api, authHeader } from "../utils/api";
import axios from "axios";

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://slotswapper-backend-kdov.onrender.com";

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [events, setEvents] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [swaps, setSwaps] = useState({ incoming: [], outgoing: [] });

  //  Restore user when token exists
  useEffect(() => {
    if (token && !user) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/users/me", authHeader(token));
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      logout();
    }
  };

  const register = async (payload) => {
    const res = await api.post("/users/register", payload);
    const userData = res.data.user || {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
    };
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(res.data.token);
    setUser(userData);
  };

  const login = async (payload) => {
    const res = await api.post("/users/login", payload);
    const userData = res.data.user || {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
    };
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(res.data.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setEvents([]);
    setMarketplace([]);
    setSwaps({ incoming: [], outgoing: [] });
  };

  const fetchMyEvents = async () => {
    const res = await api.get("/events/me", authHeader(token));
    setEvents(res.data);
  };

  const createEvent = async (payload) => {
    const res = await api.post("/events", payload, authHeader(token));
    setEvents((prev) => [...prev, res.data]);
  };

  const updateEventStatus = async (eventId, status) => {
    const res = await api.put(
      `/events/${eventId}/status`,
      { status },
      authHeader(token)
    );
    setEvents((prev) => prev.map((e) => (e._id === eventId ? res.data : e)));
  };

  const fetchMarketplace = async () => {
    const res = await api.get("/events/swappable", authHeader(token));
    setMarketplace(res.data);
  };

  const requestSwap = async (myEventId, theirEventId) => {
    const res = await api.post(
      "/swaps/request",
      { myEventId, theirEventId },
      authHeader(token)
    );
    await fetchMyEvents();
    await fetchMarketplace();
    await fetchMySwaps();
    return res.data;
  };

  const respondToSwap = async (swapId, accept) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/swaps/${swapId}/respond`,
        { accept },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchMyEvents();
      await fetchMarketplace();
      await fetchMySwaps();
      return res.data;
    } catch (err) {
      console.error("Error responding to swap:", err);
    }
  };

  const fetchMySwaps = async () => {
    const res = await api.get("/swaps/me", authHeader(token));
    setSwaps(res.data);
  };

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        events,
        marketplace,
        swaps,
        register,
        login,
        logout,
        createEvent,
        updateEventStatus,
        fetchMarketplace,
        requestSwap,
        respondToSwap,
        fetchMyEvents,
        fetchMySwaps,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
