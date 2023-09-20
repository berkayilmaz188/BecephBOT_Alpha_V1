const express = require('express');
const router = express.Router();
const botDataController = require('../controllers/botDataController');

router.get('/BekoBOTServers', botDataController.getBekoBOTServers);
router.post('/textchannels', botDataController.getTextChannelsID);
router.post('/voiceChannels', botDataController.getVoiceChannels);
router.post('/users', botDataController.getServerUsers);
router.post('/usersStatus', botDataController.getServerUsersStatus);
router.post('/serverAdmins', botDataController.getServerAdmins);

module.exports = router;
