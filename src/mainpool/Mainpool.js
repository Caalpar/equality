const BlockChain = require("../blockchain/BlockChain");
const Transaction = require("../transaction/Transaction");




class Mainpool{
    static instance = undefined

    constructor(numTransactions = 3) {
            // patron sigleton
        if (typeof Mainpool.instance == "object") {
            return Mainpool.instance
        }
      
        this.transactions = [];
        this.numTransactions = numTransactions
        this.blockchain = new BlockChain()
        
        Mainpool.instance = this
        return this
    }

    addOrUpdate(transaction) {

      const {input,outputs,signature} = transaction
      if(Transaction.verify(input,outputs,signature)){
        const txIndex = this.transactions.findIndex(({ id }) => id === transaction.id);
        if (txIndex != -1) this.transactions[txIndex] = transaction;
        else this.transactions.push(transaction);
        if(this.transactions.length == this.numTransactions)
        {

          //logica de node que le toca minar
          let reward = new Transaction(process.env.PRIVATE_KEY,process.env.PUBLIC_KEY,50,0,true)
          this.transactions.push(reward)

          BlockChain.instance.addBlock(this.transactions)
          this.wipe()
        }
      }
    }



    
  find(address) {
    return this.transactions.find(({ input }) => input.address === address);
  }

    wipe() {
        this.transactions = [];
      }

}
module.exports = Mainpool