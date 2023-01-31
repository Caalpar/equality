const Wallet = require("./src/wallet/Wallet");

const Transactions = require("./src/transaction/Transactions");

// let wallet = new Wallet()
// let wallet2 = new Wallet()


// console.log('wallet 1 pirvate:',wallet.PrivateKey)
// console.log('wallet 1 public:',wallet.PublicKey)
// console.log('---------------------------------')
// console.log('wallet 2 pirvate:',wallet2.PrivateKey)
// console.log('wallet 2 public:',wallet2.PublicKey)
// console.log('---------------SIGNATURE-VERIFY-----------------')

// let signature1 = wallet.sign({msg:'some any data'})
// let valid1 = wallet2.verify({msg:'some any data'},signature1)

// let signature2 = wallet2.sign({msg:'some any data2'})
// let valid2 = wallet.verify({msg:'some any data2'},signature2)

// let signature3 = Wallet.sign({msg:'some any data2'},wallet.PrivateKey)
// let valid3 = Wallet.verify({msg:'some any data2'},wallet.PublicKey,signature3)

// console.log('signature1',signature1)
// console.log('valid1',valid1)
// console.log('---------------------------------')
// console.log('signature2',signature2)
// console.log('valid2',valid2)
// console.log('---------------------------------')
// console.log('signature2',signature3)
// console.log('valid2',valid3)


//wallet 1 pirvate: 30740201010420992a77e189feae4294d3e18429eee0bf8525de22ca22aa8a6436fd6bd7254561a00706052b8104000aa144034200044cce4fb2668bbaa8442bfbc5dccdea808aa4645d6070264bb810a29d9f13ac6ba9976e93770abb287a619efdc68edbee69873ce959bfc892cf3b4f7959baa238
//wallet 1 public: 3056301006072a8648ce3d020106052b8104000a034200044cce4fb2668bbaa8442bfbc5dccdea808aa4645d6070264bb810a29d9f13ac6ba9976e93770abb287a619efdc68edbee69873ce959bfc892cf3b4f7959baa238
//---------------------------------
//wallet 2 pirvate: 3074020101042098ab12ee2dadb9fcdd7859922f42641c8ae80999317e378ba8c1ae15a246a4aaa00706052b8104000aa14403420004e154a93e2892b0955a9a1d953bf977c269963fdfce1646b39b515389d06cdde49a0d172144a98e483b0a0c1dbb92ea4050177d05624d8adf0ab0c21e057df6d7
//wallet 2 public: 3056301006072a8648ce3d020106052b8104000a03420004e154a93e2892b0955a9a1d953bf977c269963fdfce1646b39b515389d06cdde49a0d172144a98e483b0a0c1dbb92ea4050177d05624d8adf0ab0c21e057df6d7

const privateKey1 = '30740201010420992a77e189feae4294d3e18429eee0bf8525de22ca22aa8a6436fd6bd7254561a00706052b8104000aa144034200044cce4fb2668bbaa8442bfbc5dccdea808aa4645d6070264bb810a29d9f13ac6ba9976e93770abb287a619efdc68edbee69873ce959bfc892cf3b4f7959baa238'
const publicKey1 = '3056301006072a8648ce3d020106052b8104000a034200044cce4fb2668bbaa8442bfbc5dccdea808aa4645d6070264bb810a29d9f13ac6ba9976e93770abb287a619efdc68edbee69873ce959bfc892cf3b4f7959baa238'

const privateKey2 = '3074020101042098ab12ee2dadb9fcdd7859922f42641c8ae80999317e378ba8c1ae15a246a4aaa00706052b8104000aa14403420004e154a93e2892b0955a9a1d953bf977c269963fdfce1646b39b515389d06cdde49a0d172144a98e483b0a0c1dbb92ea4050177d05624d8adf0ab0c21e057df6d7'
const publickey2 = '3056301006072a8648ce3d020106052b8104000a03420004e154a93e2892b0955a9a1d953bf977c269963fdfce1646b39b515389d06cdde49a0d172144a98e483b0a0c1dbb92ea4050177d05624d8adf0ab0c21e057df6d7'

let transaction =  new Transactions(privateKey1,publickey2,10)

console.log(transaction.signature)
transaction.addTransaction(publickey2,20)


const {input,outputs,signature} = transaction

console.log('aca',Transactions.verify(input,outputs,signature))
