import { roundToHalf } from '@esign-web/libs/utils';
import { Box } from '@mui/material';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf';
import { useEffect, useRef, useState } from 'react';
import { Document } from 'react-pdf';
import { AutoSizer, List } from 'react-virtualized';
import { PDFPage } from './__PDFPage';
import PDFThumbnail from './__PDFThumbnaiil';
import { nanoid } from 'nanoid';

interface RenderPDFProps {
  documentId: string;
}

enum SignatureType {
  SIGNATURE = 'SIGNATURE',
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  DATE = 'DATE',
  CHECKBOX = 'CHECKBOX',
}

export type Singature = {
  id: string;

  top: number;
  left: number;

  pageNumber: number;
  width?: number;
  height?: number;

  type: SignatureType;

  isMetadata?: boolean;

  // For User
  userName?: string;
  userColor?: string;
  userEamil?: string;

  // For Image
  imageUri?: string;

  // For Text
  text?: string;

  // For Date
  date?: string;

  // For Checkbox
  isChecked?: boolean;
};

export const RenderPDF = (props: RenderPDFProps) => {
  const [numPages, setNumPages] = useState(0);
  const [pageHeight, setPageHeight] = useState<any>(null);
  const [pageWidth, setPageWidth] = useState<any>(null);

  const [index1, setIndex1] = useState<any>(0);
  const [index2, setIndex2] = useState<any>();

  const documentRef = useRef<any>(null);

  const [focusedItem, setFocusedItem] = useState<any>(null);

  /* Temporary State, store Ids only of signatures */
  const [signatures, setSignatures] = useState<{ [key: string]: { [key: string]: Singature } }>({});

  /* To save data of signatures, everytime Drag item is moved, it update this ref */
  const signatureDataRefs = useRef<{ [key: string]: { [key: string]: Singature } }>({});

  useEffect(() => {
    setSignatures({
      page_1: {
        sdfsdf: {
          id: 'sdfsdf',
          top: 10,
          left: 234,
          pageNumber: 1,
          width: 200,
          height: 100,
          type: SignatureType.SIGNATURE,
        },
      },
    });
    signatureDataRefs.current = {
      page_1: {
        sdfsdf: {
          id: 'sdfsdf',
          top: 10,
          left: 234,
          pageNumber: 1,
          width: 200,
          height: 100,
          type: SignatureType.SIGNATURE,
        },
      },
    };
  }, []);

  /* Main Event Handlers */
  const Events = {
    onDocumentLoadSuccess: async (nexPdf: PDFDocumentProxy) => {
      setNumPages(nexPdf.numPages);
      const page = await nexPdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.65 });
      const pageHeight = viewport.height;
      const pageWidth = viewport.width;
      console.log('>> pageHeight', pageHeight);
      console.log('>> pageWidth', pageWidth);

      setPageHeight(pageHeight);
      setPageWidth(pageWidth);
    },
  };

  useEffect(() => {
    document.addEventListener('click', detectClickOutside);

    return () => {
      document.removeEventListener('click', detectClickOutside);
    };
  }, [numPages]);

  const detectClickOutside = (e: any) => {
    e.preventDefault();

    const pdfContent = document.querySelector('#pdf-content');
    if (!pdfContent) return;

    const isClickInside = pdfContent.contains(e.target);

    if (isClickInside) {
      console.log('>> detectClickOutside');
    }
  };
  console.log('>>>>>>>>>>>>>> signatures', signatures);
  console.log('>>>>>>>>>>>>>> signatureDataRefs', signatureDataRefs.current);

  return (
    <Box sx={{ flex: 1, border: '1px solid var(--gray3)', backgroundColor: 'var(--gray6)' }}>
      <Document
        ref={documentRef}
        className="pdf-document"
        file={`http://localhost:4009/api/document/get/${props.documentId}`}
        onLoadSuccess={Events.onDocumentLoadSuccess}
      >
        {pageHeight && pageWidth && (
          <>
            <Box id="pdf-content" sx={{ flex: 1 }}>
              <AutoSizer>
                {({ width }) => (
                  <List
                    height={window.innerHeight - 9 * 10}
                    width={width}
                    rowCount={numPages}
                    rowHeight={pageHeight + 60}
                    onScroll={(e) => {
                      const currentPage = roundToHalf(e.scrollTop / (pageHeight + 60));
                      const thumbnail = document.querySelector(
                        `.react-pdf__Thumbnail__page[data-page-number="${currentPage + 1}"]`
                      );
                      const selectedThumbnail = document.querySelector('.react-pdf__Thumbnail__page.selected');

                      if (selectedThumbnail) {
                        selectedThumbnail.classList.remove('selected');
                      }

                      if (thumbnail) {
                        thumbnail.classList.add('selected');
                      }

                      setIndex1(currentPage);
                      setIndex2(undefined);
                    }}
                    overscanColumnCount={10}
                    scrollToIndex={index2}
                    rowRenderer={({ index, key, style }) => (
                      <PDFPage
                        signatures={signatures}
                        setSignatures={setSignatures}
                        signatureDataRefs={signatureDataRefs}
                        pageHeight={pageHeight}
                        pageWidth={pageWidth}
                        key={key}
                        index={index}
                        style={style}
                      />
                    )}
                  ></List>
                )}
              </AutoSizer>
            </Box>

            <Box sx={{ height: 'calc(100vh - 8.25rem)', width: '250px' }} className="pdf-thumbnail-container">
              <AutoSizer>
                {({ width }) => (
                  <List
                    height={window.innerHeight - 9 * 10}
                    width={width}
                    rowCount={numPages}
                    rowHeight={280}
                    overscanColumnCount={10}
                    scrollToIndex={index1}
                    rowRenderer={({ index, key, style }) => (
                      <div style={{ ...style, width: 'auto', right: '0px' }} key={key}>
                        <PDFThumbnail index={index} indexToScroll={index1} setIndexToScroll={setIndex2} />
                      </div>
                    )}
                  ></List>
                )}
              </AutoSizer>
            </Box>
          </>
        )}
      </Document>
    </Box>
  );
};
