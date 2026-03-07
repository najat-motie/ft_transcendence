import { apiRequest } from "../../services/api";

export default function FriendsList({ friendList, setFriendList }) {
  const removeFriend = async (friendId) => {
    try {
      await apiRequest(`/friends/remove/${friendId}`, { method: "DELETE" });
      setFriendList((prev) => prev.filter((f) => f.id !== friendId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="card">
      <h2>Friends List</h2>
      {friendList.length === 0 && <p className="no-requests">You have no friends yet</p>}
      <ul className="friends-list">
        {friendList.map((friend) => (
          <li key={friend.id} className="friend-item">
            <div className="friend-info">
              <span className={`status-dot ${friend.online ? "online" : "offline"}`}></span>
              <span className="friend-name">{friend.username}</span>
            </div>
            <button className="remove-btn" onClick={() => removeFriend(friend.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
