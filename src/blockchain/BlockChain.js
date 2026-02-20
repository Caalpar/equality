const Block = require("./Block");

class BlockChain {
    static instance
    
    constructor() {
        this.blocks = [Block.genesis];

        // Patrón singleton
        if (typeof BlockChain.instance == "object") {
            return BlockChain.instance
        }
        BlockChain.instance = this
        return this
    }

    addBlock(data) {
        const previousBlock = this.blocks[this.blocks.length - 1];
        const block = Block.mine(previousBlock, data);

        // Verificar integridad del bloque
        if (!this.verifyBlock(block, previousBlock)) {
            throw new Error('Bloque inválido: No pasa verificación de integridad')
        }

        this.blocks.push(block);
        console.log(`Bloque añadido: ${block.hash}`)

        return block;
    }

    verifyBlock(block, previousBlock) {
        // Verificar que el hash anterior es correcto
        if (block.previousHash !== previousBlock.hash) {
            return false
        }

        // Verificar que el hash actual es correcto
        const { createHash } = require('crypto');
        const expectedHash = createHash('sha256')
            .update(JSON.stringify({
                previousHash: block.previousHash,
                timestamp: block.timestamp,
                data: block.data
            }))
            .digest('hex');

        return block.hash === expectedHash;
    }

    verifyChain() {
        for (let i = 1; i < this.blocks.length; i++) {
            if (!this.verifyBlock(this.blocks[i], this.blocks[i - 1])) {
                return false
            }
        }
        return true
    }
}

module.exports = BlockChain