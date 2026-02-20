const Wallet = require("../wallet/Wallet")
const { v4: uuidv4 } = require('uuid')
const { CheckBalance } = require("./CheckBalance")

class Transaction {
    #Wallet
    
    constructor(privateKeySender, publicKeyRecive, amount, fee = 0.5, reward = false) {
        this.id = uuidv4()
        this.#Wallet = new Wallet(privateKeySender)
        this.outputs = []
        this.input = this.#Wallet.PublicKey
        this.signature = ''
        this.addTransaction(publicKeyRecive, amount, fee, reward)
    }

    addTransaction(publicKeyRecive, amount, fee, reward) {
        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error('Amount debe ser un número positivo')
        }
        if (typeof fee !== 'number' || fee < 0) {
            throw new Error('Fee debe ser un número no negativo')
        }

        let balance = CheckBalance(this.#Wallet.PublicKey)
        let total_pay = amount + fee

        if (!reward && (balance <= 0 || balance < total_pay)) {
            throw new Error('Balance insuficiente')
        }

        this.outputs.push({
            amount,
            address: publicKeyRecive,
            fee
        })

        this.sign()
    }

    sign() {
        this.signature = this.#Wallet.sign({ input: this.input, outputs: this.outputs })
    }

    static verify(input, outputs, signature) {
        return Wallet.verify({ input, outputs }, input, signature)
    }
}

module.exports = Transaction