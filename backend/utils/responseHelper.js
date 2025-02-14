const createResponse = (success, data = null, message = null) => ({
    success,
    ...(data && { data }),
    ...(message && { message }),
    timestamp: new Date().toISOString()
});

module.exports = {
    createResponse
};
