const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path')
const https = require('http')

class Server {
    constructor() {
        this.httpsServer = null
        this.ioServer = null

        this.app = express();
        this.port = process.env.PORT ?? 3000;

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body con límites
        this.app.use(express.json({ limit: '1mb' }));
        this.app.use(express.urlencoded({ limit: '1mb' }));

        // === RATE LIMITING ROBUSTO ===
        // Limiter general: 100 requests por 15 minutos por IP
        const generalLimiter = rateLimit({
            windowMs: 15 * 60 * 1000,  // 15 minutos
            max: 100,                    // 100 requests max
            message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.',
            standardHeaders: true,        // Retorna info en RateLimit-* headers
            legacyHeaders: false,         // Deshabilita X-RateLimit-* headers
            skip: (req) => req.path === '/health',  // No limitar health checks
            keyGenerator: (req, res) => { // Usar X-Forwarded-For si viniene de proxy
                return req.ip || req.connection.remoteAddress;
            }
        });

        // Limiter estricto para login/transacciones: 20 requests por 15 minutos
        const strictLimiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 20,
            message: 'Demasiadas transacciones. Intenta más tarde.',
            standardHeaders: true,
            legacyHeaders: false,
            keyGenerator: (req, res) => {
                return req.ip || req.connection.remoteAddress;
            }
        });

        // Aplicar limiters a rutas específicas
        this.app.use('/api/', generalLimiter);  // General para toda la API
        this.app.post('/api/transaction', strictLimiter);  // Muy estricto en transacciones
        this.app.post('/api/wallet/balance', strictLimiter);  // Estricto en balance queries

        // Headers de seguridad
        this.app.use((req, res, next) => {
            res.header('X-Content-Type-Options', 'nosniff');
            res.header('X-Frame-Options', 'DENY');
            res.header('X-XSS-Protection', '1; mode=block');
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', '*');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });

        // Manejo de errores
        this.app.use((err, req, res, next) => {
            console.error('Error:', err.message);
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        });

        this.httpsServer = https.createServer(this.app);
    }

    routes() {
        this.app.use('/api', require('./routes/index.js'))
        
        // Health check (sin rate limit)
        this.app.get('/health', (req, res) => {
            res.json({ status: 'ok', timestamp: new Date().toISOString() })
        })
    }

    listen() {
        this.httpsServer.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        })
    }
}

module.exports = Server;