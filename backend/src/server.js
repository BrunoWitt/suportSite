const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

//Inicialização do projeto
const app = express();

app.use(cors());
app.use(express.json());

//Importação das rotas
const authRoute = require('./routes/authRoute');

//Uso das rotas
app.use('/auth', authRoute);

app.get('/', (req, res) => {
    res.json({ message: 'Servidor de Suporte Rodando!' });
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})