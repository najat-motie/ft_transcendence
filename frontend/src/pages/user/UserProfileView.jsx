import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/user/profile.css";
import { apiRequest } from "../../services/api";
import defaultAvatar from "../../assets/default-avatar.svg";

export default function UserProfileView() {
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
      <section className="profile">
        <div className="profile-container">
          <p className="muted">Loading profile…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="profile">
        <div className="profile-container">
          <div className="error-block">
            <div className="error-icon">⚠️</div>
            <h3>Unable to Load Profile</h3>
            <p className="error-message">{error}</p>
            <button className="primary" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </section>
    );
  }

  const friendStatus = friendship?.status || "none";
  const isOnline = profile?.status === "online";

  const stats = [
    { label: "Wins", value: kpis?.wins ?? 0 },
    { label: "Losses", value: kpis?.losses ?? 0 },
    { label: "Matches", value: kpis?.totalMatches ?? 0 },
    { label: "Win Rate", value: kpis?.winRate != null ? `${Number(kpis.winRate).toFixed(1)}%` : "0%" },
    { label: "XP", value: kpis?.experience ?? 0 },
    { label: "Friends", value: kpis?.friendsCount ?? 0 },
  ];

  return (
    <section className="profile">
      <div className="profile-container">
        <header className="profile-topbar">
          <div>
            <span className="profile-kicker">Player Profile</span>
            <h1>{profile?.username || "Unknown Player"}</h1>
            <p className="muted profile-topbar-copy">
              {profile?.bio || "No bio provided."}
            </p>
          </div>
          <div className="profile-quick-links">
            <button className="ghost" onClick={() => navigate(-1)}>← Back</button>
          </div>
        </header>

        <div className="profile-hero">
          <div className="profile-identity-card">
            <div className="avatar-wrapper">
              <img
                src={profile?.avatar || defaultAvatar}
                alt={profile?.username}
                className="avatar"
              />
            </div>

            <div className="chips">
              <span className={`chip ${isOnline ? "" : "subtle"}`}>
                {isOnline ? "🟢 Online" : "⚪ Offline"}
              </span>
              {kpis?.lastSeen && (
                <span className="chip subtle">
                  Last seen {new Date(kpis.lastSeen).toLocaleString()}
                </span>
              )}
              {kpis?.accountAgeDays != null && (
                <span className="chip subtle">{kpis.accountAgeDays} days on platform</span>
              )}
            </div>

            <h2>{profile?.username}</h2>
            <p className="muted profile-email">{kpis?.email}</p>
            <p className="muted bio">{profile?.bio || "No bio."}</p>

            <div className="profile-mini-stats">
              {[
                { label: "Matches", value: kpis?.totalMatches ?? 0 },
                { label: "Friends", value: kpis?.friendsCount ?? 0 },
                { label: "XP", value: kpis?.experience ?? 0 },
              ].map((m) => (
                <div key={m.label} className="profile-mini-stat">
                  <span>{m.label}</span>
                  <strong>{m.value}</strong>
                </div>
              ))}
            </div>

            <div className="profile-buttons">
              {friendStatus === "friends" && (
                <button
                  className="ghost"
                  type="button"
                  disabled={actionLoading}
                  onClick={handleRemoveFriend}
                >
                  Remove Friend
                </button>
              )}
              {friendStatus === "none" && (
                <button
                  className="primary"
                  type="button"
                  disabled={actionLoading}
                  onClick={handleSendRequest}
                >
                  Add Friend
                </button>
              )}
              {friendStatus === "pending_sent" && (
                <button className="ghost" type="button" disabled>
                  Request Sent
                </button>
              )}
              {friendStatus === "pending_received" && (
                <button className="ghost" type="button" disabled>
                  Respond in Friend Hub
                </button>
              )}
            </div>

            {actionMsg && <p className="muted" style={{ marginTop: "0.5rem" }}>{actionMsg}</p>}
          </div>
        </div>

        <div className="profile-stats-panel">
          <h3 style={{ padding: "1.2rem 1.4rem 0.4rem", margin: 0 }}>Statistics</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "1rem",
              padding: "0 1.4rem 1.4rem",
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(56,189,248,0.06)",
                  borderRadius: 16,
                  padding: "1rem",
                  textAlign: "center",
                  border: "1px solid rgba(148,163,184,0.1)",
                }}
              >
                <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#f8fafc" }}>{s.value}</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.3rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
