module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    let action;

    const cosmeticType = req.query.type;
    const value = req.query.value;

    if (!cosmeticType || !value) return res.send({ status: 403, message: 'Invalid parameters.', code: 'invalid_parameters' });

    switch (cosmeticType) {
        case 'outfit': action = 'setOutfit'; break;
        case 'backpack': action = 'setBackpack'; break;
        case 'pickaxe': action = 'setPickaxe'; break;
        case 'emote': action = 'setEmote'; break;
    }

    await backend.client.party.me[action](value);

    res.send({
        status: 200
    });
}