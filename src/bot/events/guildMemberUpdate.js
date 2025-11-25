const { Events } = require('discord.js');
const { config } = require('../../config/config');
const { findSuitableChannel } = require('../utils/channelFinder');
const readyEvent = require('./ready');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        // Check if this is the user we're monitoring
        if (newMember.user.id !== config.targetUserId) return;

        const avatarCache = readyEvent.getAvatarCache();
        const oldAvatar = avatarCache.get(config.targetUserId);
        const newAvatar = newMember.user.avatar;

        // Check if avatar has changed
        if (oldAvatar !== newAvatar) {
            console.log(`🔄 Avatar changed for ${newMember.user.tag}`);
            
            // Update cache
            avatarCache.set(config.targetUserId, newAvatar);

            // Send notification
            try {
                const channel = await findSuitableChannel(newMember.guild, newMember.client);
                if (channel) {
                    const avatarURL = newMember.user.displayAvatarURL({ size: 512, dynamic: true });
                    
                    await channel.send({
                        content: `<@${config.pingUserId}> **${newMember.user.tag}** changed their profile picture!`,
                        embeds: [
                            {
                                color: 0x00ff00,
                                title: 'Avatar Changed',
                                description: `**User:** ${newMember.user.tag} (${newMember.user.id})`,
                                image: { url: avatarURL },
                                timestamp: new Date().toISOString(),
                                footer: { text: 'Avatar Monitor' }
                            }
                        ]
                    });
                    
                    console.log(`✅ Notification sent for ${newMember.user.tag}'s avatar change`);
                } else {
                    console.error('❌ No suitable channel found for sending notification');
                }
            } catch (error) {
                console.error('❌ Error sending notification:', error);
            }
        }
    }
};
