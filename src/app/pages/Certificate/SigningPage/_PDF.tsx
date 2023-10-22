import { PDF_SCALING_RATIO, roundToHalf } from '@esign-web/libs/utils'
import { selectors } from '@esign-web/redux/auth'
import { actions, selectors as certSelectors } from '@esign-web/redux/certificate'
import { selectors as sigSelectors } from '@esign-web/redux/signatures'
import { Box } from '@mui/material'
import { CERT_SIGNATURES_CLEAR_ALL } from 'libs/redux/certificate/src/lib/constants'
import { SIGNATURES_CLEAR_ALL } from 'libs/redux/document/src/lib/constants'
import { Signature } from 'libs/redux/signatures/src/lib/reducers'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf'
import { useEffect, useRef, useState } from 'react'
import { Document } from 'react-pdf'
import { useDispatch, useSelector } from 'react-redux'
import { AutoSizer, List } from 'react-virtualized'
import { PDFPage } from './_PDFPage'
import PDFThumbnail from './_PDFThumbnail'
import SignatureEditModal from '../DragDrop/_SIgnatureModal'

interface RenderPDFProps {
  documentId: string
  setIsPDFLoaded: (isLoaded: boolean) => void
}

const RenderPDF = (props: RenderPDFProps) => {
  const dispatch = useDispatch()
  const signatures = useSelector(certSelectors.getSignatures)
  const isOpen = useSelector(sigSelectors.getModalState)
  const [numPages, setNumPages] = useState(0)
  const [pageHeight, setPageHeight] = useState<any>(null)
  const [pageWidth, setPageWidth] = useState<any>(null)
  const [index1, setIndex1] = useState<any>(0)
  const [index2, setIndex2] = useState<any>()
  const containerRef = useRef<any>()
  const [render, setRender] = useState(false)
  const signatureDataRefs = useRef<{ [page_number: string]: { [id: string]: Signature } }>({})
  const [selectedSignature, setSelectedSignature] = useState<any>({})

  useEffect(() => {
    return () => {
      dispatch({
        type: CERT_SIGNATURES_CLEAR_ALL,
        payload: {},
      })
    }
  }, [])

  /* 
    Effect to sync signatures from redux to refState
  */
  useEffect(() => {
    const copySignature = Object.assign({}, signatures)
    signatureDataRefs.current = copySignature
    setRender(!render)
  }, [signatures])

  /* Event Handlers */
  const onDocumentLoadSuccess = async (nexPdf: PDFDocumentProxy) => {
    setNumPages(nexPdf.numPages)
    const page = await nexPdf.getPage(1)
    const viewport = page.getViewport({ scale: 1 })
    const pageHeight = viewport.height
    const pageWidth = viewport.width

    let newScale = 1000 / pageWidth

    if (newScale) {
      let newViewport = page.getViewport({ scale: newScale })
      PDF_SCALING_RATIO.value = newScale
      let newPageHeight = newViewport.height
      let newPageWidth = newViewport.width
      setPageHeight(newPageHeight)
      setPageWidth(newPageWidth)
    }

    props.setIsPDFLoaded(true)
  }

  const PAGE_GAP = 40 * PDF_SCALING_RATIO.value


  return (
    <Box
      ref={containerRef}
      onClick={(e) => {
        e.preventDefault()
        if (!isOpen) {
          setSelectedSignature({})
        }
      }}
      sx={{ flex: 1, border: '1px solid var(--gray3)', backgroundColor: 'var(--light-gray)' }}
    >
      <Document
        className="pdf-document"
        file={`${process.env.NX_SERVER_URL}/file/get/${props.documentId}`}
        onLoadSuccess={onDocumentLoadSuccess}
        loading=""
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
                    rowHeight={pageHeight + PAGE_GAP}
                    onScroll={(e) => {
                      const currentPage = roundToHalf(e.scrollTop / (pageHeight + PAGE_GAP))
                      const thumbnail = document.querySelector(`.react-pdf__Thumbnail__page[data-page-number="${currentPage + 1}"]`)
                      const selectedThumbnail = document.querySelector('.react-pdf__Thumbnail__page.selected')

                      if (selectedThumbnail) {
                        selectedThumbnail.classList.remove('selected')
                      }

                      if (thumbnail) {
                        thumbnail.classList.add('selected')
                      }

                      setIndex1(currentPage)
                      setIndex2(undefined)
                    }}
                    overscanColumnCount={10}
                    scrollToIndex={index2}
                    rowRenderer={({ index, key, style }) => (
                      <PDFPage
                        signatureDataRefs={signatureDataRefs}
                        pageHeight={pageHeight}
                        pageWidth={pageWidth}
                        totalPage={numPages}
                        selectedSignature={selectedSignature}
                        setSelectedSignature={setSelectedSignature}
                        key={key}
                        index={index}
                        style={style}
                      />
                    )}
                  ></List>
                )}
              </AutoSizer>
            </Box>

            <Box sx={{ height: 'calc(100vh - 8.25rem)', width: '250px', paddingTop: '5px' }} className="pdf-thumbnail-container">
              <AutoSizer>
                {({ width }) => (
                  <List
                    width={width}
                    height={window.innerHeight - 9 * 10}
                    rowCount={numPages}
                    rowHeight={183 + 60 * PDF_SCALING_RATIO.value}
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

      <SignatureEditModal selectedSignature={selectedSignature} />
    </Box>
  )
}

export default RenderPDF
