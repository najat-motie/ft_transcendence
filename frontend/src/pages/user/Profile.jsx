import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/profile.css";
import { apiRequest } from "../../services/api";
import { validateForm } from "../../utils/validator";

export default function Profile() {
  const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [formData, setFormData] = useState({ username: "", email: "", bio: "", avatar: "" });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({
    username: "Alice",
    email: "alice@example.com",
    avatar: "https://i.pravatar.cc/100?img=3",
    bio: "Just a cool player!",
  });
  const [formData, setFormData] = useState({
    username: "Alice",
    email: "alice@example.com",
    avatar: "https://i.pravatar.cc/100?img=3",
    bio: "Just a cool player!",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await apiRequest(`/profile/${user.userId}`, { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === "file" && files?.[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => setFormData(prev => ({ ...prev, [name]: reader.result }));
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setError("");

    const errorMessage = validateForm(formData, {
      Username: true,
    });
    if(errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      const res = await apiRequest(`/users/${user.userId}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();
      setUser(updatedUser);
      setFormData(updatedUser);
      setEditMode(false);
    } catch (error) {
      setError(error.message);
    }
  };

//   if (loading) return <p>Loading profile...</p>;
//   if (!user) return <p>No user data</p>;

  return (
    <section className="profile">
      <div className="profile-container">
        {error && <p className="error">{error}</p>}

        <div className="profile-header">
          <div className="avatar-wrapper">
            <img
              src={formData.avatar}
              alt="avatar"
              className="avatar"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="avatar-input"
              />
            )}
          </div>

          <div className="user-info">
            {editMode ? (
              <div className="profile-form">
                <label>
                  Username
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Bio
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                  />
                </label>
                <div className="form-buttons">
                  <button className="save-btn" onClick={handleSave}>Save Changes</button>
                  <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="profile-view">
                <h2>{user.username}</h2>
                <p>{user.email}</p>
                <p>{user.bio}</p>
                <div className="profile-buttons">
                  <button onClick={() => navigate("/change-password")}>Change Password</button>
                  <button onClick={() => setEditMode(true)}>Edit Profile</button>
                  <button onClick={() => navigate("/friends")}>View Friends</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
