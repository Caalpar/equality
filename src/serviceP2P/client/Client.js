const net = require('net');
const customEvent = require('../../events/events.js');
const Transaction = require('../../transaction/Transaction.js');
const ConnectNodes = require('../connect_nodes/CennectNodes.js');
const PeerOfConnection = require('../peerOfConnection/PeerOfConnection.js');




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
            console.log('connect...',this.port)
            this.IsConnected()
        })
        
        this.client.on('drain',(data)=>{
            console.log('drain',data)
        })
        
        this.client.on('data',(data)=>{
    
            let textDataArr = data.toString('utf-8').split('|')

            let index_data = textDataArr.findIndex(d=>d != '')

            let jData = JSON.parse(textDataArr[index_data])

            switch (jData.e) {
                case 'test':
           
                    // customEvent.emit('brodcast-test',jData)
                break;
                case 'connect':
                    const {id,host,port,timestamp,mainpool} = jData

                    if(!PeerOfConnection.instance.addQuaque(id,timestamp)){
                        console.log('borrando nodo malicioso')
                        //this.brodcast('disconnect-node',{id})
                        this.client.end();
                        return
                    }

               
                    if(mainpool.transactions.length > 0 && !PeerOfConnection.instance.addTrasactions(mainpool.transactions,timestamp)){
                        console.log('borrando nodo malicioso')
                        //this.brodcast('disconnect-node',{id})
                        this.client.end();
                        return
                    }

                    customEvent.emit('new-connection',{id,host,port})
      


                    // customEvent.emit('brodcast-test',jData)
                break;
                case 'new-transaction':
           
                    const {input,outputs,signature} = jData.data
                    if(Transaction.verify(input,outputs,signature))   
                       customEvent.emit('new-transaction',jData)  
                    else
                    {
                        let id_socket = jData.data.nodes_path[0]
                        customEvent.emit('remove-client',{id:id_socket,nodes_path:jData.data.nodes_path})
                    }        
                break;
                case 'disconnect-node':
                    console.log('borrar nodo remoto')
                    customEvent.emit('remove-client',{id:jData.data.id,nodes_path:jData.data.nodes_path})
                break;
            
                default:
                    break;
            }
        })
        
        this.client.on('end',()=>{
         //   console.log('end...')
        })
        
        this.client.on('error',(error)=>{
        // console.log('errr...')
        })
        
        this.client.on('close',(close)=>{
           // console.log('close...')
            customEvent.emit('remove-client',{id:this.id})
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
        this.client.write('|'+JSON.stringify({e,data})+'|')
    }
    IsConnected(){
        customEvent.emit('connect-new-node',this)
    }
}    

module.exports = Client


