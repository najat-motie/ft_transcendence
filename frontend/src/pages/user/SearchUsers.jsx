import { useState } from "react";
import { apiRequest } from "../../services/api";
import { alertError, alertInfo, slabHeading } from "../../lib/ui";
import { cn } from "../../lib/cn";
import {
  emptyStateClass,
  listClass,
  primarySmallButtonClass,
  requestCopyClass,
  searchBarClass,
  searchInputClass,
  socialCardClass,
  socialCardHeadClass,
  socialEyebrowClass,
  socialItemClass,
} from "./userUi";

export default function SearchUsers({
  friendList,
  incomingRequests,
  outgoingRequests,
  setOutgoingRequests,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchUsers = async () => {
    if (!searchInput.trim()) return;
    setLoading(true);
    try {
      const response = await apiRequest(`/users/search?q=${searchInput}`, { method: "GET" });
      const users = response?.data?.users || response?.data || [];
      const filteredUsers = users.filter(
        (user) =>
          !friendList.find((friend) => friend.username === user.username) &&
          !incomingRequests.find((request) => request.username === user.username) &&
          !outgoingRequests.find((request) => request.username === user.username),
      );
      setSearchResults(filteredUsers);
      setHasSearched(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId, username) => {
    setLoading(true);
    try {
      const response = await apiRequest(`/requests/send/${userId}`, { method: "POST" });
      const newRequest = response?.data;
      setOutgoingRequests((prev) => [
        ...prev,
        {
          id: newRequest?.id || userId,
          userId,
          username,
        },
      ]);
      setSearchResults((prev) => prev.filter((user) => user.id !== userId));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={socialCardClass}>
      <div className={socialCardHeadClass}>
        <div>
          <span className={socialEyebrowClass}>Discover Players</span>
          <h2 className={cn(slabHeading, "mt-[0.45rem] text-[clamp(1.15rem,2vw,1.4rem)] text-slate-50")}>Search Users</h2>
        </div>
      </div>

      <div className={searchBarClass}>
        <input
          type="text"
          placeholder="Enter username..."
          value={searchInput}
          className={searchInputClass}
          onChange={(event) => {
            setSearchInput(event.target.value);
            setHasSearched(false);
          }}
        />
        <button onClick={handleSearchUsers} className={primarySmallButtonClass}>Search</button>
      </div>

      {searchResults.length > 0 ? (
        <ul className={listClass}>
          {searchResults.map((user) => (
            <li key={user.id} className={socialItemClass}>
              <div className={requestCopyClass}>
                <span className="block text-[0.98rem] font-bold text-slate-50">{user.username}</span>
                <span className="block text-[0.82rem] text-slate-400">Available to add</span>
              </div>
              <button onClick={() => sendFriendRequest(user.id, user.username)} className={primarySmallButtonClass}>
                Add Friend
              </button>
            </li>
          ))}
        </ul>
      ) : hasSearched ? (
        <p className={emptyStateClass}>No user found</p>
      ) : null}

      {loading ? <p className={alertInfo}>Loading...</p> : null}
      {error ? <p className={alertError}>{error}</p> : null}
    </div>
  );
}
