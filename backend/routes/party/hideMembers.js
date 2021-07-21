module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);
    if (!backend.client.party.me.isLeader) return res.send(backend.errorCodes.bot_not_leader);
    
    const value = req.query.value;

    if (value === 'true') await backend.client.party.hideMembers(true);
    else await backend.client.party.hideMembers(false);

    res.send({
        status: 200,
        newState: value === 'true' ? 'HIDDEN' : 'UNHIDDEN'
    });
}