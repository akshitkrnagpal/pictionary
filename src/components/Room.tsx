import { useEffect, useRef } from 'react';
import Canvas, { CanvasHandle, Change } from './Canvas';
import { roomRoute } from '../routes';
import { useSocket } from '@/hooks/useSocket';

const Room = () => {
  const canvas = useRef<CanvasHandle>(null);
  const { isConnected, socket } = useSocket();
  const { roomName } = roomRoute.useParams();

  useEffect(() => {
    if (!isConnected) return;
    socket.emit('join', { roomName });
  }, [isConnected, roomName, socket]);

  // const handleJoin = () => {
  //   sendEventData({
  //     type: 'put',
  //     data: canvas.current.get(),
  //   });
  // };

  const handleDraw = (lX: number, lY: number, cX: number, cY: number) => {
    socket.emit('draw', { roomName, change: { lX, lY, cX, cY } });
  };

  // const onJoin = (event: unknown) => {
  //   if (!canvas.current) return;
  //   canvas.current.put(event.data);
  // };

  const onDraw = (event: Change) => {
    if (!canvas.current) return;
    const { lX, lY, cX, cY } = event;
    canvas.current.draw(lX, lY, cX, cY);
  };

  useEffect(() => {
    // socket.on('join', onJoin);
    socket.on('draw', onDraw);

    return () => {
      // socket.off('join', onJoin);
      socket.off('draw', onDraw);
    };
  }, [isConnected, roomName, socket]);

  return (
    <div className='grid grid-cols-2 bg-gray-400 h-full w-full'>
      <div className='flex-1 px-8 py-8 flex justify-center items-center flex-col'>
        <div>{isConnected ? 'Connected' : 'Not Connected'}</div>
        <Canvas
          ref={canvas}
          className='bg-white rounded border'
          onDraw={handleDraw}
          color='#000'
          width={4}
        />
      </div>
    </div>
  );
};

export default Room;
