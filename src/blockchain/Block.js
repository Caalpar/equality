
const {createHash} = require('crypto');
  
class Block{
    constructor(timestamp, previousHash, hash, data) {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = hash;
        this.data = data;
      }

    static get genesis() {
        const timestamp = (new Date(2000, 0, 1)).getTime();
        let trasaction = {
          id: '472e829f-a067-4748-84fb-8853ea04b176',
          outputs: [
            {
              amount: 1.7976931348623157e+308,
              address: '3056301006072a8648ce3d020106052b8104000a03420004098a8cbf258c126c39fa761e0eae529a783235669874115132926ea5670249df291be2346c8e8bec7eec53344fa76b96b3eceb35855089f831b01b1399308e9c',
              fee: 0.5
            }
          ],
          input: '3056301006072a8648ce3d020106052b8104000a03420004098a8cbf258c126c39fa761e0eae529a783235669874115132926ea5670249df291be2346c8e8bec7eec53344fa76b96b3eceb35855089f831b01b1399308e9c',
          signature: '304402204371aa9ebef88370209cab328e020b44b57d2234261ef9152cc400eb6884faa402202eb44201e080c2f0c65c15e810a5597ed139c624554a3a7a21352cf963ac9873'
        }
        return new this(timestamp,undefined, 'g3n3s1s-h4sh',[trasaction]);
    }

    static mine(previousBlock,data){
        const previousHash = previousBlock.hash
        const timestamp = Date.now()
        const hash = createHash('sha256').update(JSON.stringify({previousHash,timestamp,data})).digest('hex')
        return new this(timestamp,previousHash, hash,data);
    }

}

module.exports = Block