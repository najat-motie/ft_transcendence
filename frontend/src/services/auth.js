export function logout(userId) {
    localStorage.removeItem(`accessToken_${userId}`);
    localStorage.removeItem(`refreshToken_${userId}`);
    localStorage.removeItem("user");
}
