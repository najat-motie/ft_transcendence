import { apiRequest } from "../../services/api";

export default function OutgoingRequests({ outgoingRequests, setOutgoingRequests }) {
  const cancelOutgoingRequest = async (requestId) => {
    try {
      await apiRequest(`/requests/cancel/${requestId}`, { method: "POST" });
      setOutgoingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="card social-card social-card-outgoing">
      <div className="social-card-head">
        <div>
          <span className="social-eyebrow">Awaiting Reply</span>
          <h2>Outgoing Requests</h2>
        </div>
        <span className="social-count">{outgoingRequests.length}</span>
      </div>
      {outgoingRequests.length === 0 && <p className="no-requests">No pending requests</p>}
      <ul className="requests-list">
        {outgoingRequests.map((req) => (
          <li key={req.id} className="request-card">
            <div className="request-copy">
              <span className="request-username">{req.username}</span>
              <span className="request-caption">Invitation sent</span>
            </div>
            <div className="request-actions">
              <button className="pending-btn" disabled>Pending</button>
              <button className="cancel-btn" onClick={() => cancelOutgoingRequest(req.id)}>Cancel</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
