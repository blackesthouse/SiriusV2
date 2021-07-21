module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    return res.send({
        status: 200,
        isLeader: backend.client.party.me.isLeader ? true : false
    });
}