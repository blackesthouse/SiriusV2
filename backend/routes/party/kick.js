module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);
    if (!backend.client.party.me.isLeader) return res.send(backend.errorCodes.bot_not_leader);

    const userId = req.query.userId;
    await backend.client.party.kick(userId);

    res.send({
        status: 200
    });
}