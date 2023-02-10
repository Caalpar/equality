
const net = require('net');
const ConnectNodes = require('../connect_nodes/CennectNodes.js');
const PeerOfConnection = require('../peerOfConnection/PeerOfConnection.js');
const customEvent = require('../../events/events.js');
const Mainpool = require('../../mainpool/Mainpool.js');





class ServerP2P{

    static instance = undefined

    constructor(port){


        this.sockets =[]
        this.port = port
        this.server =  net.createServer((socket) => {
            //  socket.end('goodbye\n');

         }).on('error', (err) => {
              // Handle errors here.
              throw err;
        });

        this.server.on('connection', (socket) => {
           // console.log('connection: here save socket')


            this.sockets.push(socket)


            socket.on('data',(data)=>{

                let textDataArr = data.toString('utf-8').split('|')

                let index_data = textDataArr.findIndex(d=>d != '')

                let jData = JSON.parse(textDataArr[index_data])
    
                if(this.sockets.length>0){

                    switch (jData.e) {
                    case 'brodcast':
             
          
                        for (let index = 0; index < this.sockets.length; index++) {
                            const socket = this.sockets[index];

                             let index_path_node = jData.data.nodes_path.findIndex(id=>id==socket.id) 

                             if(index_path_node == -1)
                                socket.write('|'+JSON.stringify({e:jData.event_send,data:jData.data})+'|');
                            }
                        break;
                    case 'connect':{
                        const  {id,host,port,timestamp,hosts,mainpool} = jData.data

                        if(!PeerOfConnection.instance.addQuaque(id,timestamp)){
                            this.brodcast('disconnect-node',{id})
                            socket.end();
                            return
                        }

                   
                        if(mainpool.transactions.length > 0 && !PeerOfConnection.instance.addTrasactions(mainpool.transactions,timestamp)){
                            this.brodcast('disconnect-node',{id})
                            socket.end();
                            return
                        }

                        socket.id = id
                      
                        ConnectNodes.instance.connect2(id,host,parseInt(port))                                
            
                    break;
                    }
                    case 'connect-2':{

                 
                        const  {hosts} = jData.data

                        const new_hosts = ConnectNodes.instance.hostWhitoutConnect(hosts)


                        if(new_hosts.length>0){

                            for (let index = 0; index < new_hosts.length; index++) {
                                const {id,host,port} = new_hosts[index];
                                ConnectNodes.instance.tryConnect(id,host,parseInt(port))               
                            }
                        }

                      
                    break;
                    }                            
                    case 'bad-node':
                        console.log('bad node in server')
                    break;

                        default:
                            break;
                    }    
                }
             })

             
            socket.on('close',()=>{
                customEvent.emit('remove-client',{id:socket.id})
                let index_socket = this.sockets.findIndex(s=>s.id == socket.id)
                if(index_socket != -1){
                    this.sockets.splice(index_socket, 1);
                }
            })

            socket.on('end',()=>{
                console.log('socket end...')
              //  this.sockets.splice(this.sockets.indexOf(socket), 1);
            })

            socket.on('error',()=>{
            //    console.log('socket error...')
            })

        })

        this.client = net.connect({
            port:  this.port,
            host: 'localhost'
          },()=>{
              console.log("connection...")
        });
     
        customEvent.on('remove-client',(data)=>{
            const {id,nodes_path} = data

            let index_socket = this.sockets.findIndex(s=>s.id == id)

            if(index_socket != -1){
                this.sockets[index_socket].end()
                this.brodcast('disconnect-node',{id,nodes_path})
                this.sockets.splice(index_socket, 1);
            }

        })

        customEvent.on('new-transaction',(data)=>{
            this.brodcast(data.e,data.data)
        })

        customEvent.on('new-transaction-brodcast',(data)=>{
            this.brodcast('new-transaction',data)
        })


        // patron sigleton
        if (typeof ServerP2P.instance == "object") {
            return ServerP2P.instance
        }
        ServerP2P.instance = this
        return this
    }

    listen(){
        this.server.listen( this.port , () => {
            console.log('server bound on port:',this.port);
        });
    }

    brodcast(event_send,data){

        if(data.nodes_path){
            let index_path_node = data.nodes_path.findIndex(id=>id == process.env.PUBLIC_KEY) 

            if(index_path_node == -1)
            data.nodes_path.push(process.env.PUBLIC_KEY)
            else
            return

        }else{
            data.nodes_path = [process.env.PUBLIC_KEY]
        }


        this.client.write("|"+JSON.stringify({e:'brodcast',event_send,data})+'|')
    }


}
module.exports = ServerP2P

