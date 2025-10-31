import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Marketplace() {
  const { marketplace, fetchMarketplace, requestSwap, events, user } =
    useContext(AppContext);
  const [selectedTheir, setSelectedTheir] = useState(null);
  const [selectedMyId, setSelectedMyId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const mySwappables = events.filter((e) => e.status === "SWAPPABLE");

  const submitRequest = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedMyId) return alert("Please choose one of your swappable events");

    try {
      await requestSwap(selectedMyId, selectedTheir._id);
      setSelectedTheir(null);
      setSelectedMyId("");
      alert(" Swap request sent!");
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const handleRequestClick = (ev) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedTheir(ev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center md:text-left">
          Marketplace — Available Swappable Slots
        </h2>

        {/* Marketplace List */}
        {marketplace.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No swappable events available.</p>
            <p className="text-gray-400 text-sm">Check back later!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {marketplace.map((ev) => (
              <div
                key={ev._id}
                className="p-6 bg-white border border-gray-100 rounded-2xl shadow hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{ev.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(ev.startTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    By: <span className="font-medium">{ev.owner?.name}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleRequestClick(ev)}
                  className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Request Swap
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup Modal — blurred background */}
      <AnimatePresence>
        {selectedTheir && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-96 relative border border-gray-200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-1">
                Request Swap for:{" "}
                <span className="text-blue-700">{selectedTheir.title}</span>
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(selectedTheir.startTime).toLocaleString()}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choose your swappable event
                </label>
                <select
                  value={selectedMyId}
                  onChange={(e) => setSelectedMyId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Choose an event --</option>
                  {mySwappables.map((ms) => (
                    <option key={ms._id} value={ms._id}>
                      {ms.title} — {new Date(ms.startTime).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedTheir(null);
                    setSelectedMyId("");
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRequest}
                  disabled={!selectedMyId}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                    selectedMyId
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Send Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
