const { Pool } = require('pg'); 
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados', err);
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};