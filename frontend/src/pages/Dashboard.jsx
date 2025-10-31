import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import EventCard from "../components/EventCard";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { events, fetchMyEvents, createEvent, updateEventStatus, user } =
    useContext(AppContext);
  const [form, setForm] = useState({ title: "", startTime: "", endTime: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    //  Redirect to login if not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    if (!form.title || !form.startTime || !form.endTime)
      return alert("Please fill in all fields.");

    await createEvent(form);
    setForm({ title: "", startTime: "", endTime: "" });
  };

  //  Wrapper for event status change (Make Swappable / Cancel)
  const handleChangeStatus = (id, status) => {
    if (!user) {
      navigate("/login");
      return;
    }
    updateEventStatus(id, status);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-50 py-24 px-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10 -mt-10 text-center md:text-left">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Hello, {user?.name || "Guest"} 
        </h2>
        <p className="text-gray-600">
          Manage your events and swappable slots easily.
        </p>
      </div>

      {/* Create Event Form */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-10">
        <form
          onSubmit={submit}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <input
            type="text"
            placeholder="Event Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="datetime-local"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg shadow transition"
          >
            <PlusCircle size={18} /> Create
          </button>
        </form>
      </div>

      {/* Event List */}
      <div className="max-w-5xl mx-auto">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No events yet.</p>
            <p className="text-gray-400 text-sm">
              Create your first event to get started.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="bg-white rounded-xl shadow hover:shadow-md transition p-5 border border-gray-100 hover:border-indigo-200"
              >
                <EventCard ev={ev} onChangeStatus={handleChangeStatus} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
