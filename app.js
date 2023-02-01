const Mainpool = require("./src/mainpool/Mainpool");
const Transaction = require("./src/transaction/Transaction");
const Wallet = require("./src/wallet/Wallet");


const wallet1 = new Wallet()
const wallet2 = new Wallet()
const wallet3 = new Wallet()

const mainpool =  new Mainpool()


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


console.log(mainpool.blockchain)