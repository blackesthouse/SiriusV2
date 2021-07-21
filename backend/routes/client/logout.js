module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    await backend.client.logout();
    backend.client = undefined;

    res.send({
        status: 200
    });
}