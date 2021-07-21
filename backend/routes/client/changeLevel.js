module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    const level = req.query.level;

    await backend.client.party.me.setLevel(parseInt(level));
    await backend.client.party.me.setBattlepass(true, parseInt(level), 100, 100);

    res.send({
        status: 200
    });
}