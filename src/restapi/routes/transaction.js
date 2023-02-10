const express = require('express');
const { get } = require('http');
const Mainpool = require('../../mainpool/Mainpool');
const Transaction = require('../../transaction/Transaction');
const router = express.Router();


router.get('/pending',(req,res)=>{
    const transactions = Mainpool.instance.transactions
    res.json({transactions})
}) 

router.get('/:_id',(req,res)=>{
    const {publicKey} = req.params
    const transaction = Mainpool.instance.find(publicKey)
    res.json({transaction})
}) 

router.post('/',(req,res)=>{

    let {input,outputs} = req.body

    let fee = 0.5

    if(req.body.outputs[0].fee)
    {
        fee = req.body.outputs[0].fee
    }

   let transaction = new Transaction(input,outputs[0].address,outputs[0].amount,fee)

    if(outputs.length>1)
    {
        for (let index = 1; index < outputs.length; index++) {
         const {address,fee=0.5,amount} = outputs[index];
         transaction.addTransaction(address,amount,fee)
        }
    }

   Mainpool.instance.addOrUpdate(transaction)

    res.json({transaction})

})


module.exports = router;