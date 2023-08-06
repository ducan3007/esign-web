import { Button } from '@mui/material';
import React, { useState, useRef, useEffect, useLayoutEffect, memo } from 'react';
import { ResizableBox } from 'react-resizable';

interface props {
  id: string;
  containerRef: any;
  pageNumber: number;

  signatureDataRefs?: any;

  top?: number;
  left?: number;

  width?: number;
  height?: number;
}
export interface DragItem {
  type: string;
  id: string;
  top: number;
  left: number;
}

const DraggableItem = (props: props) => {
  const pdfPage = document.querySelector(`.pdf-page[data-page-number="${props.pageNumber}"]`);

  const top = useRef(props.top || 0);
  const left = useRef(props.left || 0);

  console.log('top', props.id, top.current);
  console.log('left', props.id, left.current);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const elmRef = useRef<any>(null);
  const diffY = useRef(0);
  const diffX = useRef(0);

  const containerRef = props.containerRef;

  useLayoutEffect(() => {
    if (isMouseDown) {
      document.addEventListener('mouseup', mouseUp);
      document.addEventListener('mousemove', mouseMove);

      if (elmRef.current) {
        elmRef.current.style.cursor = 'move';
      }
    }

    if (elmRef.current) {
      elmRef.current.style.cursor = 'move';
    }

    return () => {
      document.removeEventListener('mouseup', mouseUp);
      document.removeEventListener('mousemove', mouseMove);
    };
  }, [isMouseDown]);

  useEffect(() => {
    if (elmRef.current && containerRef?.current) {
      setWidth(elmRef.current.offsetWidth);
      setHeight(elmRef.current.offsetHeight);
    }
  }, [containerRef?.current]);

  const mouseDown = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    pdfPage?.classList.add('isOver');

    setIsMouseDown(true);

    const mouseY = e.clientY;
    const mouseX = e.clientX;

    if (!elmRef.current || !containerRef.current) {
      return;
    }
    /* top and left positions */
    const elmY = elmRef.current.offsetTop;
    const elmX = elmRef.current.offsetLeft;

    /* diff from (0,0) to mousedown point */
    diffY.current = mouseY - elmY;
    diffX.current = mouseX - elmX;
  };

  const mouseMove = (e: any) => {
    e.preventDefault();

    if (!isMouseDown) return;

    /* new mouse coordinates */
    const newMouseY = e.clientY;
    const newMouseX = e.clientX;

    /* calc new top, left pos of elm */
    let newTop = newMouseY - diffY.current,
      newLeft = newMouseX - diffX.current,
      newBottom = newTop + height,
      newElmRight = newLeft + width;

    /* get container dimensions */
    if (!containerRef.current) {
      return;
    }

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    if (newTop < 0 || newLeft < 0 || newTop + height > containerHeight || newLeft + width > containerWidth) {
      // Top
      if (newTop < 0) {
        newTop = 0;
      }

      // Left
      if (newLeft < 0) {
        newLeft = 0;
      }

      // Bottom
      console.log('newElmBottom', newBottom);
      if (newBottom > containerHeight) {
        newTop = containerHeight - height;
      }

      // Right
      if (newElmRight > containerWidth) {
        newLeft = containerWidth - width;
      }
    }

    move(newTop, newLeft);
  };

  const mouseUp = (e: any) => {
    e.preventDefault();
    pdfPage?.classList.remove('isOver');
    setIsMouseDown(false);
  };

  const move = (Y: number, X: number) => {
    top.current = Y;
    left.current = X;

    if (elmRef.current) {
      
      props.signatureDataRefs.current[`page_${props.pageNumber}`][props.id].top = Y;
      props.signatureDataRefs.current[`page_${props.pageNumber}`][props.id].left = X;

      elmRef.current.style.top = `${Y}px`;
      elmRef.current.style.left = `${X}px`;
    }
  };

  console.log('render draggable item');
  return (
    <div
      id={props.id}
      ref={elmRef}
      style={{
        position: 'absolute',
        top: top.current,
        left: left.current,
        overflow: 'hidden',
        border: '2px solid currentColor',
        userSelect: 'none',
        width: props.width || 150,
        height: props.height || 150,
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('>> selected');
      }}
      onMouseDown={mouseDown}
      onFocus={(e) => {
        e.target.style.backgroundColor = 'red';
      }}
    ></div>
  );
};

export default memo(DraggableItem);
