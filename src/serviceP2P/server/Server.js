
const net = require('net');
const ConnectNodes = require('../connect_nodes/CennectNodes.js');


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
            console.log('connection: here save socket')


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
                    case 'connect':
                        const  {id,host,port,hosts} = jData.data
                        socket.id = id
                        ConnectNodes.instance.addConnection(id,host,parseInt(port))
                        if(hosts.length>0){
                            for (let index = 0; index < hosts.length; index++) {
             
                                ConnectNodes.instance.addConnection(id,hosts[index].host,parseInt(hosts[index].port))                                
                            }
                        }
                    break;
                    case 'bad-node':
                        console.log('bad node in server')
                    break;

                        default:
                            break;
                    }    
                }
             })

             
            socket.on('close',()=>{
                //console.log('socket close...')
                this.sockets.splice(this.sockets.indexOf(socket), 1);
            })

            socket.on('end',()=>{
              //  console.log('socket end...')
                this.sockets.splice(this.sockets.indexOf(socket), 1);
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

        }

        this.client.write("|"+JSON.stringify({e:'brodcast',event_send,data})+'|')
    }


}
module.exports = ServerP2P

