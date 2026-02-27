import { deleteCookie } from "../utils/cookies";

export function logout(userId) {
  // Clear user data from cookies ONLY
  deleteCookie("user");
  deleteCookie(`accessToken_${userId}`);
  deleteCookie(`refreshToken_${userId}`);
  deleteCookie("userProfile");
}
