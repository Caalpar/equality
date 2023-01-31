const Block = require("./Block");

class BlockChain {
    static instance
    constructor() {
        this.blocks = [Block.genesis];
       // this.memoryPool = new MemoryPool();
        
       // patron sigleton
        if (typeof BlockChain.instance == "object") {
            return BlockChain.instance
        }
        BlockChain.instance = this
        return this
    }

      addBlock(data) {
        const previousBlock = this.blocks[this.blocks.length - 1];
        const block = Block.mine(previousBlock, data);
    
        this.blocks.push(block);
    
        return block;
      }
}
module.exports = BlockChain