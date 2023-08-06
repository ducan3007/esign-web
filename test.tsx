import React, { useState, useRef, useEffect } from 'react';

function Draggable() {
  // state variables for element position, dimensions, and class names
  const [top, setTop] = useState(70);
  const [left, setLeft] = useState(100);
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
  const containerRef = useRef<HTMLDivElement>(null);
  const diffY = useRef(0);
  const diffX = useRef(0);

  // constants for element and container background colors
  const elmBg = '#474ec8';
  const containerBg = '#767df9';
  // constant for fainted background color
  const faintedBg = 'rgba(255,255,255,0.3)';

  // useEffect hook to get the element and container dimensions after initial render
  useEffect(() => {
    if (elmRef.current && containerRef.current) {
      setWidth(elmRef.current.offsetWidth);
      setHeight(elmRef.current.offsetHeight);
    }
  }, []);

  // function to handle mouse down event
  function mouseDown(e) {
    setIsMouseDown(true);
    setOutOfBoundsCounter(0);
    // get initial mousedown coordinates
    const mouseY = e.clientY;
    const mouseX = e.clientX;

    if (!elmRef.current || !containerRef.current) {
      console.log('>>> elmRef.current NOT FOUND', elmRef.current);
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
    if (!isMouseDown) return;
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
      console.log('>>> containerRef.current NOT FOUND', containerRef.current);
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
      setOutOfBoundsFace();
    } else {
      resetFace();
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
    setTop(yPos);
    setLeft(xPos);
  }

  // function to set out of bounds face and message
  function setOutOfBoundsFace() {
    if (!classes.includes('pained') && !classes.includes('fainted')) {
      setOutOfBoundsCounter((prev) => prev + 1);
      if (outOfBoundsCounter < 5) {
        setClasses('pained');
        setMessage('ouch!');
      } else {
        setClasses('fainted');
        setMessage('zzz');
        setTimeout(() => {
          setOutOfBoundsCounter(0);
        }, 3000);
      }
    }
  }

  // function to reset face and message
  function resetFace() {
    if (outOfBoundsCounter < 5) {
      setClasses('');
      setMessage('yay!');
    }
  }

  // inline styles for container and element
  const containerStyle = {
    margin: 0,
    padding: 0,
    border: 0,
    position: 'relative',
    backgroundColor: containerBg,
    width: '100%',
    height: '100%',
  };

  const elmStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top,
    left,
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
  };

  // inline style for face
  const faceStyle = {
    width: 125,
    height: 70,
    fontSize: 35,
    lineHeight: '70px',
  };

  // function to get face content based on classes and mouse down status
  function getFaceContent() {
    if (classes.includes('fainted') && isMouseDown) {
      return 'X ~ X';
    } else if (classes.includes('pained') && isMouseDown) {
      return 'ಥ﹏ಥ';
    } else if (isMouseDown) {
      return ' ͡ ͜ ͡ ';
    } else {
      return '◉_◉';
    }
  }

  return (
    <div
      className="container"
      ref={containerRef}
      style={{
        margin: 0,
        padding: 0,
        border: 0,
        position: 'relative',
        backgroundColor: containerBg,
        width: '100%',
        height: '100%',
      }}
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
          top,
          left,
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
        onMouseUp={mouseUp}
      >
        <div className="face" style={faceStyle}>
          {getFaceContent()}
        </div>
        <p id="message">{message}</p>
      </div>
      {/* add event listeners for mouse move to the document */}
      {isMouseDown && (
        <>
          <style>{`* { cursor: move !important; }`}</style>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: -1,
            }}
            onMouseMove={mouseMove}
          ></div>
        </>
      )}
    </div>
  );
}

export default Draggable;
