const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { config } = require('../../config/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('View current bot configuration')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const fields = [
            {
                name: '🎯 Target User ID',
                value: `\`${config.targetUserId}\``,
                inline: true
            },
            {
                name: '🔔 Ping User ID',
                value: `\`${config.pingUserId}\``,
                inline: true
            }
        ];

        if (config.guildId) {
            fields.push({
                name: '🏠 Guild ID',
                value: `\`${config.guildId}\``,
                inline: true
            });
        }

        if (config.logChannelId) {
            fields.push({
                name: '📝 Log Channel ID',
                value: `\`${config.logChannelId}\``,
                inline: true
            });
        }

        await interaction.reply({
            embeds: [
                {
                    color: 0x0099ff,
                    title: '⚙️ Bot Configuration',
                    description: 'Current bot settings from environment variables',
                    fields: fields,
                    timestamp: new Date().toISOString(),
                    footer: { 
                        text: 'Configuration is set via environment variables' 
                    }
                }
            ],
            ephemeral: true
        });
    }
};
