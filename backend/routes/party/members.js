module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send({ status: 403, message: 'Bot is not running', code: 'bot_not_running' });

    res.send({
        status: 200,
        data: backend.client.party.members.map(x => x)
    });
}