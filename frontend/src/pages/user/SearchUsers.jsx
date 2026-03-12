import { useState } from "react";
import { apiRequest } from "../../services/api";

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
          !friendList.find((f) => f.username === user.username) &&
          !incomingRequests.find((r) => r.username === user.username) &&
          !outgoingRequests.find((r) => r.username === user.username)
      );
      setSearchResults(filteredUsers);
      setHasSearched(true);
    } catch (error) {
      setError(error.message);
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
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card social-card social-card-search">
      <div className="social-card-head">
        <div>
          <span className="social-eyebrow">Discover Players</span>
          <h2>Search Users</h2>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter username..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setHasSearched(false);
          }}
        />
        <button onClick={handleSearchUsers}>Search</button>
      </div>

      {searchResults.length > 0 ? (
        <ul className="user-list">
          {searchResults.map((user) => (
            <li key={user.id} className="user-item">
              <div className="request-copy">
                <span className="request-username">{user.username}</span>
                <span className="request-caption">Available to add</span>
              </div>
              <button
                onClick={() => sendFriendRequest(user.id, user.username)}
              >
                Add Friend
              </button>
            </li>
          ))}
        </ul>
      ) : (
        hasSearched && <p className="no-requests">No user found</p>
      )}

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
