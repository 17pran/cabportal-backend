import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AssignModal from '../components/AssignModal';
import { useAuthGuard } from '../hooks/useAuthGuard';

function VendorDashboard() {
  useAuthGuard('vendor');

  const [bookings, setBookings] = useState([]);
  const [assignModalData, setAssignModalData] = useState(null);
  const token = localStorage.getItem('token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err.response?.data || err.message);
    }
  }, [token, backendUrl]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${backendUrl}/api/bookings/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (err) {
      console.error('Failed to update status:', err.response?.data || err.message);
    }
  };

  const handleEnd = (id) => updateBookingStatus(id, 'Completed');
  const handleAccept = (booking) => setAssignModalData(booking);
  const handleReject = (id) => updateBookingStatus(id, 'Rejected');
  const handleOpenMarket = (id) => updateBookingStatus(id, 'OpenMarket');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Vendor Dashboard</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 transition hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                Booking ID: <span className="text-gray-700">{booking._id.slice(-6)}</span>
              </h3>

              <div className="text-sm text-gray-700 space-y-1 mb-3">
                <p><strong>Guest:</strong> {booking.guestName}</p>
                <p><strong>Company Email:</strong> {booking.email}</p>
                <p><strong>Trip Type:</strong> {booking.tripType}</p>
                <p><strong>Pickup:</strong> {booking.pickup}</p>
                <p><strong>Dropoff:</strong> {booking.dropoff}</p>
                <p><strong>Date & Time:</strong> {new Date(booking.datetime).toLocaleString()}</p>
                <p><strong>Status:</strong> 
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {booking.status}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {booking.status === 'Upcoming' && (
                  <>
                    <button
                      onClick={() => handleAccept(booking)}
                      className="bg-green-600 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-green-700"
                    >
                      Accept & Assign
                    </button>
                    <button
                      onClick={() => handleReject(booking._id)}
                      className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-red-600"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleOpenMarket(booking._id)}
                      className="bg-yellow-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-yellow-600"
                    >
                      Open Market
                    </button>
                  </>
                )}

                {booking.status === 'Ongoing' && (
                  <button
                    onClick={() => handleEnd(booking._id)}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-blue-700"
                  >
                    End Trip
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {assignModalData && (
        <AssignModal
          booking={assignModalData}
          onClose={() => setAssignModalData(null)}
          onAssign={(data) => {
            updateBookingStatus(assignModalData._id, 'Ongoing');
            alert(`Assigned Driver: ${data.driver}, Vehicle: ${data.vehicle}`);
            setAssignModalData(null);
          }}
        />
      )}
    </div>
  );
}

export default VendorDashboard;
