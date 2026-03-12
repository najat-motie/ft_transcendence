import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/user/profile.css";
import { apiRequest } from "../../services/api";
import { validateForm } from "../../utils/validator";
import { getUserFromCookie } from "../../utils/cookies";

export default function Profile() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
    bio: "",
  });

  const formattedWinRate = useMemo(() => {
    if (!kpis) return "0%";
    return `${kpis.winRate?.toFixed ? kpis.winRate.toFixed(2) : kpis.winRate || 0}%`;
  }, [kpis]);

  const fetchProfile = useCallback(async () => {
    try {
      // Get user from cookies instead of localStorage
      const storedUser = getUserFromCookie();
      if (!storedUser?.userId) {
        throw new Error("No active user found. Please login again.");
      }

      const kpiResponse = await apiRequest(`/profile/${storedUser.userId}/kpis`, {
        method: "GET",
      });

      // backend returns { success, data }, fallback to raw shape if needed
      const kpiData = kpiResponse?.data || kpiResponse;

      setKpis(kpiData);
      setUser({
        username: kpiData.username,
        email: kpiData.email,
        avatar: kpiData.avatar,
        bio: kpiData.bio,
        userId: kpiData.userId,
      });
      setFormData({
        username: kpiData.username || "",
        email: kpiData.email || "",
        avatar: kpiData.avatar || "",
        bio: kpiData.bio || "",
      });
    } catch (err) {
      if (err.message?.includes("Profile not found") || err.message?.includes("not found")) {
        setUser(null);
        setKpis(null);
        setEditMode(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const resetFormFromUser = useCallback(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
      bio: user?.bio || "",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files?.[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => setFormData((prev) => ({ ...prev, [name]: reader.result }));
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setError("");

    const errorMessage = validateForm(formData, {
      username: true,
    });
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      setIsSaving(true);
      const isCreate = !user;
      const payload = {
        ...formData,
        username: formData.username.trim(),
        bio: formData.bio.trim(),
      };

      const updated = await apiRequest(`/profile`, {
        method: isCreate ? "POST" : "PUT",
        body: JSON.stringify(payload),
      });
      const updatedData = updated?.data || updated;

      if (isCreate) {
        setEditMode(false);
        fetchProfile();
      } else {
        setUser((prev) => ({ ...prev, ...updatedData }));
        setFormData((prev) => ({ ...prev, ...updatedData }));
        setEditMode(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setError(null);
    resetFormFromUser();
    setEditMode(false);
  };

  const retry = () => {
    setLoading(true);
    setError(null);
    fetchProfile();
  };

  if (loading) {
    return (
      <section className="profile">
        <div className="profile-container">
          <p className="muted">Loading profile insight…</p>
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
            <div className="error-actions">
              <button className="primary" onClick={retry}>Try Again</button>
              <Link to="/login" className="secondary-btn">
                Login Again
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!user && !editMode) {
    return (
      <section className="profile">
        <div className="profile-container">
          <p className="muted">No profile data available.</p>
        </div>
      </section>
    );
  }

  const headlineStats = [
    { label: "Win Rate", value: formattedWinRate, accent: "lime" },
  ];

  const detailStats = [
    { label: "Wins", value: kpis?.wins ?? 0 },
    { label: "Losses", value: kpis?.losses ?? 0 },
    { label: "Matches", value: kpis?.totalMatches ?? 0 },
    { label: "XP", value: kpis?.experience ?? 0 },
    { label: "Friends", value: kpis?.friendsCount ?? 0 },
    { label: "Pending In", value: kpis?.pendingRequestsReceived ?? 0 },
    { label: "Pending Out", value: kpis?.pendingRequestsSent ?? 0 },
  ];

  const heroMetrics = [
    { label: "Matches", value: kpis?.totalMatches ?? 0 },
    { label: "Friends", value: kpis?.friendsCount ?? 0 },
    { label: "XP", value: kpis?.experience ?? 0 },
  ];

  return (
    <section className="profile">
      <div className="profile-container">
        <header className="profile-topbar">
          <div>
            <span className="profile-kicker">Player Profile</span>
            <h1>Profile overview</h1>
            <p className="muted profile-topbar-copy">Track your progress, update your identity, and jump quickly into your social tools.</p>
          </div>
          <div className="profile-quick-links">
            <button className="ghost" onClick={() => navigate("/friends")}>Friends</button>
            <button className="ghost" onClick={() => navigate("/change-password")}>Change Password</button>
          </div>
        </header>

        <div className="profile-hero">
          <div className="profile-identity-card">
            <div className="avatar-wrapper">
              <img src={formData.avatar || "https://i.pravatar.cc/120"} alt="avatar" className="avatar" />
              {editMode && (
                <input
                  type="file"
                  accept="image/*"
                  name="avatar"
                  onChange={handleChange}
                  className="avatar-input"
                  aria-label="Upload avatar"
                />
              )}
              {editMode && <span className="avatar-overlay">Upload</span>}
            </div>

            {!editMode ? (
              <>
                <div className="chips">
                  <span className="chip">{kpis?.status || "offline"}</span>
                  <span className="chip subtle">Last seen {kpis?.lastSeen ? new Date(kpis.lastSeen).toLocaleString() : "just now"}</span>
                  {kpis?.accountAgeDays !== null && <span className="chip subtle">{kpis?.accountAgeDays} days on platform</span>}
                </div>
                <h2>{user.username}</h2>
                <p className="muted profile-email">{user.email}</p>
                <p className="muted bio">{user.bio || "Add a short bio so friends know you."}</p>

                <div className="profile-mini-stats">
                  {heroMetrics.map((metric) => (
                    <div key={metric.label} className="profile-mini-stat">
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="profile-buttons">
                  <button className="primary" type="button" onClick={() => setEditMode(true)}>Edit Profile</button>
                  <button className="ghost" type="button" onClick={() => navigate("/friends")}>Open Friends Hub</button>
                </div>
              </>
            ) : (
              <div className="profile-form profile-form-card">
                <h2>{user ? "Edit your profile" : "Create your profile"}</h2>
                <label>
                  Username
                  <input type="text" name="username" value={formData.username} onChange={handleChange} />
                </label>
                <label>
                  Bio
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" />
                </label>
                <div className="form-buttons">
                  <button className="primary" type="button" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : user ? "Save Changes" : "Create Profile"}
                  </button>
                  {user && <button className="ghost" type="button" onClick={handleCancelEdit}>Cancel</button>}
                </div>
              </div>
            )}
          </div>

          <div className="profile-stats-panel">
            <div className="headline-grid">
              {headlineStats.map((stat) => (
                <div key={stat.label} className={`headline-card ${stat.accent}`}>
                  <p className="label">{stat.label}</p>
                  <p className="value">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="detail-grid">
              {detailStats.map((stat) => (
                <div key={stat.label} className="detail-card">
                  <p className="label">{stat.label}</p>
                  <p className="value">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
