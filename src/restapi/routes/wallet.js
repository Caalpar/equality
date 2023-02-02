const express = require('express');
const { CheckBalance } = require('../../transaction/CheckBalance');
const Wallet = require('../../wallet/Wallet');
const router = express.Router();


router.get('/',(req,res)=>{
    let wallet = new Wallet()
    res.json({wallet})
}) 
router.post('/balance',(req,res)=>{
    const {publicKey} = req.body
    const balance = CheckBalance(publicKey)
    res.json({balance})
})

module.exports = router;