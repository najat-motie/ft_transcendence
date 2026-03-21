import { apiRequest } from "../../services/api";
import { slabHeading } from "../../lib/ui";
import { cn } from "../../lib/cn";
import {
  cancelButtonClass,
  emptyStateClass,
  listClass,
  pendingButtonClass,
  requestActionsClass,
  requestCopyClass,
  socialCardClass,
  socialCardHeadClass,
  socialCountClass,
  socialEyebrowClass,
  socialItemClass,
} from "./userUi";

export default function OutgoingRequests({ outgoingRequests, setOutgoingRequests }) {
  const cancelOutgoingRequest = async (requestId) => {
    try {
      await apiRequest(`/requests/cancel/${requestId}`, { method: "POST" });
      setOutgoingRequests((prev) => prev.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={socialCardClass}>
      <div className={socialCardHeadClass}>
        <div>
          <span className={socialEyebrowClass}>Awaiting Reply</span>
          <h2 className={cn(slabHeading, "mt-[0.45rem] text-[clamp(1.15rem,2vw,1.4rem)] text-slate-50")}>Outgoing Requests</h2>
        </div>
        <span className={socialCountClass}>{outgoingRequests.length}</span>
      </div>
      {outgoingRequests.length === 0 ? <p className={emptyStateClass}>No pending requests</p> : null}
      <ul className={listClass}>
        {outgoingRequests.map((request) => (
          <li key={request.id} className={socialItemClass}>
            <div className={requestCopyClass}>
              <span className="block text-[0.98rem] font-bold text-slate-50">{request.username}</span>
              <span className="block text-[0.82rem] text-slate-400">Invitation sent</span>
            </div>
            <div className={requestActionsClass}>
              <button className={pendingButtonClass} disabled>Pending</button>
              <button className={cancelButtonClass} onClick={() => cancelOutgoingRequest(request.id)}>Cancel</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
