const { SlashCommandBuilder } = require('discord.js');
const { config } = require('../../config/config');
const readyEvent = require('../../bot/events/ready');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Check avatar monitoring status'),
    
    async execute(interaction) {
        const avatarCache = readyEvent.getAvatarCache();
        const currentAvatar = avatarCache.get(config.targetUserId);
        
        try {
            const targetUser = await interaction.client.users.fetch(config.targetUserId);
            const pingUser = await interaction.client.users.fetch(config.pingUserId);
            
            await interaction.reply({
                embeds: [
                    {
                        color: 0x0099ff,
                        title: '🔄 Avatar Monitor Status',
                        fields: [
                            {
                                name: '👀 Monitoring User',
                                value: `${targetUser.tag} (\`${targetUser.id}\`)`,
                                inline: true
                            },
                            {
                                name: '🔔 Notification Target',
                                value: `${pingUser.tag} (\`${pingUser.id}\`)`,
                                inline: true
                            },
                            {
                                name: '📊 Status',
                                value: currentAvatar ? '✅ Active' : '❌ Not Initialized',
                                inline: true
                            },
                            {
                                name: '🖼️ Current Avatar',
                                value: currentAvatar ? `[View Avatar](${targetUser.displayAvatarURL({ size: 512 })})` : 'Unknown'
                            }
                        ],
                        thumbnail: { url: targetUser.displayAvatarURL({ size: 128 }) },
                        timestamp: new Date().toISOString(),
                        footer: { text: 'Avatar Monitor Bot' }
                    }
                ]
            });
        } catch (error) {
            await interaction.reply({
                content: '❌ Error fetching user information. Make sure the user IDs are correct and the bot has proper permissions.',
                ephemeral: true
            });
        }
    }
};
