
const net = require('net');
const ConnectNodes = require('../connect_nodes/CennectNodes.js');


class ServerP2P{

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

                let jData = JSON.parse(data.toString('utf-8'))
    
                if(this.sockets.length>0){

                    switch (jData.e) {
                    case 'brodcast':
                        for (let index = 0; index < this.sockets.length; index++) {
                            const socket = this.sockets[index];

                                socket.write(JSON.stringify({e:jData.event_send,data:jData.data}));
                            }
                        break;
                    case 'connect':
                        const  {host,port,hosts} = jData.data

                        if(port != process.env.PORT_P2P)
                        ConnectNodes.instance.addConnection(host,parseInt(port))

                        if(hosts.length>0){
                            for (let index = 0; index < hosts.length; index++) {
                                if(hosts[index].port != process.env.PORT_P2P)
                                ConnectNodes.instance.addConnection(hosts[index].host,parseInt(hosts[index].port))                                
                            }
                        }

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

    }

    listen(){
        this.server.listen( this.port , () => {
            console.log('server bound on port:',this.port);
        });
    }

    brodcast(event_send,data){
        this.client.write(JSON.stringify({e:'brodcast',event_send,data}))
    }


}
module.exports = ServerP2P

