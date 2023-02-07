const net = require('net');
const customEvent = require('../../events/events.js')



class Client{
    constructor(id,host,port){

        this.id = id
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
    
            let textDataArr = data.toString('utf-8').split('|')

            let index_data = textDataArr.findIndex(d=>d != '')

            let jData = JSON.parse(textDataArr[index_data])

            switch (jData.e) {
                case 'brodcast':
                    for (let index = 0; index < this.sockets.length; index++) {
                        const socket = this.sockets[index];
                            socket.write(data);
                        }
                    break;
                case 'test':
                     customEvent.emit('brodcast-test',jData)
                break;
                case 'remove-client':
                    // customEvent.emit('remove-client',{id:this.id,host:this.host,port:this.port})
                    customEvent.emit('remove-client',{id:this.id})
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
         //   customEvent.emit('error-connect',{id:this.id})
           
         
         // customEvent.emit('error-connect',{id:this.id,host:this.host,port:this.port})
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

        // customEvent.emit('remove-client',{id:this.id,host:this.host,port:this.port})
        customEvent.emit('remove-client',{id:this.id})

    }
}    

module.exports = Client


