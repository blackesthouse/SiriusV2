module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    const message = req.query.message;
    if (!message) return res.send({ status: 403, message: 'Provide a message.', code: 'no_message' });

    await backend.client.party.sendMessage(message);

    res.send({
        status: 200
    });
}