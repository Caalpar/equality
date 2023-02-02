const BlockChain = require("../blockchain/BlockChain.js")


const CheckBalance = (publicKey='')=>{

      let balance = 0

       const {instance:{blocks}} = BlockChain

        for (let index = 0; index < blocks.length; index++) {
            const {data} = blocks[index];
        
            for (let index = 0; index < data.length; index++) {
                const {input,outputs} = data[index];

                for (let index = 0; index < outputs.length; index++) {
                   
                    const out = outputs[index];
        
                    if(input == publicKey)
                    {
                        if(out.address == publicKey)
                            balance += out.amount     
                        else
                            balance -= out.amount
                        
                        balance -= out.fee
                    } 
                    else  if(out.address == publicKey)     
                        balance += out.amount
                    
                }
                
            }

        }

        return balance
}



module.exports = {
    CheckBalance
}