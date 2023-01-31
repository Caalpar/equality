const {createSign,createVerify,createECDH,createPrivateKey,createPublicKey,generateKeyPairSync} = require('crypto');


class Wallet
{
    constructor(key = '')
    {
        this.privateKey 
        this.publicKey
        this.ecdh = createECDH('secp256k1');

        if(key==''){

            const {privateKey,publicKey} =generateKeyPairSync('ec',
                {
                    namedCurve:'secp256k1',
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'der',
                    },
                    privateKeyEncoding: {
                        type: 'sec1',
                        format: 'der',
                    },
                })

            this.privateKey = privateKey.toString('hex')
            this.publicKey = publicKey.toString('hex')
        }
        else
        {

            const privateKey = createPrivateKey({
                key:key,
                type: 'sec1',
                format: 'der',
                encoding: 'hex'
            })

            const publicKey = createPublicKey(privateKey)

            this.privateKey = privateKey.export({
                type: 'sec1',
                format: 'der',
            }).toString('hex')
            this.publicKey = publicKey.export({
                type: 'spki',
                format: 'der',
            }).toString('hex')
        }   
    }

    static sign(data,privateKey)
    {
        const key = createPrivateKey({
            'key': privateKey,
            type: 'sec1',
            format: 'der',
            encoding: 'hex'
        });
        const sign = createSign('SHA256');
        sign.write(JSON.stringify(data));
        sign.end();
        return sign.sign(key, 'hex');
    }

    static verify(data,publicKey,signature){

        const key = createPublicKey({
            key: publicKey,
            type: 'spki',
            format: 'der',
            encoding: 'hex'
        });

        const verify = createVerify('SHA256');
        verify.write(JSON.stringify(data));
        verify.end();
        return verify.verify(key, signature, 'hex');
    }

    sign(data)
    {

        const privateKey = createPrivateKey({
            key: this.PrivateKey,
            type: 'sec1',
            format: 'der',
            encoding: 'hex'
        });

        const sign = createSign('SHA256');
        sign.write(JSON.stringify(data));
        sign.end();
        return sign.sign(privateKey, 'hex');
    }

    verify(data,signature){

        const publicKey = createPublicKey({
                key:this.PublicKey,
                type: 'spki',
                format: 'der',
                encoding: 'hex'
        })

        const verify = createVerify('SHA256');
        verify.write(JSON.stringify(data));
        verify.end();
        return verify.verify(publicKey, signature, 'hex');
    }

    balance(){
        return 'In Progres'
    }


    get PrivateKey(){
        return this.privateKey
    }
    get PublicKey(){
        return this.publicKey
    }
}

module.exports = Wallet
//generateKeyPair