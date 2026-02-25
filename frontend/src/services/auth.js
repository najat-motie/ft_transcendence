export function logout(userId) {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem(`accessToken_${userId}`);
    localStorage.removeItem(`refreshToken_${userId}`);
}
