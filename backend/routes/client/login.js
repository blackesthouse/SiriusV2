module.exports = async (backend, req, res) => {
    if (req.query.useDeviceAuth) {
        const accountId = req.query.accountId;
        const deviceId = req.query.deviceId;
        const secret = req.query.secret;

        backend.client = new backend.Client({
            auth: {
                deviceAuth: {
                    accountId,
                    deviceId,
                    secret
                }
            },
            debug: false
        });

        try {
            await backend.client.login();

            res.send({
                status: 200,
                msg: 'device_auth'
            });
        } catch (err) {
            console.log(err);
            backend.client = undefined;
            res.send({
                status: 403,
                message: 'Invalid device auth credentials',
                code: 'invalid_device_auth'
            });
        }
    } else {
        let data = '';

        const authorizationCode = req.query.code;
        if (!authorizationCode || authorizationCode.length !== 32) return res.send({ status: 403, code: 'no_authorization_code' });

        if (backend.client) return res.send({ status: 403, message: 'Bot is already running.', code: 'bot_running' });

        backend.client = new backend.Client({
            auth: { authorizationCode },
            debug: false
        });

        try {
            let username;

            backend.client.on('ready', () => username = backend.client.user.displayName);

            backend.client.on('deviceauth:created', da => {
                data = JSON.stringify({
                    accountId: da.accountId,
                    deviceId: da.deviceId,
                    secret: da.secret
                });
            });

            await backend.client.login();

            res.send({
                status: 200,
                deviceAuth: data,
                displayName: username
            });
        } catch (err) {
            console.log(err);
            backend.client = undefined;
            res.send({
                status: 403,
                code: 'invalid_authorization_code'
            });
        }
    }
}