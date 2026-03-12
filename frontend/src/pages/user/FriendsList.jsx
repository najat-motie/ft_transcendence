import { apiRequest } from "../../services/api";

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
              <span className={`status-dot ${friend.online ? "online" : "offline"}`}></span>
              <div>
                <span className="friend-name">{friend.username}</span>
                <span className="friend-meta">{friend.online ? "Online now" : "Offline"}</span>
              </div>
            </div>
            <button className="remove-btn" onClick={() => removeFriend(friend.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
