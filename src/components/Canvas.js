import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';

let context = null;

const Canvas = forwardRef(({ onDraw, ...props }, ref) => {
  const canvas = useRef(null);

  const [state, setState] = useState({});

  useEffect(() => {
    if (canvas.current) {
      context = canvas.current.getContext('2d');
      canvas.current.width = canvas.current.offsetWidth;
      canvas.current.height = canvas.current.offsetHeight;

      setState(state => ({
        ...state,
        drawing: false,
      }));
    }
  }, [canvas]);

  useImperativeHandle(ref, () => ({
    draw(lX, lY, cX, cY) {
      context.strokeStyle = '#000';
      context.lineWidth = 4;
      context.moveTo(lX, lY);
      context.lineTo(cX, cY);
      context.stroke();
    },
  }));

  const handleOnTouchStart = e => {
    e.persist();
    const rect = canvas.current.getBoundingClientRect();
    context.beginPath();
    setState(state => ({
      ...state,
      lastX: e.targetTouches[0].pageX - rect.left,
      lastY: e.targetTouches[0].pageY - rect.top,
      drawing: true,
    }));
  };

  const handleOnMouseDown = e => {
    e.persist();
    const rect = canvas.current.getBoundingClientRect();
    context.beginPath();

    setState(state => ({
      ...state,
      lastX: e.clientX - rect.left,
      lastY: e.clientY - rect.top,
      drawing: true,
    }));
  };

  const handleOnTouchMove = e => {
    e.persist();
    if (state.drawing) {
      const rect = canvas.current.getBoundingClientRect();
      const lastX = state.lastX;
      const lastY = state.lastY;
      let currentX = e.targetTouches[0].pageX - rect.left;
      let currentY = e.targetTouches[0].pageY - rect.top;
      draw(lastX, lastY, currentX, currentY);
      setState(state => ({
        ...state,
        lastX: currentX,
        lastY: currentY,
      }));
    }
  };

  const handleOnMouseMove = e => {
    e.persist();
    if (state.drawing) {
      const rect = canvas.current.getBoundingClientRect();
      const lastX = state.lastX;
      const lastY = state.lastY;

      let currentX = e.clientX - rect.left;
      let currentY = e.clientY - rect.top;

      draw(lastX, lastY, currentX, currentY);
      setState(state => ({
        ...state,
        lastX: currentX,
        lastY: currentY,
      }));
    }
  };

  const handleOnMouseUp = e => {
    setState(state => ({
      ...state,
      drawing: false,
    }));
  };

  const draw = (lX, lY, cX, cY) => {
    onDraw(lX, lY, cX, cY);
    context.strokeStyle = '#000';
    context.lineWidth = 4;
    context.moveTo(lX, lY);
    context.lineTo(cX, cY);
    context.stroke();
  };

  return (
    <canvas
      ref={canvas}
      onMouseDown={handleOnMouseDown}
      onTouchStart={handleOnTouchStart}
      onMouseMove={handleOnMouseMove}
      onTouchMove={handleOnTouchMove}
      onMouseUp={handleOnMouseUp}
      onTouchEnd={handleOnMouseUp}
      {...props}
    />
  );
});

export default Canvas;
