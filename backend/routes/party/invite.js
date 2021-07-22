module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    const userId = req.query.userId;
    const friend = await backend.client.friends.cache.get(userId);

    try {
        await friend.invite();

        res.send({
            status: 200
        });
    } catch {
        res.send({
            status: 403
        });
    }
}