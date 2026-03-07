export function validateForm(form, options = {}) {
  const {
    username = false,
    password = false,
    confirmPassword = false,
  } = options;

  if (username && !form.username?.trim()) {
    return "Username is required";
  }
  
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
 
  return null;
}
