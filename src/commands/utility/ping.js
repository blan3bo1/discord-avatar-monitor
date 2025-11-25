const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency and status'),
    
    async execute(interaction) {
        const sent = await interaction.reply({ 
            content: 'Pinging...', 
            fetchReply: true 
        });
        
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);
        
        await interaction.editReply({
            content: `🏓 Pong!`,
            embeds: [
                {
                    color: 0x00ff00,
                    fields: [
                        {
                            name: '📡 Bot Latency',
                            value: `\`${latency}ms\``,
                            inline: true
                        },
                        {
                            name: '🌐 API Latency',
                            value: `\`${apiLatency}ms\``,
                            inline: true
                        },
                        {
                            name: '🟢 Status',
                            value: 'Online',
                            inline: true
                        }
                    ],
                    timestamp: new Date().toISOString()
                }
            ]
        });
    }
};
