module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    res.send({
        status: 200,
        data: backend.client.party.members.map(x => x)
    });
}