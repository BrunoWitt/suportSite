const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//Inicialização do projeto
const app = express();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());

//Importação das rotas
const authRoute = require('./routes/authRoute');
const ticketRoute = require('./routes/ticketRoute');

//Uso das rotas
app.use('/auth', authRoute);
app.use('/tickets', ticketRoute);

app.get('/', (req, res) => {
    res.json({ message: 'Servidor de Suporte Rodando!' });
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})