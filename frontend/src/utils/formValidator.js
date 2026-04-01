export function validateForm(form, options = {}) {
  const {
    password = false,
    confirmPassword = false,
    username = false,
    bio = false,
  } = options;

  
  if(password) {
    if (!form.password || form.password.length < 8) {
      return "Password must be at least 8 characters";
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
  
  if (username && !form.username?.trim()) {
    return "Username is required";
  }
  
  if (bio && form.bio?.length > 250) {
    return "Bio cannot exceed 250 characters";
  }
 
  return null;
}
