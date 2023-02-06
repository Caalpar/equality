const express = require('express');
const ConnectNodes = require('../../serviceP2P/connect_nodes/CennectNodes');
const router = express.Router();


router.get('/',(req,res)=>{
   res.json({nodes:ConnectNodes.instance.nodes} )
}) 
router.get('/hosts',(req,res)=>{
   res.json({nodes:ConnectNodes.instance.hosts} )
}) 

module.exports = router;