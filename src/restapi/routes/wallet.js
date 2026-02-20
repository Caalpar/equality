const express = require('express');
const { CheckBalance } = require('../../transaction/CheckBalance');
const Wallet = require('../../wallet/Wallet');
const router = express.Router();

router.get('/', (req, res) => {
    let wallet = new Wallet()
    // ⚠️ NUNCA enviar privateKey en respuesta
    res.json({
        wallet: {
            publicKey: wallet.PublicKey
        }
    })
})

router.post('/balance', (req, res) => {
    const { publicKey } = req.body
    
    if (!publicKey || typeof publicKey !== 'string') {
        return res.status(400).json({ error: 'publicKey requerido y debe ser string' })
    }
    
    const balance = CheckBalance(publicKey)
    res.json({ balance })
})

module.exports = router;