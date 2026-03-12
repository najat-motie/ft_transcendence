import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import defaultAvatar from "../../assets/default-avatar.svg";

export default function FriendsList({ friendList, setFriendList }) {
  const removeFriend = async (friendId) => {
    try {
      await apiRequest(`/friends/${friendId}`, { method: "DELETE" });
      setFriendList((prev) => prev.filter((f) => f.id !== friendId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="card social-card social-card-friends">
      <div className="social-card-head">
        <div>
          <span className="social-eyebrow">Active Friends</span>
          <h2>Friends List</h2>
        </div>
        <span className="social-count">{friendList.length}</span>
      </div>
      {friendList.length === 0 && <p className="no-requests">You have no friends yet</p>}
      <ul className="friends-list">
        {friendList.map((friend) => (
          <li key={friend.id} className="friend-item">
            <div className="friend-info">
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={friend.avatar || defaultAvatar}
                  alt={friend.username}
                  style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", display: "block" }}
                />
                <span
                  className={`status-dot ${friend.online ? "online" : "offline"}`}
                  title={friend.online ? "Online" : "Offline"}
                  style={{ position: "absolute", bottom: 0, right: 0 }}
                />
              </div>
              <div>
                <Link
                  to={`/profile/${friend.id}`}
                  className="friend-name"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {friend.username}
                </Link>
                <span style={{ display: "block", fontSize: "0.75rem", opacity: 0.55 }}>
                  {friend.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <button className="remove-btn" onClick={() => removeFriend(friend.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
