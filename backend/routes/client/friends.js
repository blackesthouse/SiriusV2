module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    const friendId = req.query.id;

    if (!friendId) return res.send({ status: 200, data: backend.client.friends.cache.map(x => x) });

    const friend = backend.client.friends.cache.get(friendId);

    if (!friend) return res.send({ status: 404, message: 'Friend not found.', code: 'friend_not_found' });

    res.send({
        status: 200,
        data: {
            isOnline: friend.isOnline,
            isJoinable: friend.presence ? friend.presence.isJoinable : false,

            user: {
                displayName: friend.displayName,
                connections: friend.connections
            },

            party: {
                size: friend.presence ? friend.presence.partySize : null,
                partyMaxSize: friend.presence ? friend.presence.partyMaxSize : null
            },

            presence: {
                isPlaying: friend.presence ? friend.presence.isPlaying : false,
                status: friend.presence ? friend.presence.status : null,
                gameplayStats: {
                    kills: friend.presence ? friend.presence.gameplayStats.kills : null,
                    fellToDeath: friend.presence ? friend.presence.gameplayStats.fellToDeath : null,
                    playerCount: friend.presence ? friend.presence.gameplayStats.serverPlayerCount : null,
                    playlist: friend.presence ? friend.presence.playlist : null
                }
            }
        }
    });
}