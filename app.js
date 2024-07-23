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
        io.to(data.userToCall).emit('callUser', { 
            signal: data.signalData, 
            from: data.from, 
            nombreLlamada: data.nombreLlamada,
            callerId: socket.id // Aquí enviamos el ID del emisor
        });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', { signal: data.signal, callerId: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected ' + socket.id);
    });

    socket.on("msj", (msjData) => {
        io.to(msjData.to).emit("msj", { 
            nombre: msjData.nombre, 
            mensaje: msjData.mensaje 
        });
    });
});

server.listen(4000, () => {
    console.log('listening on *:4000');
});
