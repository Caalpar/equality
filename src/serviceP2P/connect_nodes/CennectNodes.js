const Client = require("../client/Client");
const customEvent = require('../../events/events.js')
const fs = require('fs');
const path = require('path');
const Mainpool = require("../../mainpool/Mainpool");


class ConnectNodes{
    static instance = undefined
    constructor(){
        
        let hostJsonText = fs.readFileSync(path.join(__dirname,'./hosts.json'));
        let hostJson = JSON.parse(hostJsonText);

        this.nodes = []
        this.hosts = hostJson.hosts

        this.timestamp = Date.now()

        for (let index = 0; index < this.hosts.length; index++) {
            const {id,host,port} = hostJson.hosts[index];
            if(port != process.env.PORT_P2P)
            this.tryConnect(id,host,port)
        }

        customEvent.on('new-connection',(data)=>{
            const {id,host,port} = data

            let index_conn = this.hosts.findIndex(h=>h.id == id)
            if(index_conn == -1){
                console.log('connect in client',port)
                this.tryConnect(id,host,parseInt(port))
            }
            // this.removeConnection(id,host,port)
        })


        customEvent.on('remove-client',(data)=>{
            const {id} = data
             this.removeConnection(id)
            // this.removeConnection(id,host,port)
        })

        customEvent.on('error-connect',(data)=>{
            const {id} = data
            console.log('remove whit error')
            this.removeConnection(id)
            // this.removeConnection(id,host,port)
        })

        customEvent.on('connect-new-node',(client)=>{
            let {id,host,port} = client

            let index_host = this.hosts.findIndex(h=>h.id == id)
            
            let index_node = this.nodes.findIndex(n=>n.id == id)

            if(index_host == -1)
                this.hosts.push({id,host,port})
            
            if(index_node == -1)
                this.nodes.push(client)
            
            client.sendData('connect',{id:process.env.PUBLIC_KEY,host:process.env.HOST/*'localhost'*/,port:process.env.PORT_P2P,timestamp:this.timestamp,mainpool:Mainpool.instance})
        })

        // patron sigleton
        if (typeof ConnectNodes.instance == "object") {
            return ConnectNodes.instance
        }
        ConnectNodes.instance = this

        return this

    }


    tryConnect(id,host,port){
        new Client(id,host,port)
    }

    connect2(id,host,port){

        try {        
            let hosts = this.hosts.filter(h=> (h.id != id) && (h.id != process.env.PUBLIC_KEY)) 

            let index_node = this.nodes.findIndex(n=>n.id == id)
            
            if(index_node != -1)
            {
               this.nodes[index_node].sendData('connect-2',{hosts})
            }
            else
            {
                let client = new Client(id,host,port)
                client.sendData('connect-2',{hosts})
                this.nodes.push(client)
                this.hosts.push({id,host,port})

            }

            
        } catch (error) {
            console.log('error connect to server [Connect Nodes-50]',error)
        }
    }

    addConnection(id,host,port){

        let index_host = this.hosts.findIndex(h=> h.host == host && h.port == port)

        if(index_host == -1 && host){
            let client = new Client(id,host,port)
            this.hosts.push({id,host:host,port:port})
            this.nodes.push(client)
            client.sendData('connect',{id:process.env.PUBLIC_KEY,host:process.env.HOST/*'localhost'*/,port:process.env.PORT_P2P,hosts:this.hosts,timestamp:this.timestamp,mainpool:Mainpool.instance})
            fs.writeFileSync(path.join(__dirname,'./hosts.json'),  JSON.stringify({hosts:this.hosts}));
            console.log('hosts update [add host connected]')
        }
    }

    removeConnection(id){

        //let index_host = this.hosts.findIndex(h=> h.host == host && h.port == port)
        let index_host = this.hosts.findIndex(h=> h.id == id)
        
        //let index_node = this.nodes.findIndex(n=> n.host == host && n.port == port)
        let index_node = this.nodes.findIndex(n=> n.id == id)
        

        if(index_host != -1){
            this.hosts.splice(index_host,1)
        }

        if(index_node != -1){
            this.nodes.splice(index_node,1)
        }

        if(this.hosts.length>0)
        {
                 //   fs.writeFileSync(path.join(__dirname,'./hosts.json'),  JSON.stringify({hosts:this.hosts}));
                    console.log('hosts update [delete host disconnected]')
        }            
    }

    hostWhitoutConnect(hosts){
        let result = []

        for (let index = 0; index < hosts.length; index++) {
            const {id} = hosts[index];
          
            let index_host = this.hosts.findIndex(h=>h.id == id)
            if(index_host == -1)
            {
                result.push(hosts[index])
            }
        }

        return result
    }
}
module.exports = ConnectNodes