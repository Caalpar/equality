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
            const {id,host,port} = hostJson.hosts[index];
            if(port != process.env.PORT_P2P)
            this.connect(id,host,port)
        }

        



        customEvent.on('remove-client',(data)=>{
            const {id} = data
            console.log('remove')
            this.removeConnection(id)
            // this.removeConnection(id,host,port)
        })

        customEvent.on('error-connect',(data)=>{
            const {id} = data
            console.log('remove whit error')
            this.removeConnection(id)
            // this.removeConnection(id,host,port)
        })

        // patron sigleton
        if (typeof ConnectNodes.instance == "object") {
            return ConnectNodes.instance
        }
        ConnectNodes.instance = this

        return this

    }

    connect(id,host,port){

        try {         
            let client = new Client(id,host,port)
            this.nodes.push(client)
            client.sendData('connect',{id:process.env.PUBLIC_KEY,host:process.env.HOST/*'localhost'*/,port:process.env.PORT_P2P,hosts:this.hosts})
        } catch (error) {
            console.log('error connect to server [Connect Nodes-50]')
        }
    }

    addConnection(id,host,port){

        let index_host = this.hosts.findIndex(h=> h.host == host && h.port == port)

        if(index_host == -1 && host){
            let client = new Client(id,host,port)
            this.hosts.push({id,host:host,port:port})
            this.nodes.push(client)
            client.sendData('connect',{id:process.env.PUBLIC_KEY,host:process.env.HOST/*'localhost'*/,port:process.env.PORT_P2P,hosts:this.hosts})
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
                    fs.writeFileSync(path.join(__dirname,'./hosts.json'),  JSON.stringify({hosts:this.hosts}));
                    console.log('hosts update [delete host disconnected]')
        }            
    }
    // removeConnection(id,host,port){

    //     //let index_host = this.hosts.findIndex(h=> h.host == host && h.port == port)
    //     let index_host = this.hosts.findIndex(h=> h.id == id)
        
    //     //let index_node = this.nodes.findIndex(n=> n.host == host && n.port == port)
    //     let index_node = this.nodes.findIndex(n=> n.id == id)
        

    //     if(index_host != -1){
    //         this.hosts.splice(index_host,1)
    //     }

    //     if(index_node != -1){
    //         this.nodes.splice(index_node,1)
    //     }

    //     if(this.hosts.length>0)
    //     {
    //                 fs.writeFileSync(path.join(__dirname,'./hosts.json'),  JSON.stringify({hosts:this.hosts}));
    //                 console.log('hosts update [delete host disconnected]')
    //     }            
    // }

}
module.exports = ConnectNodes