require('dotenv').config();

const config = {
    token: process.env.BOT_TOKEN,
    clientId: process.env.CLIENT_ID,
    targetUserId: process.env.TARGET_USER_ID || '1117652429698252820',
    pingUserId: process.env.PING_USER_ID || '1353737272989581436',
    guildId: process.env.GUILD_ID,
    logChannelId: process.env.LOG_CHANNEL_ID
};

// Validate required configuration
if (!config.token) {
    throw new Error('BOT_TOKEN environment variable is required');
}

if (!config.clientId) {
    throw new Error('CLIENT_ID environment variable is required');
}

module.exports = { config };
