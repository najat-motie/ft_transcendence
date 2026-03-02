export function setUser(user) {
  sessionStorage.setItem("User", JSON.stringify(user));
}

export function getUser() {
  const user = sessionStorage.getItem("User");
  return user ? JSON.parse(user) : null;
}

export function clearUser() {
  sessionStorage.removeItem("User");
}
