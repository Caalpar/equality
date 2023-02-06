const express = require('express');
const router = express.Router();

router.use('/wallet', require('./wallet.js'));
router.use('/transaction', require('./transaction.js'));
router.use('/blockChain', require('./blockChain.js'));
router.use('/nodes', require('./nodes.js'));






module.exports = router;