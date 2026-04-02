export function validateForm(form, options = {}) {
  const {
    password = false,
    confirmPassword = false,
    username = false,
    bio = false,
  } = options;

  if (password) {
    if (!form.password || form.password.length < 8) {
      return "Password must be at least 8 characters";
    }

    if (form.password.length > 72) {
      return "Password is too long";
    }

    if (!/[A-Z]/.test(form.password)) {
      return "Password must contain an uppercase letter";
    }

    if (!/[a-z]/.test(form.password)) {
      return "Password must contain a lowercase letter";
    }

    if (!/[0-9]/.test(form.password)) {
      return "Password must contain a number";
    }
  }

  if (confirmPassword && form.password !== form.confirmPassword) {
    return "Passwords do not match";
  }

  if (username) {
    if (!form.username?.trim()) {
      return "Username is required";
    }

    if (form.username.length < 3) {
      return "Username must be at least 3 characters";
    }

    if (form.username.length > 20) {
      return "Username cannot exceed 20 characters";
    }
  }

  if (bio) {
    if (form.bio?.length > 250) {
      return "Bio cannot exceed 250 characters";
    }
  }

  return null;
}
