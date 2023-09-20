const client = require('../utils/botClient.js');

exports.getBekoBOTServers = (req, res) => {
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

    serverInfo.adminMembers = adminMembers;
    serverInfo.adminRoles = adminRoles;

    return serverInfo;
  });

  // Toplanan sunucu bilgilerini HTTP yanıtı olarak geri gönder
  res.json(servers);
}

exports.getTextChannelsID = (req, res) => {
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
}

exports.getVoiceChannels = async (req, res) => {
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
}

exports.getServerUsers = async (req, res) => {
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
}

exports.getServerUsersStatus = async (req, res) => {
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
}

exports.getServerAdmins = async (req, res) => {
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
}