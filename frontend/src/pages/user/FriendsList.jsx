import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import defaultAvatar from "../../assets/default-avatar.svg";
import { slabHeading } from "../../lib/ui";
import { cn } from "../../lib/cn";
import {
  emptyStateClass,
  listClass,
  removeButtonClass,
  socialCardClass,
  socialCardHeadClass,
  socialCountClass,
  socialEyebrowClass,
  socialItemClass,
  statusDotClass,
} from "./userUi";

export default function FriendsList({ friendList, setFriendList }) {
  const removeFriend = async (friendId) => {
    try {
      await apiRequest(`/friends/${friendId}`, { method: "DELETE" });
      setFriendList((prev) => prev.filter((friend) => friend.id !== friendId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={socialCardClass}>
      <div className={socialCardHeadClass}>
        <div>
          <span className={socialEyebrowClass}>Active Friends</span>
          <h2 className={cn(slabHeading, "mt-[0.45rem] text-[clamp(1.15rem,2vw,1.4rem)] text-slate-50")}>Friends List</h2>
        </div>
        <span className={socialCountClass}>{friendList.length}</span>
      </div>
      {friendList.length === 0 ? <p className={emptyStateClass}>You have no friends yet</p> : null}
      <ul className={listClass}>
        {friendList.map((friend) => (
          <li key={friend.id} className={socialItemClass}>
            <div className="flex items-center gap-[0.8rem]">
              <div className="relative shrink-0">
                <img
                  src={friend.avatar || defaultAvatar}
                  alt={friend.username}
                  className="block h-[38px] w-[38px] rounded-full object-cover"
                />
                <span
                  className={`${statusDotClass(friend.online)} absolute bottom-0 right-0`}
                  title={friend.online ? "Online" : "Offline"}
                />
              </div>
              <div>
                <Link
                  to={`/profile/${friend.id}`}
                  className="block text-[0.98rem] font-bold text-slate-50 hover:no-underline"
                >
                  {friend.username}
                </Link>
                <span className="block text-xs opacity-55">
                  {friend.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <button className={removeButtonClass} onClick={() => removeFriend(friend.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
