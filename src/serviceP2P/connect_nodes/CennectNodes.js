const Client = require("../client/Client");
const customEvent = require('../../events/events.js')
const fs = require('fs');
const path = require('path')


class ConnectNodes{
    static instance = undefined
    constructor(){
        
        let hostJsonText = fs.readFileSync(path.join(__dirname,'./hosts.json'));
        let hostJson = JSON.parse(hostJsonText);

        this.nodes = []
        this.hosts = hostJson.hosts

        for (let index = 0; index < this.hosts.length; index++) {
            const {host,port} = hostJson.hosts[index];
            if(port != process.env.PORT_P2P)
            this.connect(host,port)
        }

        customEvent.on('remove-client',(data)=>{
            const {host,port} = data
            this.removeConnection(host,port)
        })

        customEvent.on('error-connect',(data)=>{
            const {host,port} = data
            this.removeConnection(host,port)
        })

        // patron sigleton
        if (typeof ConnectNodes.instance == "object") {
            return ConnectNodes.instance
        }
        ConnectNodes.instance = this

        return this

    }

    connect(host,port){

        try {         
            let client = new Client(host,port)
            this.nodes.push(client)
            client.sendData('connect',{host:process.env.HOST/*'localhost'*/,port:process.env.PORT_P2P,hosts:this.hosts})
        } catch (error) {
            console.log('error connect to server [Connect Nodes-50]')
        }
    }

    addConnection(host,port){

        let index_host = this.hosts.findIndex(h=> h.host == host && h.port == port)

        if(index_host == -1 && host){
            let client = new Client(host,port)
            this.hosts.push({host:host,port:port})
            this.nodes.push(client)
            client.sendData('connect',{host:process.env.HOST/*'localhost'*/,port:process.env.PORT_P2P,hosts:this.hosts})
            fs.writeFileSync(path.join(__dirname,'./hosts.json'),  JSON.stringify({hosts:this.hosts}));
            console.log('hosts update [add host connected]')
        }
    }

    removeConnection(host,port){

        let index_host = this.hosts.findIndex(h=> h.host == host && h.port == port)
        
        let index_node = this.nodes.findIndex(n=> n.host == host && n.port == port)
        

        if(index_host != -1){
            this.hosts.splice(index_host,1)
        }

        if(index_node != -1){
            this.nodes.splice(index_node,1)
        }

        if(this.hosts.length>0)
        {
                    fs.writeFileSync(path.join(__dirname,'./hosts.json'),  JSON.stringify({hosts:this.hosts}));
                    console.log('hosts update [delete host disconnected]')
        }
                
        // let hostJsonText = fs.readFileSync(path.join(__dirname,'./hosts.json'));
        // let hostJson = JSON.parse(hostJsonText);




    }

}
module.exports = ConnectNodes