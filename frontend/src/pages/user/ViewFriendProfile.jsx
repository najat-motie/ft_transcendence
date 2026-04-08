import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { cn } from "../../lib/cn";
import { slabHeading } from "../../lib/ui";
import {
  avatarClass,
  buttonRowClass,
  chipClass,
  detailCardClass,
  detailGridClass,
  errorBlockClass,
  heroGridClass,
  identityCardClass,
  kickerClass,
  mainActionButtonClass,
  miniStatClass,
  miniStatsGridClass,
  mutedClass,
  profilePageStyle,
  quickActionButtonClass,
  statsPanelClass,
  subtleChipClass,
  topbarClass,
  topbarHeadingClass,
  userContainer,
  userPageShell,
} from "./userUi";

export default function ViewFriendProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [friendship, setFriendship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileRes, kpisRes, friendshipRes] = await Promise.all([
        apiRequest(`/profile/${userId}`),
        apiRequest(`/profile/${userId}/kpis`),
        apiRequest(`/friends/check/${userId}`),
      ]);

      setProfile(profileRes?.data || profileRes);
      setKpis(kpisRes?.data || kpisRes);
      setFriendship(friendshipRes?.data || { status: "none" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    document.title = "ft_transcendence - View Profile";
  }, [])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendRequest = async () => {
    setActionLoading(true);
    setActionMsg("");
    try {
      await apiRequest(`/requests/send/${userId}`, { method: "POST" });
      setActionMsg("Friend request sent!");
      setFriendship({ status: "pending_sent" });
    } catch (err) {
      setActionMsg(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    setActionLoading(true);
    setActionMsg("");
    try {
      await apiRequest(`/friends/${userId}`, { method: "DELETE" });
      setActionMsg("Friend removed.");
      setFriendship({ status: "none" });
    } catch (err) {
      setActionMsg(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={userPageShell} style={profilePageStyle}>
        <div className={userContainer}>
          <p className={`${identityCardClass} ${mutedClass}`}>Loading profile...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={userPageShell} style={profilePageStyle}>
        <div className={userContainer}>
          <div className={errorBlockClass}>
            <div className="text-5xl leading-none">⚠️</div>
            <h3 className={cn(slabHeading, "m-0 text-[1.5rem] text-red-300")}>Unable to Load Profile</h3>
            <p className="m-0 text-slate-300">{error}</p>
            <button className={mainActionButtonClass} onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </section>
    );
  }

  const isOnline = profile?.status === "online";
  const friendStatus = friendship?.status || "none";

  const stats = [
    { label: "Wins", value: kpis?.wins ?? 0 },
    { label: "Losses", value: kpis?.losses ?? 0 },
    { label: "Matches", value: kpis?.totalMatches ?? 0 },
    { label: "Win Rate", value: kpis?.winRate != null ? `${Number(kpis.winRate).toFixed(1)}%` : "0%" },
    { label: "XP", value: kpis?.experience ?? 0 },
    { label: "Friends", value: kpis?.friendsCount ?? 0 },
  ];

  return (
    <section className={userPageShell} style={profilePageStyle}>
      <div className={userContainer}>
        <header className={topbarClass}>
          <div>
            <span className={kickerClass}>Player Profile</span>
            <h1 className={topbarHeadingClass}>{profile?.username || "Unknown Player"}</h1>
            <p className={mutedClass}>{profile?.bio || "No bio provided."}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-3 max-[560px]:flex-col">
            <button className={quickActionButtonClass} onClick={() => navigate(-1)}>← Back</button>
          </div>
        </header>

        <div className={heroGridClass}>
          <div className={identityCardClass}>
            <div className="relative h-[140px] w-[140px]">
              <img
                src={profile?.avatar}
                alt={profile?.username}
                className={avatarClass}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={isOnline ? chipClass : subtleChipClass}>
                {isOnline ? "Online" : "Offline"}
              </span>
              {kpis?.lastSeen ? (
                <span className={subtleChipClass}>
                  Last seen {new Date(kpis.lastSeen).toLocaleString()}
                </span>
              ) : null}
              {kpis?.accountAgeDays != null ? (
                <span className={subtleChipClass}>{kpis.accountAgeDays} days on platform</span>
              ) : null}
            </div>

            <h2 className={cn(slabHeading, "m-0 text-[clamp(1.8rem,3vw,2.4rem)] text-slate-50")}>{profile?.username}</h2>
            <p className={mutedClass}>{kpis?.email}</p>
            <p className={mutedClass}>{profile?.bio || "No bio."}</p>

            <div className={miniStatsGridClass}>
              {[
                { label: "Matches", value: kpis?.totalMatches ?? 0 },
                { label: "Friends", value: kpis?.friendsCount ?? 0 },
                { label: "XP", value: kpis?.experience ?? 0 },
              ].map((metric) => (
                <div key={metric.label} className={miniStatClass}>
                  <span className="text-[0.8rem] text-slate-400">{metric.label}</span>
                  <strong className="text-[1.25rem] text-slate-50">{metric.value}</strong>
                </div>
              ))}
            </div>

            <div className={buttonRowClass}>
              {friendStatus === "friends" ? (
                <button
                  className={quickActionButtonClass}
                  type="button"
                  disabled={actionLoading}
                  onClick={handleRemoveFriend}
                >
                  Remove Friend
                </button>
              ) : null}
              {friendStatus === "none" ? (
                <button
                  className={mainActionButtonClass}
                  type="button"
                  disabled={actionLoading}
                  onClick={handleSendRequest}
                >
                  Add Friend
                </button>
              ) : null}
              {friendStatus === "pending_sent" ? (
                <button className={quickActionButtonClass} type="button" disabled>
                  Request Sent
                </button>
              ) : null}
              {friendStatus === "pending_received" ? (
                <button className={quickActionButtonClass} type="button" disabled>
                  Respond in Friend Hub
                </button>
              ) : null}
            </div>

            {actionMsg ? <p className={mutedClass}>{actionMsg}</p> : null}
          </div>

          <div className={statsPanelClass}>
            <h3 className={cn(slabHeading, "px-[1.4rem] pt-[1.2rem] text-[1.4rem] text-slate-50")}>Statistics</h3>
            <div className={detailGridClass}>
              {stats.map((stat) => (
                <div key={stat.label} className={detailCardClass}>
                  <div className="text-[1.6rem] font-bold text-slate-50">{stat.value}</div>
                  <div className="mt-[0.3rem] text-[0.75rem] text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
