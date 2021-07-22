module.exports = async (backend, req, res) => {
    if (!backend.client) return res.send({ status: 403, message: 'Bot is not running', code: 'bot_not_running' });

    const client = backend.client;
    const friends = [];

    client.friends.cache.forEach(f => {
        friends.push({
            id: f.id,
            displayName: f.displayName
        });
    });

    res.send({
        status: 200,
        data: {
            user: client.user,
            friends,
            party: client.party || null
        }
    });
}