module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    const sitOut = req.query.sitOut;

    await backend.client.party.me.setSittingOut(sitOut === 'true' ? true : false);

    res.send({
        status: 200,
        newState: req.query.sitOut === 'true' ? 'SITTING OUT' : 'SITTING IN'
    })
}