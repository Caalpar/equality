const Wallet = require("../wallet/Wallet")



class Transactions
{
    constructor(privateKeySender,publicKeyRecive,amount){
        this.Wallet = new Wallet(privateKeySender)
        this.outputs = []
        this.input = this.Wallet.PublicKey
        this.signature = ''
        this.addTransaction(publicKeyRecive,amount)
    }

    addTransaction(publicKeyRecive,amount)
    {
        this.outputs.push({
            amount,
            address:publicKeyRecive
        })
        this.sign()
    }

    sign(){
        this.signature = this.Wallet.sign({input:this.input,outputs:this.outputs})
    }
    
    static verify(input,outputs,signature)
    {
       return Wallet.verify({input,outputs},input,signature)
    }
}
module.exports = Transactions