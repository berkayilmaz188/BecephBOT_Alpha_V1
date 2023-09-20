const { Client } = require('discord.js');
require('dotenv').config();
const messageEvents = require('../events/messageEvents');

const client = new Client({
  intents: [
    'GUILDS',
    'GUILD_VOICE_STATES',
    'GUILD_MESSAGES',
    'GUILD_MEMBERS',
    'GUILD_PRESENCES',
    'DIRECT_MESSAGES'
  ]
});

client.once('ready', () => {
  console.log('Ready!');
});

client.on('guildDelete', (guild) => {
  if (connection) {
    connection.destroy();
  }
});

messageEvents(client);

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = client;
