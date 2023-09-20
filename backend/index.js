const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 4002;




const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus,VoiceConnectionStatus, getVoiceConnection  } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
let curl;

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


let connection;
let player;
let currentURL = '';
const musicUrls = new Map();

let shouldWelcome = true;

app.use(
  session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000,
    },
  })
);

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use(express.json());

client.once('ready', () => {
  console.log('Ready!');
});

client.on('guildDelete', (guild) => {
  if (connection) {
    connection.destroy();
  }
});

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
  if (shouldWelcome) { // Eğer shouldWelcome true ise
    member.send("Hiperler'e hoş geldiniz!");
  }
});



client.login('');

app.get('/BekoBOTServers', (req, res) => {
  const servers = client.guilds.cache.map(guild => {
      // Sunucu bilgilerini topla
      const serverInfo = {
          id: guild.id,
          name: guild.name,
          memberCount: guild.memberCount, // Sunucudaki toplam kullanıcı sayısı
      };

      // Admin yetkisi olan üyeleri ve rolleri filtrele
      const adminMembers = guild.members.cache.filter(member => member.permissions.has('ADMINISTRATOR')).size;
      const adminRoles = guild.roles.cache.filter(role => role.permissions.has('ADMINISTRATOR')).size;

      // Bilgileri ekleyin
      serverInfo.adminMembers = adminMembers;
      serverInfo.adminRoles = adminRoles;

      return serverInfo;
  });

  res.json(servers);
});


app.post('/textchannelsID', (req, res) => {
    const { serverID } = req.body;

    const guild = client.guilds.cache.get(serverID);
    if (!guild) {
        return res.status(400).send('Guild not found');
    }

    const textChannelData = guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').map(channel => ({
        id: channel.id,
        name: channel.name,
    }));
    res.json(textChannelData);
});

app.post('/messageChannel', (req, res) => {
    const { serverID, textChannelID, textMessage } = req.body;

    const guild = client.guilds.cache.get(serverID);
    if (!guild) {
        return res.status(400).send('Guild not found');
    }

    const channel = guild.channels.cache.get(textChannelID);
    if (!channel || channel.type !== 'GUILD_TEXT') {
        return res.status(400).send('Channel not found or not a text channel');
    }

    channel.send(textMessage).then(() => {
        res.status(200).send('Message sent');
    }).catch(error => {
        res.status(500).send(`An error occurred: ${error.message}`);
    });
});

app.post('/serverAdmins', async (req, res) => {
    const serverID = req.body.serverID;
    const guild = client.guilds.cache.get(serverID);

    if (!guild) {
        return res.status(404).send('Server not found');
    }

    await guild.members.fetch();

    const adminMembers = guild.members.cache.filter(member => member.permissions.has('ADMINISTRATOR'));
    const adminRoles = guild.roles.cache.filter(role => role.permissions.has('ADMINISTRATOR'));

    const adminMembersArray = adminMembers.map(member => ({
        tag: member.user.tag,
        id: member.user.id
    }));

    const adminRolesArray = adminRoles.map(role => ({
        name: role.name,
        id: role.id
    }));

    res.json({
        adminMembers: adminMembersArray,
        adminRoles: adminRolesArray
    });
});

app.post('/voiceChannels', async (req, res) => {
  const serverID = req.body.serverID;

  const guild = client.guilds.cache.get(serverID);

  if (!guild) {
    return res.status(404).send('Server not found');
  }

  // Voice kanallarını filtrele
  const voiceChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE');

  // Voice kanallarının isimlerini ve ID'lerini bir array içinde döndür
  const voiceChannelsArray = voiceChannels.map(async channel => {
    const membersInChannel = channel.members.map(member => ({
      name: member.user.username,
      id: member.id,
      avatarURL: member.user.displayAvatarURL() || client.user.displayAvatarURL() // Kullanıcının profil resmi URL'si veya botun profil resmi URL'si
    }));

    return {
      name: channel.name,
      id: channel.id,
      members: membersInChannel
    };
  });

  // Array'i bekleyen tüm Promise'lar için çöz
  const resolvedVoiceChannels = await Promise.all(voiceChannelsArray);

  res.json(resolvedVoiceChannels);
});


app.post('/musicPlay', async (req, res) => {
  const { serverID, voiceChannelID, musicPlay } = req.body;

  const guild = client.guilds.cache.get(serverID);
  const voiceChannel = guild.channels.cache.get(voiceChannelID);

  if (voiceChannel) {
    connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    player = createAudioPlayer();
    const resource = createAudioResource(ytdl(musicPlay, { filter: 'audioonly' }));
    player.play(resource);
    connection.subscribe(player);

    // Ytdl'yi kullanarak video bilgilerini al
    const videoInfo = await ytdl.getInfo(musicPlay);

    // Responce içinde voiceChannelID'yi ekleyiyoruz
    res.json({
      status: 'Playing',
      title: videoInfo.videoDetails.title, // Video başlığı
      duration: videoInfo.videoDetails.lengthSeconds, // Video uzunluğu saniye cinsinden
      thumbnail: videoInfo.videoDetails.thumbnails[0].url, // Video resminin URL'si
      voiceChannelID: voiceChannelID, 
      serverID:serverID,// voiceChannelID'yi responce içinde aynen gönderiyoruz
    });
  } else {
    res.status(400).send('Invalid Voice Channel ID');
  }
});



