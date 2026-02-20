const BlockChain = require("../blockchain/BlockChain");
const Transaction = require("../transaction/Transaction");
const customEvent = require('../events/events.js');

class Mainpool {
    static instance = undefined

    constructor(numTransactions = 5) {
        if (typeof Mainpool.instance == "object") {
            return Mainpool.instance
        }

        customEvent.on('new-transaction', (data) => {
            const { id, input, outputs, signature } = data.data
            Mainpool.instance.addOrUpdate({ id, input, outputs, signature }, true)
        })

        this.transactions = [];
        this.numTransactions = numTransactions
        this.blockchain = new BlockChain()

        Mainpool.instance = this
        return this
    }

    addOrUpdate(transaction, remote = false) {
        try {
            const { id, input, outputs, signature } = transaction
            
            // Validar estructura
            if (!id || !input || !Array.isArray(outputs) || !signature) {
                console.error('Estructura de transacción inválida')
                return false
            }

            // Validar firma
            if (!Transaction.verify(input, outputs, signature)) {
                console.error(`Transacción ${id} tiene firma inválida`)
                return false
            }

            // Verificar que no sea doble gasto: todos los outputs deben sumar menos al balance disponible
            let totalOutgoing = 0;
            for (const out of outputs) {
                totalOutgoing += (out.amount || 0) + (out.fee || 0);
            }

            const { CheckBalance } = require("../transaction/CheckBalance");
            const balance = CheckBalance(input);
            if (balance < totalOutgoing && !this.isRewardTransaction(transaction)) {
                console.error(`Intento de doble gasto: balance=${balance}, requerido=${totalOutgoing}`)
                return false
            }

            // Actualizar o añadir
            const txIndex = this.transactions.findIndex(t => t.id == id);
            if (txIndex != -1) {
                this.transactions[txIndex] = { id, input, outputs, signature };
            } else {
                this.transactions.push({ id, input, outputs, signature });
            }

            // Broadcast si es local
            if (!remote) {
                customEvent.emit('new-transaction-brodcast', transaction)
            }

            // Minar bloque cuando se alcanza el límite
            if (this.transactions.length >= this.numTransactions) {
                this.mineBlock();
            }
            
            return true
        } catch (error) {
            console.error('Error en addOrUpdate:', error.message)
            return false
        }
    }

    isRewardTransaction(transaction) {
        // Un reward no tiene inputs de usuario válidos o input es un address especial
        return transaction.input === process.env.PUBLIC_KEY
    }

    mineBlock() {
        try {
            const { v4: uuidv4 } = require('uuid');
            
            // Crear transaction de recompensa (block reward)
            const reward = {
                id: uuidv4(),
                input: process.env.PUBLIC_KEY || 'system-reward',
                outputs: [{
                    amount: 50,
                    address: process.env.PUBLIC_KEY || 'system-reward',
                    fee: 0
                }],
                signature: 'reward-signature'
            }
            
            // Una copia local del array para minar
            const blockData = [...this.transactions, reward];
            
            // Añadir bloque al blockchain
            this.blockchain.addBlock(blockData)
            console.log(`Bloque minado con ${blockData.length} transacciones`)
            
            // Limpiar mempool
            this.wipe()
        } catch (error) {
            console.error('Error minando bloque:', error.message)
        }
    }

    find(address) {
        return this.transactions.find(({ input }) => input === address);
    }

    wipe() {
        this.transactions = [];
    }
}

module.exports = Mainpool