const Wallet = require("./src/wallet/Wallet");

let wallet = new Wallet()
let wallet2 = new Wallet()


console.log('wallet 1 pirvate:',wallet.PrivateKey)
console.log('wallet 1 public:',wallet.PublicKey)
console.log('---------------------------------')
console.log('wallet 2 pirvate:',wallet2.PrivateKey)
console.log('wallet 2 public:',wallet2.PublicKey)
console.log('---------------SIGNATURE-VERIFY-----------------')

let signature1 = wallet.sign({msg:'some any data'})
let valid1 = wallet2.verify({msg:'some any data'},signature1)

let signature2 = wallet2.sign({msg:'some any data2'})
let valid2 = wallet.verify({msg:'some any data2'},signature2)

let signature3 = Wallet.sign({msg:'some any data2'},wallet.PrivateKey)
let valid3 = Wallet.verify({msg:'some any data2'},wallet.PublicKey,signature3)

console.log('signature1',signature1)
console.log('valid1',valid1)
console.log('---------------------------------')
console.log('signature2',signature2)
console.log('valid2',valid2)
console.log('---------------------------------')
console.log('signature2',signature3)
console.log('valid2',valid3)
