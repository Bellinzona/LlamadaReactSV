const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configurar CORS
app.use(cors({
    origin: '*', // Dirección de tu aplicación React
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

const io = new Server(server, {
    cors: {
        origin: '*', // Dirección de tu aplicación React
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('a user connected ' + socket.id);

    socket.on('callUser', (data) => {
        console.log("AAA" + data.nombreLlamada)
        io.to(data.userToCall).emit('callUser', { signal: data.signalData, from: data.from,nombreLlamada : data.nombreLlamada  });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected ' + socket.id);
    });
});

server.listen(4000, () => {
    console.log('listening on *:4000');
});
