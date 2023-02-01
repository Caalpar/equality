const BlockChain = require("../blockchain/BlockChain");
const Transaction = require("../transaction/Transaction");




class Mainpool{
    static instance

    constructor(numTransactions = 3) {
        this.transactions = [];
        this.numTransactions = numTransactions
        this.blockchain = new BlockChain()

               // patron sigleton
            if (typeof Mainpool.instance == "object") {
                return Mainpool.instance
            }
            Mainpool.instance = this
            return this
    }

    addOrUpdate(transaction) {
      const txIndex = this.transactions.findIndex(({ id }) => id === transaction.id);
      if (txIndex != -1) this.transactions[txIndex] = transaction;
      else this.transactions.push(transaction);
      if(this.transactions.length == this.numTransactions)
      {
        BlockChain.instance.addBlock(this.transactions)
        this.wipe()
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