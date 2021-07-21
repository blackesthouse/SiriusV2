module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    await backend.client.party.me.clearEmote();
    res.send({
        status: 200
    });
}