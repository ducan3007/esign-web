import { Box } from '@mui/material';
import { useState, type CSSProperties, type FC, type ReactNode, useCallback, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { XYCoord } from 'react-dnd';
import DraggableItem from 'src/app/components/DnD';

const style: CSSProperties = {
  // position: 'absolute',
  width: 51,
  height: 51,
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  cursor: 'move',
};

export interface BoxProps {
  id: any;
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

export interface ContainerProps {
  hideSourceOnDrag: boolean;
}

export interface ContainerState {
  boxes: { [key: string]: { top: number; left: number; title: string } };
}

export const BoxItem: FC<BoxProps> = ({ id, children }) => {
  const [, drag] = useDrag(
    () => ({
      type: 'box',
      item: { id },
    }),
    [id]
  );

  return (
    <Box sx={{ width: '100%', cursor: 'move', height: '50px', border: '1px solid var(--gray3)' }} ref={drag} data-testid="box">
      {children}
    </Box>
  );
};

export const RenderSignature = () => {
  const [sourceBoxes, setSourceBoxes] = useState<{ [key: string]: { top: number; left: number; title: string } }>({
    a: { top: 0, left: 20, title: 'A' },
    b: { top: 0, left: 20, title: 'B' },
    c: { top: 0, left: 20, title: 'C' },
    d: { top: 0, left: 20, title: 'D' },
  });

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,

      drop(item: DragItem, monitor) {
        // console.log('Source:item >>', item);
        // // console.log(DragEvent);
        // // console.log(monitor);
        // const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;

        // const offet2 = monitor.getInitialSourceClientOffset() as XYCoord;
        // const offset = monitor.getSourceClientOffset() as XYCoord;
        // const results = monitor.getDropResult();

        // console.log('Source:delta', delta);
        // console.log('Source:offset', offset);
        // console.log('Source:offet2', offet2);
        // console.log('Source:results', results);

        // let left = Math.round(item.left + delta.x);
        // let top = Math.round(item.top + delta.y);

        // if (left < 0) left = 0;
        // if (top < 0) top = 0;

        // console.log('Source:coord', { left, top });

        return undefined;
      },
    }),
    []
  );

  return (
    <Box
      id="signature_container"
      sx={{
        border: '1px solid var(--gray3)',
        width: '350px',
        height: 'calc(100vh - 9rem)',
        padding: '1rem',
      }}
    >
      <Box
        ref={drop}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {Object.keys(sourceBoxes).map((key) => {
          const { left, top, title } = sourceBoxes[key] as {
            top: number;
            left: number;
            title: string;
          };
          return (
            <BoxItem key={key} id={key}>
              {title}
            </BoxItem>
          );
        })}
      </Box>
    </Box>
  );
};
