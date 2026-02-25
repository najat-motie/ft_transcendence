import { apiRequest } from "../../services/api";

export default function IncomingRequests({ incomingRequests, setIncomingRequests, fetchAllFriendsData }) {
  const acceptIncomingRequest = async (requestId) => {
    try {
      await apiRequest(`/requests/accept/${requestId}`, { method: "POST" });
      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
      fetchAllFriendsData();
    } catch (error) {
      console.error(error.message);
    }
  };

  const rejectIncomingRequest = async (requestId) => {
    try {
      await apiRequest(`/requests/reject/${requestId}`, { method: "POST" });
      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="card">
      <h2>Incoming Requests</h2>
      {incomingRequests.length === 0 && <p className="no-requests">No pending requests</p>}
      <ul className="requests-list">
        {incomingRequests.map((req) => (
          <li key={req.id} className="request-card">
            <span className="request-username">{req.username}</span>
            <div className="request-actions">
              <button className="accept-btn" onClick={() => acceptIncomingRequest(req.id)}>Accept</button>
              <button className="reject-btn" onClick={() => rejectIncomingRequest(req.id)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
