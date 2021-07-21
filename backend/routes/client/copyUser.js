module.exports = async (backend, req, res) => {
    if (!backend.client || !backend.client.party) return res.send(backend.errorCodes.bot_not_running);

    const outfitId = req.query.cid;
    const backpackId = req.query.bid;
    const pickaxeId = req.query.pickaxeId;

    await backend.client.party.me.setOutfit(outfitId);
    await backend.client.party.me.setBackpack(backpackId);
    await backend.client.party.me.setPickaxe(pickaxeId);

    res.send({
        status: 200
    });
}