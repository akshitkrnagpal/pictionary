import type { Server } from 'socket.io';

export const setupListeners = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('join', ({ roomName }) => {
      socket.join(roomName);
    });

    socket.on('draw', (data) => {
      socket.to(data.roomName).emit('draw', data.change);
    });
  });
};
