import { Box } from '@mui/material';
import { useState, type CSSProperties, type FC, type ReactNode, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { XYCoord } from 'react-dnd';

const style: CSSProperties = {
  position: 'absolute',
  width: 80,
  height: 80,
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  cursor: 'move',
};

export interface BoxProps {
  id: any;
  left: number;
  top: number;
  hideSourceOnDrag?: boolean;
  children?: ReactNode;
}

export const ItemTypes = {
  BOX: 'box',
};

export interface DragItem {
  type: string;
  id: string;
  top: number;
  left: number;
}

const styles: CSSProperties = {
  width: 500,
  height: 500,
  border: '1px solid black',
  position: 'relative',
};

export interface ContainerProps {
  hideSourceOnDrag: boolean;
}

export interface ContainerState {
  boxes: { [key: string]: { top: number; left: number; title: string } };
}

export const BoxItem: FC<BoxProps> = ({ id, left, top, hideSourceOnDrag, children }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'box',
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        console.log('BoxItem:item >>', item);
        const dropResult = monitor.getDropResult();
        console.log('BoxItem:dropResult >>', dropResult);
      },
    }),
    [id, left, top]
  );

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }
  return (
    <div className="box" ref={drag} style={{ ...style, left, top }} data-testid="box">
      {children}
    </div>
  );
};

const SourceDropAera = (props: any) => {
  const setSourceBoxes = props.setSourceBoxes;
  const sourceBoxes = props.sourceBoxes;

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      setSourceBoxes((prevState: { [key: string]: { top: number; left: number; title: string } }) => ({
        ...prevState,
        [id]: { top, left, title: prevState[id]?.title },
      }));
    },
    [sourceBoxes, setSourceBoxes]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,

      drop(item: DragItem, monitor) {
        console.log('Source:item >>', item);
        // console.log(DragEvent);
        // console.log(monitor);
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;

        const offet2 = monitor.getInitialSourceClientOffset() as XYCoord;
        const offset = monitor.getSourceClientOffset() as XYCoord;
        const results = monitor.getDropResult();

        console.log('Source:delta', delta);
        console.log('Source:offset', offset);
        console.log('Source:offet2', offet2);
        console.log('Source:results', results);

        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);

        console.log('Source:coord', { left, top });

        moveBox(item.id, left, top);
        return undefined;
      },
    }),
    [moveBox]
  );
  return (
    <div ref={drop} style={styles}>
      {Object.keys(sourceBoxes).map((key) => {
        const { left, top, title } = sourceBoxes[key] as {
          top: number;
          left: number;
          title: string;
        };
        return (
          <BoxItem key={key} id={key} left={left} top={top} hideSourceOnDrag={true}>
            {title}
          </BoxItem>
        );
      })}
    </div>
  );
};

const TargetDropAera = (props: any) => {
  const targetBoxes = props.targetBoxes;
  const setTargetBoxes = props.setTargetBoxes;

  const [{ canDrop, isOver }, drop] = useDrop(() => {
    return {
      accept: ItemTypes.BOX,
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        console.log('Target:item >>', item);
        console.log('Target:item >>', delta);

        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);

        console.log('Target:coord', { left, top });

        const box = document.getElementById('target');
        const rect = box?.getBoundingClientRect();

        const x = monitor.getClientOffset()?.x || 0;
        const y = monitor.getClientOffset()?.y || 0;

        if(rect) {
          const relativeX = x - rect.left;
          const relativeY = y - rect.top;
          console.log('Target:relative', { relativeX, relativeY });
        }


      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    };
  }, []);

  return (
    <Box
      id="target"
      ref={drop}
      sx={{ width: 500, height: 500, border: '5px solid black', position: 'relative', borderColor: isOver ? 'green' : 'black' }}
    ></Box>
  );
};

const SignaturePage: FC<ContainerProps> = ({ hideSourceOnDrag }) => {
  const [sourceBoxes, setSourceBoxes] = useState<{
    [key: string]: {
      top: number;
      left: number;
      title: string;
    };
  }>({
    a: { top: 20, left: 80, title: 'Drag me around' },
    b: { top: 180, left: 20, title: 'Drag me too' },
  });

  const [targetBoxes, setTargetBoxes] = useState<{
    [key: string]: {
      top: number;
      left: number;
      title: string;
    };
  }>({});

  return (
    <div>
      <SourceDropAera sourceBoxes={sourceBoxes} setSourceBoxes={setSourceBoxes}></SourceDropAera>
      <TargetDropAera id="target" targetBoxes={targetBoxes} setTargetBoxes={setTargetBoxes}></TargetDropAera>
    </div>
  );
};

export default SignaturePage;
