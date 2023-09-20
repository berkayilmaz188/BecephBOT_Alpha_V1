const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

let shouldWelcome = true;
let connection;
let player;
let curl;

module.exports = (client) => {
    client.on('messageCreate', async message => {
        try {
          if (message.content === '!ping') {
            message.channel.send('Pong!');
          } else if (message.content === '!admins') {
            if (!message.guild) return;
      
            await message.guild.members.fetch();
      
            const adminMembers = message.guild.members.cache.filter(member => member.permissions.has('ADMINISTRATOR'));
      
            const adminRoles = message.guild.roles.cache.filter(role => role.permissions.has('ADMINISTRATOR'));
      
            const adminMembersString = adminMembers.map(member => `${member.user.tag} (ID: ${member.user.id})`).join('\n') || 'None';
            const adminRolesString = adminRoles.map(role => `${role.name} (ID: ${role.id})`).join('\n') || 'None';
      
            message.channel.send(`**Admin Members:**\n${adminMembersString}\n\n**Admin Roles:**\n${adminRolesString}`);
          } else if (message.content.startsWith('!music ')) {
            const url = message.content.split(' ')[1];
            curl = url
            currentURL = message.content.split(' ')[1];
            const guildId = message.guild.id;
            const channel = message.member.voice.channel;
            musicUrls.set(guildId, url);
      
            if (channel) {
              connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
              });
      
              console.log("Connected to voice channel");
      
              player = createAudioPlayer();
              
      
              player.on('error', error => console.error(`Error in player: ${error.stack} \n\n ${error.name} \n\n ${error.resource}`)); // hata yakalama
      
              const resource = createAudioResource(ytdl(url, { filter: 'audioonly' }));
              player.play(resource);
              console.log(`Player should be playing now. ${resource.playbackDuration}`);
              console.log(resource.metadata);
              connection.subscribe(player);
              console.log(connection.state.status);
              
      
              message.reply('Playing your song now!');
            } else {
              message.reply('You need to be in a voice channel.');
            }
          }
          
          
           else if (message.content === '!pause') {
            if (player) {
              player.pause();
              message.reply('Paused the song.');
            }
          } else if (message.content === '!resume') {
            if (player) {
              player.unpause(); 
              message.reply('Resumed the song.');
            }
          }
          else if (message.content === '!stop') {
            if (player) {
              player.stop();
              message.reply('Stopped the song.');
            }
          } else if (message.content === '!disconnect') {
            if (connection) {
              connection.destroy();
              message.reply('Disconnected.');
            }
          }
          else if (message.content === '!karsilamakapat') {
            shouldWelcome = false;
            message.reply('Karşılama mesajı kapatıldı.');
          } else if (message.content === '!karsilamaac') {
            shouldWelcome = true;
            message.reply('Karşılama mesajı açıldı.');
          }
          
        } catch (error) {
          console.error(`An error occurred: ${error}`);
        }
      });
      client.on('guildMemberAdd', member => {
        if (shouldWelcome) { 
          member.send("Hiperler'e hoş geldiniz!");
        }
      });
  };