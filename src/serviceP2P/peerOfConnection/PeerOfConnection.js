const ConnectNodes = require("../connect_nodes/CennectNodes.js")
const Mainpool = require("../../mainpool/Mainpool")

class PeerOfConnection{
    constructor(){

        this.quaque = []

        // patron sigleton
        if (typeof PeerOfConnection.instance == "object") {
            return PeerOfConnection.instance
        }
        PeerOfConnection.instance = this
        return this
    }

    addTrasactions(transactions,timestamp)
    {
        result = true
        if(ConnectNodes.instance.timestamp > timestamp)
        {
            for (let index = 0; index < transactions.length; index++) {
                const transaction = transactions[index];
        
                result = Mainpool.instance.addOrUpdate(transaction,true)
                if(!result){
                    return false
                }
            }
        }
        return result
    }


    addQuaque(id,timestamp){

        if(!this.verifyTimeStamp(timestamp))
            return false

        this.quaque.push({id,timestamp})
        this.sortQuaque()

        return true
    }

    updateQuaque(id,timestamp){


        if(!this.verifyTimeStamp(timestamp))
            return false

        let index_miner = this.quaque.findIndex(m=>m.id == id)

        if(index == -1)
            return false

        let miner = this.quaque[index_miner]
        this.quaque.splice(index_miner,miner)
        miner.timestamp = timestamp
        this.quaque.push(miner)
        this.sortQuaque()
        return true
    }

    sortQuaque(){
        this.quaque.sort((a,b)=>{
            if(a.timestamp>b.timestamp)
                return -1
            else if(a.timestamp>b.timestamp)
                return 1
            else
                return 0
            
        })  
    }

    verifyTimeStamp(timestamp){
        return (Date.now() - timestamp) < 600000
    }
    
}

module.exports = PeerOfConnection