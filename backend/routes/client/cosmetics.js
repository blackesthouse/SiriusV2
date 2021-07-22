module.exports = async (backend, req, res) => {
    if (req.query.query && req.query.type) {
        const name = req.query.query;
        const cosmeticType = req.query.type;

        if (!name) return res.send({ status: 403, message: 'Provide at least one search parameter.', code: 'provide_atleast_one_parameter' });
        if (cosmeticType === 'level') return res.send({ status: 200, data: parseInt(name) });

        const cosmetics = backend.cosmetics.filter(x => x.name.toLowerCase().includes(name.toLowerCase()) && x.type.value === cosmeticType) || cosmetics.filter(x => x.id.toLowerCase().includes(name.toLowerCase()) && x.type.value === cosmeticType);
        if (!cosmetics) return res.send({ status: 204, message: 'No cosmetics found.', code: 'no_cosmetics_found' });

        res.send({
            status: 200,
            data: cosmetics
        });
    } else if (req.query.id && !req.query.type) {
        const id = req.query.id;

        const cosmetic = backend.cosmetics.find(x => x.id === id);
        if (!cosmetic) return res.send({ status: 404 });

        res.send({
            status: 200,
            data: cosmetic
        });
    } else {
        res.send({
            status: 200,
            data: backend.cosmetics
        });
    }
}