import React, { useState } from 'react';
import Resizable from './Resizable';
import type { Props as ResizableProps } from './Resizable';

type State = { width: number; height: number };
type Size = { width: number; height: number };
type ResizeData = { element: Element; size: Size };

// An example use of Resizable.
export default function ResizableBox(props: ResizableProps) {
  // Use useState hook to initialize and update state
  const [state, setState] = useState<State>({
    width: props.width,
    height: props.height,
  });

  // Define event handler as a regular function
  function onResize(e: Event, { element, size }: ResizeData) {
    const { width, height } = size;

    if (props.onResize) {
      e.persist && e.persist();
      setState(size, () => props.onResize(e, { element, size }));
    } else {
      setState(size);
    }
  }

  // Use useEffect hook to handle prop changes
  useEffect(() => {
    if (props.width !== state.width || props.height !== state.height) {
      setState({
        width: props.width,
        height: props.height,
      });
    }
  }, [props.width, props.height]);

  // Return JSX element without render method
  return (
    <Resizable
      handleSize={props.handleSize}
      width={state.width}
      height={state.height}
      onResizeStart={props.onResizeStart}
      onResize={onResize}
      onResizeStop={props.onResizeStop}
      draggableOpts={props.draggableOpts}
      minConstraints={props.minConstraints}
      maxConstraints={props.maxConstraints}
      lockAspectRatio={props.lockAspectRatio}
      axis={props.axis}
    >
      <div style={{ width: state.width + 'px', height: state.height + 'px' }} {...props} />
    </Resizable>
  );
}
