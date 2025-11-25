const { config } = require('../../config/config');

/**
 * Find a suitable channel to send notifications
 * @param {Guild} guild - The Discord guild
 * @param {Client} client - The Discord client
 * @returns {Promise<TextChannel|null>}
 */
async function findSuitableChannel(guild, client) {
    // First, try to use the specifically configured log channel
    if (config.logChannelId) {
        try {
            const logChannel = await guild.channels.fetch(config.logChannelId);
            if (logChannel && hasRequiredPermissions(logChannel, client)) {
                return logChannel;
            }
        } catch (error) {
            console.warn('⚠️  Configured log channel not found, falling back to auto-detection');
        }
    }

    // Try to find channels by preferred names
    const preferredChannelNames = ['general', 'chat', 'main', 'bot-commands', 'logs'];
    
    for (const name of preferredChannelNames) {
        const channel = guild.channels.cache.find(ch => 
            ch.name.toLowerCase().includes(name) && 
            ch.type === 0 && // TEXT channel
            hasRequiredPermissions(ch, client)
        );
        if (channel) return channel;
    }
    
    // If no preferred channel found, get the first available text channel
    return guild.channels.cache.find(ch => 
        ch.type === 0 && 
        hasRequiredPermissions(ch, client)
    );
}

/**
 * Check if the bot has required permissions in a channel
 * @param {Channel} channel - The channel to check
 * @param {Client} client - The Discord client
 * @returns {boolean}
 */
function hasRequiredPermissions(channel, client) {
    const permissions = channel.permissionsFor(client.user);
    return permissions && permissions.has(['SendMessages', 'ViewChannel', 'EmbedLinks']);
}

module.exports = { findSuitableChannel };
