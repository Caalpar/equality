require('dotenv').config();


const ServerP2P = require("./src/serviceP2P/server/Server.js")
const Server = require('./src/restapi/server');
const ConnectNodes = require('./src/serviceP2P/connect_nodes/CennectNodes.js');

// instancia sigleton
const nodesToConnect = new ConnectNodes()



const server = new Server()
const serverp2p =new ServerP2P(process.env.PORT_P2P)


server.listen()
serverp2p.listen()

//if(process.env.PORT_P2P_SERVER != 4001)


 setInterval(() => {
    serverp2p.brodcast('test','hola desde:'+process.env.PORT_P2P)
}, 1000);

// const Mainpool = require("./src/mainpool/Mainpool");
// const Transaction = require("./src/transaction/Transaction");
// const Wallet = require("./src/wallet/Wallet");



// const mainpool =  new Mainpool()


// try {

    
// const wallet1 = new Wallet()
// const wallet2 = new Wallet()
// const wallet3 = new Wallet()

// mainpool.addOrUpdate(new Transaction(process.env.PRIVATE_KEY,wallet1.publicKey,1000))
// mainpool.addOrUpdate(new Transaction(process.env.PRIVATE_KEY,wallet2.publicKey,1000))
// mainpool.addOrUpdate(new Transaction(process.env.PRIVATE_KEY,wallet3.publicKey,1000))


// let tran1 = new Transaction(wallet1.PrivateKey,wallet2.publicKey,10) //1000-40 -2
// let tran2 = new Transaction(wallet3.PrivateKey,wallet2.publicKey,20)  //1000 80 -2
// let tran3 = new Transaction(wallet2.PrivateKey,wallet3.publicKey,40)  

// console.log({wallet1})
// console.log({wallet2})
// console.log({wallet3})

// mainpool.addOrUpdate(tran1)
// mainpool.addOrUpdate(tran2)
// mainpool.addOrUpdate(tran3)

// mainpool.addOrUpdate(tran1)
// mainpool.addOrUpdate(tran2)
// mainpool.addOrUpdate(tran3)

// mainpool.addOrUpdate(tran1)
// mainpool.addOrUpdate(tran2)
// mainpool.addOrUpdate(tran3)

// mainpool.addOrUpdate(tran1)
// mainpool.addOrUpdate(tran2)
// mainpool.addOrUpdate(tran3)


// } catch (error) {
//     console.log(error)
// }



//  console.log(JSON.stringify(mainpool.blockchain,null,2))