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
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use((req, res, next) => {
    req.io = io;
    next();
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json());

//Importação das rotas
const authRoute = require('./routes/authRoute');
const ticketRoute = require('./routes/ticketRoute');
const messageRoute = require('./routes/messageRoute');

//Uso das rotas
app.use('/auth', authRoute);
app.use('/tickets', ticketRoute);
app.use('/messages', messageRoute);

io.on("connection", (socket) => {
    console.log("Novo cliente conectado: " + socket.id);

    socket.on("joinTicket", (ticketId) => {
        socket.join(`ticket_${ticketId}`);
        console.log(`Socket ${socket.id} entrou na sala: ticket_${ticketId}`);
    })

    socket.on("disconnect", () => {
        console.log("Cliente desconectado: " + socket.id);
    })
});

app.get('/', (req, res) => {
    res.json({ message: 'Servidor de Suporte Rodando!' });
})

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})