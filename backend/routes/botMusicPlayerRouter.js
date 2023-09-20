const express = require('express');
const router = express.Router();
const botMusicPlayerController = require('../controllers/botMusicPlayerController');

router.post('/musicPlay', botMusicPlayerController.getMusicPlay);
router.post('/musicPause', botMusicPlayerController.getMusicPause);
router.post('/musicResume', botMusicPlayerController.getMusicResume);
router.post('/musicStop', botMusicPlayerController.getMusicStop);
router.post('/musicDisconnect', botMusicPlayerController.getDisconnect);

module.exports = router;