// 验证消息负载是否包含所有必需的字段
    function validatePayload(payload, done) {
        if (!payload.name || typeof payload.name !== 'string') {
            done(new Error("Name must be a string"));
        } else if (!payload.intervalTime || typeof payload.intervalTime !== 'number' || payload.intervalTime <= 0) {
            done(new Error("Interval time must be a positive number"));
        } else if (payload.command !== 'stop' && !payload.payload) {
            done(new Error("Message payload is required unless the command is 'stop'"));
        } else {
            done();
        }
}

module.exports = {
    validatePayload
};
