module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    const userId = req.query.userId;
    const action = req.query.action;

    if (action === 'add') {
        await backend.client.addFriend(userId);
    } else {
        await backend.client.removeFriend(userId);
    }

    res.send({
        status: 200
    });
}