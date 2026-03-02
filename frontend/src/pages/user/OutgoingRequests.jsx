import { apiRequest } from "../../services/api";

export default function OutgoingRequests({
  outgoingRequests,
  setOutgoingRequests,
}) {
  const cancelOutgoingRequest = async (requestId) => {
    try {
      await apiRequest(`/requests/cancel/${requestId}`, { method: "POST" });
      setOutgoingRequests((prev) =>
        prev.filter((req) => req.id !== requestId)
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="card" role="region" aria-labelledby="outgoing-title">
      <h2 id="outgoing-title">Outgoing Requests</h2>

      {outgoingRequests.length === 0 && (
        <p className="no-requests">No pending requests</p>
      )}

      <ul className="requests-list">
        {outgoingRequests.map((req) => (
          <li key={req.id} className="request-card">
            <span className="request-username">{req.username}</span>

            <div className="request-actions">
              <button
                className="pending-btn"
                disabled
                aria-label={`Friend request to ${req.username} is pending`}
              >
                Pending
              </button>

              <button
                className="cancel-btn"
                onClick={() => cancelOutgoingRequest(req.id)}
                aria-label={`Cancel friend request to ${req.username}`}
              >
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
