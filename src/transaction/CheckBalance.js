const BlockChain = require("../blockchain/BlockChain.js")

const CheckBalance = (publicKey = '') => {
    let balance = 0
    const { instance: { blocks } } = BlockChain

    for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
        const { data } = blocks[blockIdx];
        
        for (let txIdx = 0; txIdx < data.length; txIdx++) {
            const { input, outputs } = data[txIdx];
            let txFeeTotal = 0;

            for (let outIdx = 0; outIdx < outputs.length; outIdx++) {
                const out = outputs[outIdx];

                if (input === publicKey) {
                    // Si es el remitente
                    if (out.address === publicKey) {
                        balance += out.amount
                    } else {
                        balance -= out.amount
                    }
                   
                    txFeeTotal += (out.fee || 0);
                } else if (out.address === publicKey) {
                    // Si es destinatario
                    balance += out.amount
                }
            }

            // Restar fee una sola vez si es remitente
            if (input === publicKey) {
                balance -= txFeeTotal;
            }
        }
    }

    return balance
}

module.exports = {
    CheckBalance
}