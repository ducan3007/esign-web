import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Document, Outline, Page, Thumbnail } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

interface RenderPDFProps {
  documentId: string;
}

export const RenderPDF = (props: RenderPDFProps) => {
  const [numPages, setNumPages] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // useEffect(() => {
  //   // Fetch the document as a blob
  //   fetch(`http://localhost:4009/api/document/get/${props.documentId}`)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const url = URL.createObjectURL(blob);
  //       console.log('>>>>>> url', url);
  //       setPdfUrl(url);
  //     });
  // }, [props.documentId]);

  // if (!pdfUrl) return null;

  return (
    <Box
      sx={{
        flex: 1,
        border: '1px solid var(--gray3)',
        // height: 'calc(100vh - 13rem)',
        // overflowY: 'auto',
        backgroundColor: 'var(--gray3)',
      }}
    >
      <Document
        className={`pdf-document`}
        file={`http://localhost:4009/api/document/get/${props.documentId}`}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading..."
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            height: 'calc(100vh - 12.25rem)',
            '&::-webkit-scrollbar': {
              width: '15px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'var(--orange)',
            },
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            // flexDirection: 'column',
          }}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              className="pdf-page"
              // width={window.innerWidth > 1200 ? 1200 : window.innerWidth}
              // width={window.innerWidth}
              scale={1.7}
              // width=
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
            />
          ))}
        </Box>
        <Box
          sx={{
            overflowY: 'auto',
            height: 'calc(100vh - 12.25rem)',
            backgroundColor: 'var(--gray3)',
            '&::-webkit-scrollbar': {
              width: '15px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'var(--orange)',
            },
          }}
          className="pdf-thumbnail-container"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Thumbnail
              key={`thumbnail_${index + 1}`}
              className="pdf-thumbnail"
              width={window.innerWidth > 260 ? 260 : window.innerWidth}
              pageNumber={index + 1}
              onItemClick={(e) => {
                const page = document.querySelector(`.pdf-page[data-page-number="${e.pageNumber}"]`);
                const thumbnail = document.querySelector(`.react-pdf__Thumbnail__page[data-page-number="${e.pageNumber}"]`);
                const selectedThumbnail = document.querySelector('.react-pdf__Thumbnail__page.selected');

                if (selectedThumbnail) {
                  selectedThumbnail.classList.remove('selected');
                }

                if (thumbnail) {
                  thumbnail.classList.add('selected');
                }

                if (page) {
                  page.scrollIntoView({ block: 'center', inline: 'center' });
                }
              }}
            >
              <Typography
                sx={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'var(--dark)',
                  fontSize: '2rem',
                }}
              >
                {index + 1}
              </Typography>
            </Thumbnail>
          ))}
        </Box>
      </Document>
    </Box>
  );
};
