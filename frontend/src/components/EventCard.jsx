import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function EventCard({ ev, onChangeStatus }) {
  const { user } = useContext(AppContext);
  const nav = useNavigate();

  const handleChangeStatus = (status) => {
    if (!user) {
      alert('Please login to continue.');
      nav('/login');
      return;
    }
    onChangeStatus(ev._id, status);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center hover:shadow-lg transition-all duration-200 border border-gray-100">
      <div>
        <div className="font-semibold text-gray-800 text-lg">{ev.title}</div>
        <div className="text-sm text-gray-500">
          {new Date(ev.startTime).toLocaleString()} — {new Date(ev.endTime).toLocaleString()}
        </div>
        <div className="text-xs text-gray-600 mt-2">
          Status: <span className="font-medium">{ev.status}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {ev.status === 'BUSY' && (
          <button
            onClick={() => handleChangeStatus('SWAPPABLE')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Make Swappable
          </button>
        )}
        {ev.status === 'SWAPPABLE' && (
          <button
            onClick={() => handleChangeStatus('BUSY')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
          >
            Cancel Swap
          </button>
        )}
        {ev.status === 'SWAP_PENDING' && (
          <div className="italic text-gray-500 text-sm">Pending</div>
        )}
      </div>
    </div>
  );
}
