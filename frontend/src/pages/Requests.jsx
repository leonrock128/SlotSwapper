import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

export default function Requests() {
  const { swaps, fetchMySwaps, respondToSwap } = useContext(AppContext);

  useEffect(() => {
    fetchMySwaps();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Swap Requests</h2>

      {/* ---------- Incoming Requests ---------- */}
      <section className="mb-6">
        <h3 className="text-lg font-medium mb-2">Incoming</h3>

        {swaps.incoming.length === 0 && (
          <p className="text-gray-500">No incoming requests</p>
        )}

        <div className="space-y-4">
          {swaps.incoming.map((s) => {
            const isPending = s.status === "PENDING";

            return (
              <div
                key={s._id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div>
                  <p className="font-medium">
                    From:{" "}
                    <span className="font-normal">
                      {s.requester?.name || "Unknown"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Their event: {s.requesterEvent?.title || "—"}
                  </p>
                  <p className="text-sm text-gray-700">
                    Your event: {s.responderEvent?.title || "—"}
                  </p>
                  <p
                    className={`text-xs mt-1 font-medium ${
                      s.status === "ACCEPTED"
                        ? "text-green-600"
                        : s.status === "REJECTED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {s.status}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    disabled={!isPending}
                    onClick={() => respondToSwap(s._id, true)}
                    className={`px-3 py-1.5 rounded-md text-white font-medium transition ${
                      isPending
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Accept
                  </button>

                  <button
                    disabled={!isPending}
                    onClick={() => respondToSwap(s._id, false)}
                    className={`px-3 py-1.5 rounded-md text-white font-medium transition ${
                      isPending
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Outgoing Requests ---------- */}
      <section>
        <h3 className="text-lg font-medium mb-2">Outgoing</h3>

        {swaps.outgoing.length === 0 && (
          <p className="text-gray-500">No outgoing requests</p>
        )}

        <div className="space-y-4">
          {swaps.outgoing.map((s) => (
            <div
              key={s._id}
              className="p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <p className="font-medium">
                To:{" "}
                <span className="font-normal">
                  {s.responder?.name || "Unknown"}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Offered: {s.requesterEvent?.title || "—"} →{" "}
                {s.responderEvent?.title || "—"}
              </p>
              <p
                className={`text-xs mt-1 font-medium ${
                  s.status === "ACCEPTED"
                    ? "text-green-600"
                    : s.status === "REJECTED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                Status: {s.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
