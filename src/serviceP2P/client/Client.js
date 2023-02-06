const net = require('net');
const customEvent = require('../../events/events.js')



class Client{
    constructor(host,port){

        this.port=port
        this.host=host

        this.client = net.connect({
          port: this.port,
          host: this.host
        },()=>{
            //console.log("connection...")
        });
        
        this.client.on('connect',()=>{
            //console.log('connect...')
        })
        
        this.client.on('drain',(data)=>{
            console.log('drain',data)
        })
        
        this.client.on('data',(data)=>{
    
            let jData = JSON.parse(data.toString('utf-8'))

            switch (jData.e) {
                case 'brodcast':
                    for (let index = 0; index < this.sockets.length; index++) {
                        const socket = this.sockets[index];
                            socket.write(data);
                        }
                    break;
                case 'test':
                        console.log('[Test]',jData.data)
                    break;
            
                default:
                    break;
            }
        })
        
        this.client.on('end',()=>{
            this.removeMe()
          //  console.log('end...')
        })
        
        this.client.on('error',(error)=>{
            //console.log(`error en el socket ${this.host}:${this.port}`)
            customEvent.emit('error-connect',{host:this.host,port:this.port})
        })
        
        this.client.on('close',(close)=>{

            if(close){
                this.removeMe()
            }

        })
        
        this.client.on('lookup',(data)=>{
           // console.log('lookup',data)
        })
        
        this.client.on('ready',()=>{
           // console.log('ready...')
        })
        
        this.client.on('timeout',()=>{
           // console.log('timeout')
        })

    }
    
    sendData(e,data){
        this.client.write(JSON.stringify({e,data}))
    }

    removeMe(){

        customEvent.emit('remove-client',{host:this.host,port:this.port})

    }
}    

module.exports = Client


