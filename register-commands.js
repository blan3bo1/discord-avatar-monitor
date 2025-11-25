const { REST, Routes } = require('discord.js');
const { config } = require('./src/config/config');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandCategories = fs.readdirSync(commandsPath);

for (const category of commandCategories) {
    const categoryPath = path.join(commandsPath, category);
    const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(categoryPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            console.log(`✅ Loaded command: ${command.data.name}`);
        } else {
            console.log(`❌ The command at ${filePath} is missing required properties.`);
        }
    }
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log(`🔄 Starting to register ${commands.length} application (/) commands.`);

        let data;
        
        if (config.guildId) {
            // Guild-specific commands (instant update)
            console.log(`📁 Registering commands to guild: ${config.guildId}`);
            data = await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: commands },
            );
            console.log(`✅ Successfully registered ${data.length} guild commands.`);
        } else {
            // Global commands (takes up to 1 hour)
            console.log('🌍 Registering commands globally...');
            data = await rest.put(
                Routes.applicationCommands(config.clientId),
                { body: commands },
            );
            console.log(`✅ Successfully registered ${data.length} global commands.`);
            console.log('⚠️  Global commands may take up to 1 hour to propagate across all servers.');
        }

        console.log('\n📋 Registered Commands:');
        data.forEach(command => {
            console.log(`   - ${command.name}: ${command.description}`);
        });

    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
})();
