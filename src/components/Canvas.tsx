import {
  memo,
  useRef,
  forwardRef,
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
  TouchEventHandler,
  MouseEventHandler,
} from 'react';
import resizeImageData from 'resize-image-data';
import { throttle } from '../utils/throttle';

const WIDTH = 800;
const HEIGHT = 450;

export type Change = {
  lX: number;
  lY: number;
  cX: number;
  cY: number;
};

export type CanvasHandle = {
  draw: (
    lastX: number,
    lastY: number,
    currentX: number,
    currentY: number
  ) => void;
  put: (changes: Change[]) => void;
  get: () => Change[];
};

type CanvasProps = {
  onDraw: {
    (lastX: number, lastY: number, currentX: number, currentY: number): void;
  };
  color: string;
  width: number;
} & React.HTMLAttributes<HTMLCanvasElement>;

const Canvas = forwardRef<CanvasHandle, CanvasProps>(
  ({ onDraw, color, width, ...props }: CanvasProps, ref) => {
    const canvas = useRef<HTMLCanvasElement>(null);

    let context: CanvasRenderingContext2D | null = null,
      drawing = false,
      lastX: number | null = null,
      lastY: number | null = null;

    const changeset: Change[] = [];

    const init = useCallback(() => {
      if (!canvas.current) return;

      // eslint-disable-next-line react-hooks/exhaustive-deps
      context = canvas.current.getContext('2d');

      if (!context) return;

      const image = context.getImageData(
        0,
        0,
        context.canvas.width,
        context.canvas.height
      );

      context.canvas.width = context.canvas.offsetWidth;
      context.canvas.height = context.canvas.offsetHeight;

      const scaledImage = resizeImageData(
        image,
        context.canvas.width,
        context.canvas.height,
        'nearest-neighbor'
      );

      context.putImageData(scaledImage as ImageData, 0, 0);
    }, [canvas]);

    useLayoutEffect(init);

    useLayoutEffect(() => {
      window.addEventListener('resize', init);

      return () => {
        window.removeEventListener('resize', init);
      };
    }, [init]);

    const stroke = (
      lastX: number,
      lastY: number,
      currentX: number,
      currentY: number
    ) => {
      if (!context) return;

      context.strokeStyle = color;
      context.lineWidth = width;
      context.moveTo(lastX, lastY);
      context.lineTo(currentX, currentY);
      context.stroke();
    };

    useImperativeHandle(ref, () => ({
      draw: (
        lastX: number,
        lastY: number,
        currentX: number,
        currentY: number
      ) => {
        stroke(lastX, lastY, currentX, currentY);
      },
      put: (changes: Change[]) => {
        changes.forEach((change) => {
          const { lX, lY, cX, cY } = change;
          stroke(lX, lY, cX, cY);
          changeset.push(change);
        });
      },
      get: () => {
        return changeset;
      },
    }));

    const draw = (
      lastX: number,
      lastY: number,
      currentX: number,
      currentY: number
    ) => {
      onDraw(lastX, lastY, currentX, currentY);
      stroke(lastX, lastY, currentX, currentY);
      changeset.push({ lX: lastX, lY: lastY, cX: currentX, cY: currentY });
    };

    const handleOnTouchStart: TouchEventHandler<HTMLCanvasElement> = (e) => {
      e.persist();

      if (!canvas.current) return;
      if (!context) return;

      const rect = canvas.current.getBoundingClientRect();
      context.beginPath();

      drawing = true;

      lastX = e.targetTouches[0].pageX - rect.left;
      lastY = e.targetTouches[0].pageY - rect.top;
    };

    const handleOnMouseDown: MouseEventHandler<HTMLCanvasElement> = (e) => {
      e.persist();

      if (!canvas.current) return;
      if (!context) return;

      const rect = canvas.current.getBoundingClientRect();
      context.beginPath();

      drawing = true;

      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    };

    const handleOnTouchMove: TouchEventHandler<HTMLCanvasElement> = (e) => {
      if (!drawing) return;

      if (!canvas.current) return;
      if (!context) return;

      const rect = canvas.current.getBoundingClientRect();

      const currentX = e.targetTouches[0].pageX - rect.left;
      const currentY = e.targetTouches[0].pageY - rect.top;

      if (lastX === null || lastY === null) return;

      draw(lastX, lastY, currentX, currentY);

      lastX = currentX;
      lastY = currentY;
    };

    const handleOnMouseMove: MouseEventHandler<HTMLCanvasElement> = (e) => {
      e.persist();

      if (!drawing) return;

      if (!canvas.current) return;
      if (!context) return;

      const rect = canvas.current.getBoundingClientRect();

      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (lastX === null || lastY === null) return;

      draw(lastX, lastY, currentX, currentY);

      lastX = currentX;
      lastY = currentY;
    };

    const handleOnMouseUp = () => {
      drawing = false;
    };

    return (
      <canvas
        ref={canvas}
        width={WIDTH}
        height={HEIGHT}
        onMouseDown={handleOnMouseDown}
        onTouchStart={handleOnTouchStart}
        onMouseMove={throttle(handleOnMouseMove)}
        onTouchMove={throttle(handleOnTouchMove)}
        onMouseUp={handleOnMouseUp}
        onTouchEnd={handleOnMouseUp}
        {...props}
      />
    );
  }
);

const MemoizedCanvas = memo(Canvas);

export default MemoizedCanvas;
