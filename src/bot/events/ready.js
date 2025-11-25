const { Events } = require('discord.js');
const { config } = require('../../config/config');

// Store for avatar hashes
const avatarCache = new Map();

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ Logged in as ${client.user.tag}!`);
        
        // Initialize avatar cache for the target user
        try {
            if (config.guildId) {
                const guild = await client.guilds.fetch(config.guildId);
                const targetMember = await guild.members.fetch(config.targetUserId);
                avatarCache.set(config.targetUserId, targetMember.user.avatar);
                console.log(`👀 Monitoring ${targetMember.user.tag} for avatar changes`);
            } else {
                console.log('⚠️  GUILD_ID not set, bot will monitor across all servers');
            }
        } catch (error) {
            console.error('❌ Error initializing avatar cache:', error);
        }

        // Set bot status
        client.user.setActivity('Avatar Changes', { type: 'WATCHING' });
    },
    
    // Export cache for use in other files
    getAvatarCache: () => avatarCache
};
