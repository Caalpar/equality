
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
            outputs: [
              {
                amount: 1.7976931348623157e+308,
                address: '3056301006072a8648ce3d020106052b8104000a03420004098a8cbf258c126c39fa761e0eae529a783235669874115132926ea5670249df291be2346c8e8bec7eec53344fa76b96b3eceb35855089f831b01b1399308e9c'
              }
            ],
            input: '3056301006072a8648ce3d020106052b8104000a03420004098a8cbf258c126c39fa761e0eae529a783235669874115132926ea5670249df291be2346c8e8bec7eec53344fa76b96b3eceb35855089f831b01b1399308e9c',
            signature: '3045022100ed03236e0147b26d7eafa8f2b6c711549048e49778dc72b58c66254f8db7f84002203b2b989c8ca835eea3ec9545d97fda256878f6adcc7e45859828c0751e10d505'
          }
        return new this(timestamp,undefined, 'g3n3s1s-h4sh',[trasaction]);
    }

    static mine(previousBlock,data){
        const previousHash = previousBlock.hash
        const timestamp = Date.now()
        const hash = createHash('sha256').update(JSON.stringify({previousHash,timestamp,data})).digest('hex')
        console.log(hash);
        return new this(timestamp,previousHash, hash,data);
    }

}

module.exports = Block