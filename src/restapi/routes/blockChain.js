const express = require('express');
const BlockChain = require('../../blockchain/BlockChain');
const router = express.Router();


router.get('/',(req,res)=>{
    res.json({blockChain:BlockChain.instance.blocks})
}) 


module.exports = router;