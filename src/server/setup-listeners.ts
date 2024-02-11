import type { Server } from 'socket.io';

export const setupListeners = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });

    socket.on('join', ({ roomName }) => {
      socket.join(roomName);
      console.log('Socket joined room:', roomName);
    });

    socket.on('draw', (data) => {
      console.log('Socket emitted draw:', data);
      socket.to(data.roomName).emit('draw', data.change);
    });
  });
};
