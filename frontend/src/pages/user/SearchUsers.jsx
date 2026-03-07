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
      const users = await apiRequest(`/users/search?q=${searchInput}`, { method: "GET" });
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
      await apiRequest(`/requests/send/${userId}`, { method: "POST" });
      setOutgoingRequests((prev) => [...prev, { id: userId, username }]);
      setSearchResults((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Search Users</h2>
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
                <span>{user.username}</span>
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
