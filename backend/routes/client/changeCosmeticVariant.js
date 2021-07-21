module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    const cosmeticType = req.query.cosmeticType;
    const cosmeticId = req.query.cosmeticId;
    const variantTag = req.query.tag;
    const variantChannel = req.query.channel;

    let cType;

    switch (cosmeticType) {
        case 'outfit': cType = 'setOutfit'; break;
        case 'backpack': cType = 'setBackpack'; break;
        case 'pickaxe': cType = 'setPickaxe'; break;
    }

    await backend.client.party.me[cType](cosmeticId, [{
        channel: variantChannel,
        variant: variantTag
    }]);

    res.send({
        status: 200
    });
}