const BlockChain = require("../blockchain/BlockChain");
const Transaction = require("../transaction/Transaction");
const customEvent = require('../events/events.js');




class Mainpool{
    static instance = undefined

    constructor(numTransactions = 5) {
            // patron sigleton
        if (typeof Mainpool.instance == "object") {
            return Mainpool.instance
        }

      customEvent.on('new-transaction',(data)=>{
          const {id,input,outputs,signature} = data.data
          Mainpool.instance.addOrUpdate({id,input,outputs,signature},true)
      })
      
        this.transactions = [];
        this.numTransactions = numTransactions
        this.blockchain = new BlockChain()
        
        Mainpool.instance = this
        return this
    }

    addOrUpdate(transaction,remote=false) {

      const {id,input,outputs,signature} = transaction
      if(Transaction.verify(input,outputs,signature)){
        const txIndex = this.transactions.findIndex(t => t.id == id);
        if (txIndex != -1) this.transactions[txIndex] = {id,input,outputs,signature};
        else this.transactions.push({id,input,outputs,signature});


        // send new transaction to all nodes
        if(!remote)
            customEvent.emit('new-transaction-brodcast',transaction)

        if(this.transactions.length == this.numTransactions)
        {

          //logica de node que le toca minar
          let reward = new Transaction(process.env.PRIVATE_KEY,process.env.PUBLIC_KEY,50,0,true)
          this.transactions.push(reward)

          BlockChain.instance.addBlock(this.transactions)
          this.wipe()
        }
        return true
      }
      return false
    }



    
  find(address) {
    return this.transactions.find(({ input }) => input.address === address);
  }

    wipe() {
        this.transactions = [];
      }

}
module.exports = Mainpool