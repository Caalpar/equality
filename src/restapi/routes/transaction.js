const express = require('express');
const Mainpool = require('../../mainpool/Mainpool');
const Transaction = require('../../transaction/Transaction');
const router = express.Router();

router.get('/pending', (req, res) => {
    const transactions = Mainpool.instance.transactions
    res.json({ transactions })
})

router.get('/:publicKey', (req, res) => {
    const { publicKey } = req.params
    const transaction = Mainpool.instance.find(publicKey)
    res.json({ transaction })
})

// ⚠️ CAMBIO: Aceptar SOLO transacciones ya firmadas
// El cliente debe firmar en su máquina y enviar: { id, input, outputs, signature }
router.post('/', (req, res) => {
    try {
        const { id, input, outputs, signature } = req.body

        // Validar estructura
        if (!id || !input || !Array.isArray(outputs) || !signature) {
            return res.status(400).json({ 
                error: 'Estructura inválida. Requerido: { id, input, outputs, signature }' 
            })
        }

        // Validar outputs
        if (outputs.length === 0) {
            return res.status(400).json({ error: 'Debe tener al menos un output' })
        }

        for (const out of outputs) {
            if (typeof out.amount !== 'number' || out.amount <= 0) {
                return res.status(400).json({ error: 'amounts deben ser positivos' })
            }
            if (!out.address || typeof out.address !== 'string') {
                return res.status(400).json({ error: 'address requerido en cada output' })
            }
        }

        // Validar firma
        if (!Transaction.verify(input, outputs, signature)) {
            return res.status(401).json({ error: 'Firma inválida o datos alterados' })
        }

        // Crear objeto transacción validada
        const transaction = { id, input, outputs, signature }

        // Añadir a mempool
        if (!Mainpool.instance.addOrUpdate(transaction, false)) {
            return res.status(400).json({ error: 'Transacción rechazada por mempool' })
        }

        res.json({ transaction, success: true })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;