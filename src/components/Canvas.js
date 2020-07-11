import React, {
  memo,
  useRef,
  forwardRef,
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';
import resizeImageData from 'resize-image-data';
import throttle from '../utils/throttle';

const Canvas = forwardRef(({ onDraw, color, width, ...props }, ref) => {
  const canvas = useRef();

  let context = null,
    drawing = false,
    lastX = null,
    lastY = null,
    changeset = [];

  const init = useCallback(() => {
    if (!canvas.current) return;

    context = canvas.current.getContext('2d'); // eslint-disable-line react-hooks/exhaustive-deps

    const image = context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height,
    );

    context.canvas.width = context.canvas.offsetWidth;
    context.canvas.height = context.canvas.offsetHeight;

    const scaledImage = resizeImageData(
      image,
      context.canvas.width,
      context.canvas.height,
      'nearest-neighbor',
    );

    context.putImageData(scaledImage, 0, 0);
  }, [canvas]);

  useLayoutEffect(init);

  useLayoutEffect(() => {
    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('resize', init);
    };
  }, [init]);

  const stroke = (lastX, lastY, currentX, currentY) => {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.moveTo(lastX, lastY);
    context.lineTo(currentX, currentY);
    context.stroke();
  };

  useImperativeHandle(ref, () => ({
    draw: (lastX, lastY, currentX, currentY) => {
      stroke(lastX, lastY, currentX, currentY);
    },
    put: changes => {
      changes.forEach(change => {
        const { lX, lY, cX, cY } = change;
        stroke(lX, lY, cX, cY);
        changeset.push(change);
      });
    },
    get: () => {
      return changeset;
    },
  }));

  const draw = (lastX, lastY, currentX, currentY) => {
    onDraw(lastX, lastY, currentX, currentY);
    stroke(lastX, lastY, currentX, currentY);
    changeset.push({ lX: lastX, lY: lastY, cX: currentX, cY: currentY });
  };

  const handleOnTouchStart = e => {
    e.persist();

    const rect = canvas.current.getBoundingClientRect();
    context.beginPath();

    drawing = true;

    lastX = e.targetTouches[0].pageX - rect.left;
    lastY = e.targetTouches[0].pageY - rect.top;
  };

  const handleOnMouseDown = e => {
    e.persist();

    const rect = canvas.current.getBoundingClientRect();
    context.beginPath();

    drawing = true;

    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  };

  const handleOnTouchMove = e => {
    e.persist();

    if (!drawing) return;

    const rect = canvas.current.getBoundingClientRect();

    const currentX = e.targetTouches[0].pageX - rect.left;
    const currentY = e.targetTouches[0].pageY - rect.top;

    draw(lastX, lastY, currentX, currentY);

    lastX = currentX;
    lastY = currentY;
  };

  const handleOnMouseMove = e => {
    e.persist();

    if (!drawing) return;

    const rect = canvas.current.getBoundingClientRect();

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    draw(lastX, lastY, currentX, currentY);

    lastX = currentX;
    lastY = currentY;
  };

  const handleOnMouseUp = e => {
    drawing = false;
  };

  return (
    <canvas
      ref={canvas}
      onMouseDown={handleOnMouseDown}
      onTouchStart={handleOnTouchStart}
      onMouseMove={throttle(handleOnMouseMove, 10)}
      onTouchMove={throttle(handleOnTouchMove, 10)}
      onMouseUp={handleOnMouseUp}
      onTouchEnd={handleOnMouseUp}
      {...props}
    />
  );
});

export default memo(Canvas, (prevProps, nextProps) => {
  return false;
});
