const client = require('../utils/botClient.js');

const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

exports.getMusicPlay = async (req, res) => {
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

      // Buraya hata yönetimini ekliyoruz.
      player.on('error', (error) => {
          console.error(`Error in player: ${error.stack}`);
      });

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
}


  
exports.getMusicPause = async (req, res) => {
    if (player) {
        player.pause();
        res.json({ status: 'Paused' });
    } else {
        res.status(400).send('Player is not active');
    }
}

exports.getMusicResume = async (req, res) => {
    if (player) {
        player.unpause();
        res.json({ status: 'Resumed' });
    } else {
        res.status(400).send('Player is not active');
    }
}

exports.getMusicStop = async (req, res) => {
    if (player) {
        player.stop();
        res.json({ status: 'Stopped' });
    } else {
        res.status(400).send('Player is not active');
    }
}

exports.getDisconnect = async (req, res) => {
    if (connection) {
        connection.destroy();
        res.json({ status: 'Disconnected' });
    } else {
        res.status(400).send('No active connection');
    }
}