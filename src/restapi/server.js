const express = require('express');
const cors = require('cors');
const path = require('path')
const https = require('http')


//const privateKey  = fs.readFileSync('../archivos/server.pem', 'utf8');
//const certificate = fs.readFileSync('../archivos/cer.pem', 'utf8');



class Server {

    constructor() {

        this.httpsServer = null
        this.ioServer = null

     //   this.privateKey = fs.readFileSync(path.join(__dirname, '../archivos/server.key'), 'utf8');
     //   this.certificate = fs.readFileSync(path.join(__dirname, '../archivos/server.cer'), 'utf8');

       // this.credentials = { key: this.privateKey, cert: this.certificate };

        this.app = express();
        this.port = process.env.PORT ?? 3000;

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }



    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());
        
        // for parsing multipart/form-data
     //   this.app.use(upload.array()); 

        // Directorio Público
        // this.app.use(express.static(path.join(__dirname, '../public')));
        // this.app.use(express.static(path.join(__dirname, '../public/admin')));

        //carga de archivos


        this.app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            //res.header('Access-Control-Allow-Origin', 'http://localhost:5008');
            res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
            res.header('Access-Control-Allow-Headers', '*');
            //res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            res.header('Access-Control-Allow-Credentials', 'true');

            next();
        });

        //this.httpsServer = https.createServer(this.credentials, this.app);
        this.httpsServer = https.createServer(this.app);
    }

    routes() {
        this.app.use('/api',require('./routes/index.js'))
    }

    listen() {
        this.httpsServer.listen(this.port, () => {
        console.log('Servidor corriendo en puerto', this.port);
        })
    }
}

module.exports = Server;