app.post('/musicPause', (req, res) => {
  if (player) {
    player.pause();
    res.json({ status: 'Paused' });
  } else {
    res.status(400).send('Player is not active');
  }
});

app.post('/musicResume', (req, res) => {
  if (player) {
    player.unpause();
    res.json({ status: 'Resumed' });
  } else {
    res.status(400).send('Player is not active');
  }
});

app.post('/musicStop', (req, res) => {
  if (player) {
    player.stop();
    res.json({ status: 'Stopped' });
  } else {
    res.status(400).send('Player is not active');
  }
});

app.post('/disconnect', (req, res) => {
  if (connection) {
    connection.destroy();
    res.json({ status: 'Disconnected' });
  } else {
    res.status(400).send('No active connection');
  }
});

app.post('/users', async (req, res) => {
  const { serverID } = req.body;
  const guild = client.guilds.cache.get(serverID);

  if (!guild) {
    return res.status(404).send('Server not found');
  }

  const members = await guild.members.fetch();

  if (!members) {
    return res.status(400).send('No members found in the guild');
  }

  const users = members.map(member => {
    const presence = member.presence ? member.presence.status : 'offline'; // Durumu al, yoksa varsayılan olarak 'offline' kabul edin
    const avatarURL = member.user.displayAvatarURL({ format: 'png', size: 256 }); // Profil resmi URL'si

    // Kullanıcının admin olup olmadığını kontrol et
    const isAdmin = member.permissions.has('ADMINISTRATOR');

    // Kullanıcının sahip olduğu rolleri kontrol et ve rollerin admin olup olmadığını belirle
    const userRoles = member.roles.cache.map(role => ({
      name: role.name,
      isAdminRole: role.permissions.has('ADMINISTRATOR'),
    }));

    return {
      username: member.user.username,
      displayName: member.displayName, // Kullanıcının sunucudaki görünen adı
      id: member.user.id,
      tag: member.user.tag,
      isBot: member.user.bot,
      status: presence, // Kullanıcının durumu (çevrimiçi, rahatsız etmeyin, boşta, çevrimdışı veya başka bir durum)
      avatarURL: avatarURL, // Profil resmi URL'si
      isAdmin: isAdmin, // Kullanıcının admin olup olmama durumu
      roles: userRoles, // Kullanıcının sahip olduğu roller ve her bir rolün admin olup olmama durumu
    };
  });

  res.json(users);
});






app.post('/messageUsers', async (req, res) => {
  const { userID, serverID, message } = req.body;

  // Kullanıcıyı al
  const user = await client.users.fetch(userID, false);

  if (!user) {
    return res.status(404).send('User not found');
  }

  // Sunucuyu al
  const guild = client.guilds.cache.get(serverID);

  if (!guild) {
    return res.status(404).send('Server not found');
  }

  // Kullanıcının sunucuda olup olmadığını kontrol et
  const member = guild.members.cache.get(userID);

  if (!member) {
    return res.status(400).send('User is not a member of the server');
  }

  try {
    // Kullanıcıya mesaj gönder
    await user.send(message);
    res.status(200).send('success');
  } catch (err) {
    res.status(500).send(`An error occurred: ${err.message}`);
  }
});




app.post('/usersStatus', async (req, res) => {
  const { serverID } = req.body;
  const guild = client.guilds.cache.get(serverID);

  if (!guild) {
    return res.status(404).send('Server not found');
  }

  // Kullanıcıları getir
  await guild.members.fetch();
  const members = guild.members.cache;

  if (!members) {
    return res.status(400).send('No members found in the guild');
  }

  // Çevrimiçi kullanıcı sayısını doğrudan hesapla
  const onlineMembers = members.filter(member => member.presence && member.presence.status === 'online').size;
  const dndMembers = members.filter(member => member.presence && member.presence.status === 'dnd').size;
  const idleMembers = members.filter(member => member.presence && member.presence.status === 'idle').size;

  // Toplam kullanıcı sayısını al
  const totalMembers = members.size;

  // Admin yetkisi olan üyeleri ve rolleri filtrele
  const adminMembers = members.filter(member => member.permissions.has('ADMINISTRATOR')).size;
  const adminRoles = guild.roles.cache.filter(role => role.permissions.has('ADMINISTRATOR')).size;

  // Çevrimdışı kullanıcı sayısını hesapla
  const offlineMembers = totalMembers - onlineMembers - dndMembers - idleMembers;

  // Kullanıcıları ve durumlarını içeren bir nesne oluştur
  const usersStatus = {
    totalMembers: totalMembers, // Toplam kullanıcı sayısı
    onlineMembers: onlineMembers, // Çevrimiçi kullanıcı sayısı
    dndMembers: dndMembers, // Rahatsız Etmeyin (DND) durumunda olan kullanıcı sayısı
    idleMembers: idleMembers, // Boşta olan kullanıcı sayısı
    offlineMembers: offlineMembers, // Çevrimdışı kullanıcı sayısı
    adminMembers: adminMembers, // Admin yetkisi olan üyelerin sayısı
    adminRoles: adminRoles, // Admin yetkisi olan rollerin sayısı
  };

  res.json(usersStatus);
});





app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});





