const prisma = require('../config/database');

async function searchAvailableUsers(currentUserId, searchQuery) {
  try {
    const users = await prisma.userProfile.findMany({
      where: {
        userId: { not: currentUserId },
        username: { contains: searchQuery, mode: 'insensitive' },
      },
      take: 20,
      select: {
        userId: true,
        username: true,
        avatar: true,
        bio: true,
      },
    });
    const result = await Promise.all(users.map(async (user) => {
      const status = await getFriendshipStatus(currentUserId, user.userId);
      return { ...user, id: user.userId, friendshipStatus: status };
    }));
    return result;
  } catch (error) {
    throw new Error(`Failed to search users: ${error.message}`);
  }
}

async function sendFriendRequest(senderId, receiverId) {
  if (senderId === receiverId) throw new Error('Cannot send request to yourself');
  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) throw new Error('User not found');
  const duplicate = await checkDuplicateFriendship(senderId, receiverId);
  if (duplicate) throw new Error('Friendship or request already exists');
  const request = await prisma.friendRequest.create({
    data: { senderId, receiverId },
  });
  return request;
}

async function getPendingRequests(userId) {
  return prisma.friendRequest.findMany({
    where: { receiverId: userId, status: 'pending' },
    include: { sender: { select: { id: true, email: true } } },
  });
}

async function acceptFriendRequest(requestId, userId) {
  const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });
  if (!request || request.receiverId !== userId) throw new Error('Unauthorized or not found');
  await prisma.friendRequest.update({ where: { id: requestId }, data: { status: 'accepted' } });
  const [user1Id, user2Id] = [request.senderId, request.receiverId].sort();
  const friendship = await prisma.friendship.create({ data: { user1Id, user2Id } });
  return friendship;
}

async function rejectFriendRequest(requestId, userId) {
  const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });
  if (!request || request.receiverId !== userId) throw new Error('Unauthorized or not found');
  await prisma.friendRequest.update({ where: { id: requestId }, data: { status: 'rejected' } });
}

async function removeFriend(friendshipId, userId) {
  const friendship = await prisma.friendship.findUnique({ where: { id: friendshipId } });
  if (!friendship || (friendship.user1Id !== userId && friendship.user2Id !== userId)) throw new Error('Unauthorized or not found');
  await prisma.friendship.delete({ where: { id: friendshipId } });
}

async function getFriendsList(userId) {
  const friendships = await prisma.friendship.findMany({
    where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
  });
  const friendIds = friendships.map((friendship) => {
    if (friendship.user1Id === userId) {
      return friendship.user2Id;
    }
    return friendship.user1Id;
  });
  return prisma.userProfile.findMany({
    where: { userId: { in: friendIds } },
    select: { userId: true, username: true, name: true, avatar: true },
  });
}

async function getFriendshipStatus(userId1, userId2) {
  const [idA, idB] = [userId1, userId2].sort();
  const friendship = await prisma.friendship.findFirst({
    where: { user1Id: idA, user2Id: idB },
  });
  if (friendship) return 'FRIEND';
  const pending = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      status: 'pending',
    },
  });
  if (pending) return 'PENDING';
  return 'NONE';
}

async function checkDuplicateFriendship(senderId, receiverId) {
  const [idA, idB] = [senderId, receiverId].sort();
  const friendship = await prisma.friendship.findFirst({ where: { user1Id: idA, user2Id: idB } });
  if (friendship) return true;
  const request = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      status: 'pending',
    },
  });
  return !!request;
}

module.exports = {
  searchAvailableUsers,
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
  removeFriend,
  getFriendshipStatus,
  checkDuplicateFriendship,
};
