module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    const userId = req.query.id;
    const action = req.query.action;

    if (action === 'add') {
        try {
            await backend.client.addFriend(userId);
        } catch (err) {
            return res.send({
                status: 403,
                error: err
            });
        }
    } else {
        try {
            await backend.client.removeFriend(userId);
        } catch (err) {
            return res.send({
                status: 403,
                error: err
            })
        }
    }

    res.send({
        status: 200
    });
}