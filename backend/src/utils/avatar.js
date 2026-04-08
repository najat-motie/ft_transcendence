const AVATAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'bottts',
  'fun-emoji',
  'identicon',
  'initials',
  'lorelei',
  'micah',
  'miniavs',
  'notionists',
];

const hashSeed = (seed) => {
  const value = String(seed || 'player');
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const generateDefaultAvatarUrl = (seed) => {
  const normalizedSeed = String(seed || 'player');
  const style = AVATAR_STYLES[hashSeed(normalizedSeed) % AVATAR_STYLES.length];

  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(normalizedSeed)}`;
};

const formatAvatarUrl = (avatarPath, seed) => {
  if (!avatarPath) return generateDefaultAvatarUrl(seed);
  if (/^https?:\/\//i.test(avatarPath)) return avatarPath;
  if (avatarPath.startsWith('/')) return avatarPath;
  return `/${avatarPath}`;
};

module.exports = {
  formatAvatarUrl,
  generateDefaultAvatarUrl,
};
