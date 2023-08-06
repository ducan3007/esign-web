import { Box } from '@mui/material';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Page } from 'react-pdf';
import DraggableItem from 'src/app/components/DnD';
import { DragItem } from './__RenderSignature';
import { nanoid } from 'nanoid';

type Props = {
  index: number;
  style: any;
  pageHeight: number;
  pageWidth: number;

  signatures: { [key: string]: any };
  setSignatures: (signatures: any) => void;
  signatureDataRefs: { [key: string]: any };
};

export const PDFPage = (props: Props) => {
  const { index, style, pageHeight, pageWidth, signatures, setSignatures, signatureDataRefs } = props;

  const signatures_by_page = signatures[`page_${index + 1}`] || {};
  const signatureDataRefs_by_page = signatureDataRefs.current[`page_${index + 1}`] || {};

  const containerRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'box',
      drop(item: DragItem, monitor) {
        console.log('>>>>>>>>>> item', item);
        const page = document.querySelector(`.pdf-page[data-page-number="${index + 1}"]`);

        const x = monitor.getSourceClientOffset()?.x;
        const y = monitor.getSourceClientOffset()?.y;

        const rect = page?.getBoundingClientRect();

        if (rect && x && y) {
          const relativeX = x - rect.left;
          const relativeY = y - rect.top;
          console.log('>>>>>>>>>>>> Page:relative', { relativeX, relativeY });

          const newSingature = {
            id: nanoid(),
            top: relativeY,
            left: relativeX,
            pageNumber: index + 1,
            width: 200,
            height: 100,
            type: 'signature',
          };
          setSignatures((prevState: { [key: string]: { [key: string]: any } }) => ({
            ...prevState,
            [`page_${index + 1}`]: {
              ...prevState[`page_${index + 1}`],
              [newSingature.id]: newSingature,
            },
          }));
          signatureDataRefs.current = {
            ...signatureDataRefs.current,
            [`page_${index + 1}`]: {
              ...signatureDataRefs.current[`page_${index + 1}`],
              [newSingature.id]: newSingature,
            },
          };
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
    }),
    []
  );
  console.log(`Page: ${index + 1} signatures:`, signatures);
  console.log(`Page: ${index + 1} signatureDataRefs:`, signatureDataRefs.current);

  return (
    <div style={style}>
      <Page
        inputRef={drop}
        className={isOver ? 'pdf-page centered isOver' : 'pdf-page centered'}
        loading={''}
        pageNumber={index + 1}
        // scale={1.2}
        width={pageWidth}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        height={pageHeight}
      >
        <Box
          id={`box_${index + 1}`}
          ref={containerRef}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 999,
          }}
        >
          {Object.keys(signatures_by_page).length > 0 &&
            Object.keys(signatures_by_page).map((key) => {
              const signature = signatures_by_page[key];

              if (!signature) {
                return null;
              }

              const top = signatureDataRefs_by_page[key].top;
              const left = signatureDataRefs_by_page[key].left;
              const width = signatureDataRefs_by_page[key].width;
              const height = signatureDataRefs_by_page[key].height;

              return (
                <DraggableItem
                  key={key}
                  id={signature.id}
                  containerRef={containerRef}
                  pageNumber={index + 1}
                  signatureDataRefs={signatureDataRefs}
                  top={top}
                  left={left}
                  width={width}
                  height={height}
                />
              );
            })}
          {/* {index + 1 === 1 && <DraggableItem id="1" top={100} left={120} pageNumber={index + 1} containerRef={containerRef} />}
          {index + 1 === 1 && <DraggableItem id="2" pageNumber={index + 1} containerRef={containerRef} />}
          {index + 1 === 1 && <DraggableItem id="3" pageNumber={index + 1} containerRef={containerRef} />} */}
        </Box>
      </Page>
    </div>
  );
};
