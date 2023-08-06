import React, { useState, useRef, useEffect } from 'react';

interface props {
  id?: string;
  containerRef: any;
}

function RenderSigners(props: props) {
  // state variables for element position, dimensions, and class names
  const top = useRef(70);
  const left = useRef(100);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [classes, setClasses] = useState('');
  // state variable for mouse down status
  const [isMouseDown, setIsMouseDown] = useState(false);
  // state variable for out of bounds counter
  const [outOfBoundsCounter, setOutOfBoundsCounter] = useState(0);
  // state variable for message text
  const [message, setMessage] = useState('plz move me');
  // ref variables for element and container DOM nodes

  const elmRef = useRef<HTMLDivElement>(null);
  // const containerRef = useRef<HTMLDivElement>(null);
  const diffY = useRef(0);
  const diffX = useRef(0);

  // constants for element and container background colors
  const elmBg = '#474ec8';
  const containerBg = '#767df9';
  // constant for fainted background color
  const faintedBg = 'rgba(255,255,255,0.3)';

  // useEffect hook to get the element and container dimensions after initial render

  const containerRef = props.containerRef;

  useEffect(() => {
    if (elmRef.current && containerRef?.current) {
      setWidth(elmRef.current.offsetWidth);
      setHeight(elmRef.current.offsetHeight);
    }
  }, [containerRef?.current]);

  // function to handle mouse down event
  function mouseDown(e) {
    setIsMouseDown(true);
    setOutOfBoundsCounter(0);
    // get initial mousedown coordinates
    const mouseY = e.clientY;
    const mouseX = e.clientX;

    if (!elmRef.current || !containerRef.current) {
      return;
    }
    // get element top and left positions
    const elmY = elmRef.current.offsetTop;
    const elmX = elmRef.current.offsetLeft;

    // get diff from (0,0) to mousedown point
    diffY.current = mouseY - elmY;
    diffX.current = mouseX - elmX;
  }

  // function to handle mouse move event
  function mouseMove(e) {
    // get new mouse coordinates
    const newMouseY = e.clientY;
    const newMouseX = e.clientX;

    // calc new top, left pos of elm
    let newElmTop = newMouseY - diffY.current,
      newElmLeft = newMouseX - diffX.current;

    // calc new bottom, right pos of elm
    let newElmBottom = newElmTop + height,
      newElmRight = newElmLeft + width;

    // get container dimensions

    if (!containerRef.current) {
      return;
    }

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    if (newElmTop < 0 || newElmLeft < 0 || newElmTop + height > containerHeight || newElmLeft + width > containerWidth) {
      // if elm is being dragged off top of the container...
      if (newElmTop < 0) {
        newElmTop = 0;
      }

      // if elm is being dragged off left of the container...
      if (newElmLeft < 0) {
        newElmLeft = 0;
      }

      // if elm is being dragged off bottom of the container...
      if (newElmBottom > containerHeight) {
        newElmTop = containerHeight - height;
      }

      // if elm is being dragged off right of the container...
      if (newElmRight > containerWidth) {
        newElmLeft = containerWidth - width;
      }
    }

    moveElm(newElmTop, newElmLeft);
  }

  // function to handle mouse up event
  function mouseUp() {
    setIsMouseDown(false);
    setMessage('plz move me');
  }

  // function to move elm
  function moveElm(yPos, xPos) {
    top.current = yPos;
    left.current = xPos;
    // update the element style directly using ref
    if (elmRef.current) {
      elmRef.current.style.top = `${yPos}px`;
      elmRef.current.style.left = `${xPos}px`;
    }
  }

  useEffect(() => {
    if (isMouseDown) {
      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };
  }, [isMouseDown]);

  return (
    <div
      className="container"
      // ref={containerRef}
      // style={{
      //   margin: 0,
      //   padding: 0,
      //   border: 0,
      //   position: 'relative',
      //   backgroundColor: containerBg,
      //   width: '400px',
      //   height: '400px',
      // }}
    >
      <div
        className={`box ${classes}`}
        ref={elmRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          boxSizing: 'border-box',
          border: '2px solid currentColor',
          color: '#000',
          backgroundColor: classes.includes('fainted') && isMouseDown ? faintedBg : elmBg,
          width: 150,
          height: 150,
          fontFamily: "'PT Mono', monospace",
          fontSize: 16,
          cursor: isMouseDown ? 'move' : 'pointer',
          userSelect: 'none',
          textAlign: 'center',
        }}
        onMouseDown={mouseDown}
      ></div>
      {/* add event listeners for mouse move to the document */}
      {/* {isMouseDown && (
        <>
          <style>{`* { cursor: move !important; }`}</style>
          <div
            style={{
              position: 'absolute',
              top: -600,
              left: -600,
              width: '300vw',
              height: '300vh',
              zIndex: 10001,
            }}
            onMouseMove={mouseMove}
            onMouseUp={mouseUp}
          ></div>
        </>
      )} */}
    </div>
  );
}

export default RenderSigners
