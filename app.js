require('dotenv').config();

const Mainpool = require("./src/mainpool/Mainpool");
const Transaction = require("./src/transaction/Transaction");
const Wallet = require("./src/wallet/Wallet");

const mainpool =  new Mainpool()


try {

    
const wallet1 = new Wallet()
const wallet2 = new Wallet()
const wallet3 = new Wallet()

mainpool.addOrUpdate(new Transaction(process.env.PRIVATE_KEY,wallet1.publicKey,1000))
mainpool.addOrUpdate(new Transaction(process.env.PRIVATE_KEY,wallet2.publicKey,1000))
mainpool.addOrUpdate(new Transaction(process.env.PRIVATE_KEY,wallet3.publicKey,1000))

mainpool.addOrUpdate(new Transaction(process.env.PRIVATE_KEY,wallet1.publicKey,1000))
mainpool.addOrUpdate(new Transaction(process.env.PRIVATE_KEY,wallet2.publicKey,1000))
mainpool.addOrUpdate(new Transaction(process.env.PRIVATE_KEY,wallet3.publicKey,1000))

let tran1 = new Transaction(wallet1.PrivateKey,wallet2.publicKey,10)
let tran2 = new Transaction(wallet1.PrivateKey,wallet2.publicKey,10)
let tran3 = new Transaction(wallet1.PrivateKey,wallet2.publicKey,10)

mainpool.addOrUpdate(tran1)
mainpool.addOrUpdate(tran2)
mainpool.addOrUpdate(tran3)

mainpool.addOrUpdate(tran1)
mainpool.addOrUpdate(tran2)
mainpool.addOrUpdate(tran3)

mainpool.addOrUpdate(tran1)
mainpool.addOrUpdate(tran2)
mainpool.addOrUpdate(tran3)

mainpool.addOrUpdate(tran1)
mainpool.addOrUpdate(tran2)
mainpool.addOrUpdate(tran3)


} catch (error) {
    console.log(error)
}



 console.log(JSON.stringify(mainpool.blockchain,null,2))