const diskStorage = require('multer').diskStorage;

module.exports = {
    auth: {
        secretKey: 'NQqhDa#Hu#6ak!GBdHeC!pAXTtSF^r'
    },

    db: {
        host: 'localhost',
        name: 'pokemonDB'
    },

    mongoose: {
        options: { 
            useNewUrlParser: true 
        }
    },

    morgan: {
        format: 'dev',
        options: { 
            skip: (req, res) => process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'test' 
        }
    },

    multer: {
        opts: {
            dest: './static/avatars',
            limits: {
                fileSize: 50_000_000 // 50MB is max size for one file,
            }
        }
    },

    pokemonAPI: {
        path: '/api/pokemon'
    },

    port: 8000,
}
