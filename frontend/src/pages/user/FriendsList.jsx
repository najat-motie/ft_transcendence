import { apiRequest } from "../../services/api";

export default function FriendsList({ friendList, setFriendList }) {
  const removeFriend = async (friendId) => {
    try {
      await apiRequest(`/friends/remove/${friendId}`, { method: "DELETE" });
      setFriendList((prev) => prev.filter((friend) => friend.id !== friendId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="card" role="region" aria-labelledby="friends-list-title">
      <h2 id="friends-list-title">Friends</h2>

      {friendList.length === 0 && (
        <p className="no-requests">No friends yet</p>
      )}

      <ul className="friends-list">
        {friendList.map((friend) => (
          <li key={friend.id} className="friend-item">
            <div className="friend-info">
              <span
                className={`status-dot ${
                  friend.isOnline ? "online" : "offline"
                }`}
                aria-label={
                  friend.isOnline
                    ? `${friend.username} is online`
                    : `${friend.username} is offline`
                }
              />
              <span className="friend-name">{friend.username}</span>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeFriend(friend.id)}
              aria-label={`Remove ${friend.username} from friends`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
