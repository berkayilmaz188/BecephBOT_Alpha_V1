const express = require('express');
const router = express.Router();
const botMessageController = require('../controllers/botMessageController');


router.post('/messageChannel', botMessageController.getSendMessageChannels);
router.post('/messageUsers', botMessageController.getSendMessageUser);

module.exports = router;