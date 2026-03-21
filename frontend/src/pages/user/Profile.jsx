import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { validateForm } from "../../utils/validator";
import { getUserFromCookie, setCookie, setUserInCookie } from "../../utils/cookies";
import defaultAvatar from "../../assets/default-avatar.svg";
import { alertInfo, ghostButton, slabHeading } from "../../lib/ui";
import { cn } from "../../lib/cn";
import {
  avatarClass,
  buttonRowClass,
  chipClass,
  detailCardClass,
  detailGridClass,
  errorBlockClass,
  formInputClass,
  formLabelClass,
  formTextAreaClass,
  headlineCardClass,
  headlineGridClass,
  heroGridClass,
  identityCardClass,
  kickerClass,
  mainActionButtonClass,
  miniStatClass,
  miniStatsGridClass,
  mutedClass,
  profilePageStyle,
  statsPanelClass,
  subtleChipClass,
  topbarClass,
  topbarHeadingClass,
  quickActionButtonClass,
  userContainer,
  userPageShell,
} from "./userUi";

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
      const storedUser = getUserFromCookie();
      if (!storedUser?.userId) {
        throw new Error("No active user found. Please login again.");
      }

      const kpiResponse = await apiRequest(`/profile/${storedUser.userId}/kpis`, {
        method: "GET",
      });

      const kpiData = kpiResponse?.data || kpiResponse;
      const syncedUser = {
        ...storedUser,
        userId: kpiData.userId || storedUser.userId,
        username: kpiData.username || storedUser.username,
        email: kpiData.email || storedUser.email,
        avatar: kpiData.avatar || storedUser.avatar,
        bio: kpiData.bio || storedUser.bio,
      };

      setUserInCookie(syncedUser, 7);
      setCookie("userProfile", JSON.stringify(kpiData), 7);

      setKpis(kpiData);
      setUser(syncedUser);
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

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

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
        setUser((prev) => {
          const syncedUser = { ...prev, ...updatedData };
          setUserInCookie(syncedUser, 7);
          return syncedUser;
        });
        setCookie("userProfile", JSON.stringify(updatedData), 7);
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
      <section className={userPageShell} style={profilePageStyle}>
        <div className={userContainer}>
          <p className={`${identityCardClass} ${mutedClass}`}>Loading profile insight...</p>
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
            <p className="m-0 max-w-[44ch] text-slate-300">{error}</p>
            <div className="flex flex-wrap justify-center gap-3 max-[560px]:flex-col">
              <button className={mainActionButtonClass} onClick={retry}>Try Again</button>
              <Link to="/login" className={quickActionButtonClass}>
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
      <section className={userPageShell} style={profilePageStyle}>
        <div className={userContainer}>
          <p className={`${identityCardClass} ${mutedClass}`}>No profile data available.</p>
        </div>
      </section>
    );
  }

  const headlineStats = [
    { label: "Win Rate", value: formattedWinRate, valueClass: "text-lime-400" },
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
    <section className={userPageShell} style={profilePageStyle}>
      <div className={userContainer}>
        <header className={topbarClass}>
          <div>
            <span className={kickerClass}>Player Profile</span>
            <h1 className={topbarHeadingClass}>Profile overview</h1>
            <p className={mutedClass}>Track your progress, update your identity, and jump quickly into your social tools.</p>
          </div>
          <div className="flex flex-wrap justify-end gap-3 max-[560px]:flex-col">
            <button className={quickActionButtonClass} onClick={() => navigate("/friends")}>Friends</button>
            <button className={quickActionButtonClass} onClick={() => navigate("/change-password")}>Change Password</button>
          </div>
        </header>

        <div className={heroGridClass}>
          <div className={identityCardClass}>
            <div className="relative h-[140px] w-[140px]">
              <img src={formData.avatar || defaultAvatar} alt="avatar" className={avatarClass} />
              {editMode ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    name="avatar"
                    onChange={handleChange}
                    className="absolute inset-0 z-[2] cursor-pointer opacity-0"
                    aria-label="Upload avatar"
                  />
                  <span className="absolute bottom-[-10px] right-[-10px] rounded-full bg-yellow-400 px-[0.7rem] py-[0.45rem] text-[0.72rem] font-extrabold text-stone-900 shadow-[0_10px_24px_rgba(250,204,21,0.22)]">
                    Upload
                  </span>
                </>
              ) : null}
            </div>

            {!editMode ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <span className={chipClass}>{kpis?.status || "offline"}</span>
                  <span className={subtleChipClass}>
                    Last seen {kpis?.lastSeen ? new Date(kpis.lastSeen).toLocaleString() : "just now"}
                  </span>
                  {kpis?.accountAgeDays != null ? (
                    <span className={subtleChipClass}>{kpis.accountAgeDays} days on platform</span>
                  ) : null}
                </div>
                <h2 className={cn(slabHeading, "m-0 text-[clamp(1.8rem,3vw,2.4rem)] text-slate-50")}>{user.username}</h2>
                <p className={mutedClass}>{user.email}</p>
                <p className={mutedClass}>{user.bio || "Add a short bio so friends know you."}</p>

                <div className={miniStatsGridClass}>
                  {heroMetrics.map((metric) => (
                    <div key={metric.label} className={miniStatClass}>
                      <span className="text-[0.8rem] text-slate-400">{metric.label}</span>
                      <strong className="text-[1.25rem] text-slate-50">{metric.value}</strong>
                    </div>
                  ))}
                </div>

                <div className={buttonRowClass}>
                  <button className={mainActionButtonClass} type="button" onClick={() => setEditMode(true)}>Edit Profile</button>
                  <button className={quickActionButtonClass} type="button" onClick={() => navigate("/friends")}>Open Friends Hub</button>
                </div>
              </>
            ) : (
              <div className="grid gap-[0.9rem]">
                <h2 className={cn(slabHeading, "m-0 text-[1.4rem] text-slate-50")}>
                  {user ? "Edit your profile" : "Create your profile"}
                </h2>
                {error ? <p className="rounded-[14px] border border-red-500/25 bg-red-500/10 px-[0.95rem] py-3 text-sm leading-[1.5] text-red-200">{error}</p> : null}
                <label className={formLabelClass}>
                  <span>Username</span>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className={formInputClass} />
                </label>
                <label className={formLabelClass}>
                  <span>Bio</span>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className={formTextAreaClass} />
                </label>
                <div className={buttonRowClass}>
                  <button className={mainActionButtonClass} type="button" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : user ? "Save Changes" : "Create Profile"}
                  </button>
                  {user ? <button className={quickActionButtonClass} type="button" onClick={handleCancelEdit}>Cancel</button> : null}
                </div>
              </div>
            )}
          </div>

          <div className={statsPanelClass}>
            <div className={headlineGridClass}>
              {headlineStats.map((stat) => (
                <div key={stat.label} className={headlineCardClass}>
                  <p className="mb-[0.35rem] text-[0.8rem] uppercase tracking-[0.04em] text-slate-400">{stat.label}</p>
                  <p className={`text-[clamp(1.8rem,3vw,2.4rem)] font-bold ${stat.valueClass}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className={detailGridClass}>
              {detailStats.map((stat) => (
                <div key={stat.label} className={detailCardClass}>
                  <p className="mb-[0.35rem] text-[0.8rem] uppercase tracking-[0.04em] text-slate-400">{stat.label}</p>
                  <p className="text-[1.15rem] font-bold text-slate-50">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
