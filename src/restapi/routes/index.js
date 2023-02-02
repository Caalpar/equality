const express = require('express');
const router = express.Router();

router.use('/wallet', require('./wallet.js'));
router.use('/transaction', require('./transaction.js'));
router.use('/blockChain', require('./blockChain.js'));






module.exports = router;