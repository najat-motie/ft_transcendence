import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { slabHeading } from "../../lib/ui";
import { cn } from "../../lib/cn";
import {
  acceptButtonClass,
  emptyStateClass,
  listClass,
  requestActionsClass,
  requestCopyClass,
  socialCardClass,
  socialCardHeadClass,
  socialCountClass,
  socialEyebrowClass,
  socialItemClass,
  rejectButtonClass,
} from "./userUi";

export default function IncomingRequests({ incomingRequests, setIncomingRequests, fetchAllFriendsData }) {
  const acceptIncomingRequest = async (requestId) => {
    try {
      await apiRequest(`/requests/accept/${requestId}`, { method: "POST" });
      setIncomingRequests((prev) => prev.filter((request) => request.id !== requestId));
      fetchAllFriendsData();
    } catch {}
  };

  const rejectIncomingRequest = async (requestId) => {
    try {
      await apiRequest(`/requests/reject/${requestId}`, { method: "POST" });
      setIncomingRequests((prev) => prev.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={socialCardClass}>
      <div className={socialCardHeadClass}>
        <div>
          <span className={socialEyebrowClass}>Needs Review</span>
          <h2 className={cn(slabHeading, "mt-[0.45rem] text-[clamp(1.15rem,2vw,1.4rem)] text-slate-50")}>Incoming Requests</h2>
        </div>
        <span className={socialCountClass}>{incomingRequests.length}</span>
      </div>
      {incomingRequests.length === 0 ? <p className={emptyStateClass}>No pending requests</p> : null}
      <ul className={listClass}>
        {incomingRequests.map((request) => (
          <li key={request.id} className={socialItemClass}>
            <div className={requestCopyClass}>
              <span className="block text-[0.98rem] font-bold text-slate-50">{request.username}</span>
              <span className="block text-[0.82rem] text-slate-400">Wants to connect and play</span>
            </div>
            <div className={requestActionsClass}>
              <button className={acceptButtonClass} onClick={() => acceptIncomingRequest(request.id)}>Accept</button>
              <button className={rejectButtonClass} onClick={() => rejectIncomingRequest(request.id)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
