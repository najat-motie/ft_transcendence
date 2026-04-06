const fs = require('fs');
const path = require('path');

const AVATAR_DIR = path.join(__dirname, '..', '..', 'uploads', 'avatars');
const BASE64_IMAGE_REGEX = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/;

const ensureAvatarDir = () => {
  if (!fs.existsSync(AVATAR_DIR)) {
    fs.mkdirSync(AVATAR_DIR, { recursive: true });
  }
};

const saveAvatarIfProvided = (avatarPayload) => {
  if (!avatarPayload) {
    return null;
  }

  const match = avatarPayload.match(BASE64_IMAGE_REGEX);
  if (!match) {
    return avatarPayload;
  }

  const mimeType = match[1];
  const base64Data = match[2];
  const extension = mimeType.split('/')[1] || 'png';
  const filename = `avatar-${Date.now()}-${Math.round(Math.random() * 1e6)}.${extension}`;

  ensureAvatarDir();
  const filePath = path.join(AVATAR_DIR, filename);
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);

  return `/uploads/avatars/${filename}`;
};

module.exports = {
  saveAvatarIfProvided,
};
