const client = require('../utils/botClient.js');

exports.getSendMessageChannels = (req, res) => {
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
}
  
exports.getSendMessageUser = async (req, res) => {
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
}