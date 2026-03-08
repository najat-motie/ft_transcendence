import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/profile.css";
import { getUser } from "../../services/auth";
import { apiRequest } from "../../services/api";
import { validateForm } from "../../utils/formValidation";
import { readImageFile } from "../../utils/fileReader";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = getUser();

    if (userData?.user) {
      setUser(userData.user);
      setFormData(userData.user);
    }
  }, []);

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files?.[0];
      if (!file) return;

      try {
        const file = e.target.files?.[0];
        const dataUrl = await readImageFile(file);
    
        setFormData(prev => ({
          ...prev,
          [name]: dataUrl
        }));
    
        setError(null);
      } catch (err) {
        console.error("File processing error:", err);
        setError(err?.message || "Something went wrong");
      }
      
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setError("");

    const errorMessage = validateForm(formData, {
      username: true,
      bio: true,
    });

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      const res = await apiRequest(
        `/users/${user.userId}`,
        {
          method: "PUT",
          body: JSON.stringify(formData)
        }
      );

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();

      setUser(updatedUser);
      setFormData(updatedUser);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user || !formData) {
    return <p className="status-msg">Loading profile...</p>;
  }

  return (
    <section className="profile">
      <div className="profile-container">
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <div className="profile-header">
          <div className="avatar-wrapper">
            <img
              src={formData.avatar}
              alt={`${user.username}'s avatar`}
              className="avatar"
            />

            {editMode && (
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="avatar-input"
                aria-label="Upload new avatar"
              />
            )}
          </div>

          <div className="user-info">
            {editMode ? (
              <form
                className="profile-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleChange}
                />

                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />

                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  rows="3"
                />

                <div className="form-buttons">
                  <button
                    type="button"
                    className="save-btn"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setFormData(user);
                      setEditMode(false);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-view">
                <h2>{user.username}</h2>
                <p>{user.email}</p>
                <p>{user.bio}</p>

                <div className="profile-buttons">
                  <button
                    type="button"
                    onClick={() => navigate("/change-password")}
                  >
                    Change Password
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/friends")}
                  >
                    View Friends
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
