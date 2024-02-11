import type { Server } from 'socket.io';

export const setupListeners = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('join', ({ roomName }) => {
      socket.join(roomName);
      socket.to(roomName).except(socket.id).emit('request-state');
    });

    socket.on('state', (data) => {
      socket.to(data.roomName).emit('receive-state', data.state);
    });

    socket.on('draw', (data) => {
      socket.to(data.roomName).emit('draw', data.change);
    });
  });
};
