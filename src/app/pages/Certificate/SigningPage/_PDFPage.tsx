import { getHTMLID } from '@esign-web/libs/utils'
import { actions, selectors } from '@esign-web/redux/certificate'
import { Box } from '@mui/material'
import moment from 'moment'
import { useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import { Page } from 'react-pdf'
import { useDispatch, useSelector } from 'react-redux'
import { DragItem } from '../../Document/SigningPage/__Signature'
import { FontFamily, FontSizeToolbar } from 'src/app/pages/Document/DragDrop/__Toolbar'
import { CERT_SIGNATURE_SET, SIGNATRURE_MOVE } from 'libs/redux/certificate/src/lib/constants'
import DraggableItem from 'src/app/pages/Certificate/DragDrop'
import { type } from 'os'
import { FontSize } from '../../Document/DragDrop/__TextOption'

type Props = {
  index: number
  style: any
  pageHeight: number
  pageWidth: number
  totalPage: number
  // setSignatures: (signatures: any) => void

  selectedSignature: any

  setSelectedSignature: (signature: any) => void
  signatureDataRefs: any
}

export const PDFPage = (props: Props) => {
  const { index, style, pageHeight, pageWidth, signatureDataRefs, selectedSignature, setSelectedSignature } = props
  const dispatch = useDispatch()
  const signatures = useSelector(selectors.getSignatures)
  const signer2 = useSelector(selectors.getSigners2)
  const signatures_by_page = signatures[`page_${index + 1}`] || {}
  const signatureDataRefs_by_page = signatureDataRefs.current[`page_${index + 1}`] || {}
  const containerRef = useRef<HTMLDivElement>(null)

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'box',
      drop: (item: DragItem, monitor) => {
        const page = document.querySelector(`.pdf-page[data-page-number="${index + 1}"]`)
        const x = monitor.getClientOffset()?.x
        const y = monitor.getClientOffset()?.y
        const rect = page?.getBoundingClientRect()

        if (rect && x && y) {
          let itemWidth = 200
          let itemHeight = 100

          let relativeX = x - rect.left
          let relativeY = y - rect.top

          if (relativeX < 0) {
            relativeX = 0
          }
          if (relativeY < 0) {
            relativeY = 0
          }

          if (relativeX + itemWidth > pageWidth) {
            relativeX = pageWidth - itemWidth
          }
          if (relativeY + itemHeight > pageHeight) {
            relativeY = pageHeight - itemHeight
          }
          const id = getHTMLID()

          const sizeMapping = {
            signature: {
              width: 250,
              height: 70,
            },
            textField: {
              width: 250,
              height: 50,
            },
            dateField: {
              width: 200,
              height: 50,
            },
            checkbox: {
              width: 200,
              height: 50,
            },
          }

          const newSingature = {
            id: id,
            top: relativeY,
            left: relativeX,
            pageNumber: index + 1,
            type: item.id,
            user: item.user,
            signature_data: {},
            ...sizeMapping[item.id],
          }

          if (item.id === 'textField') {
            newSingature.signature_data['fontSize'] = FontSizeToolbar(1)
            newSingature.signature_data['fontFamily'] = FontFamily[0]
          }

          if (item.id === 'dateField') {
            newSingature.signature_data['data'] = moment().format('DD/MM/YYYY')
            newSingature.signature_data['fontSize'] = FontSize(1)
            newSingature.signature_data['fontFamily'] = FontFamily[0]
          }

          dispatch({ type: CERT_SIGNATURE_SET, payload: newSingature })

          let copy = Object.assign({}, newSingature)

          signatureDataRefs.current = {
            ...signatureDataRefs.current,
            [`page_${index + 1}`]: {
              ...signatureDataRefs.current[`page_${index + 1}`],
              [id]: copy,
            },
          }
          setSelectedSignature({ id: id, pageNumber: index + 1 })
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
    }),
    [signer2]
  )

  /* ----------- MOVE ------------------ */
  const moveItemToPage = (id: string, currentPage: number, nextPage: number, callback: Function) => {
    console.log('MOVE', {
      id,
      currentPage,
      nextPage,
      signatureDataRefs: signatureDataRefs.current,
    })

    const signatureData = signatureDataRefs.current[`page_${currentPage}`][id]

    if (!signatureData) {
      return
    }

    let newTop = 0

    if (currentPage < nextPage) {
      newTop = 0
    } else {
      const itemHeight = signatureData.height
      newTop = pageHeight - itemHeight
    }

    dispatch({
      type: SIGNATRURE_MOVE,
      payload: {
        id,
        currentPage,
        nextPage,
        newTop,
      },
    })

    if (!signatureDataRefs.current[`page_${nextPage}`]) {
      signatureDataRefs.current[`page_${nextPage}`] = {}
    }

    signatureDataRefs.current[`page_${nextPage}`][id] = {
      ...signatureData,
      top: newTop,
      pageNumber: nextPage,
    }

    delete signatureDataRefs.current[`page_${currentPage}`][id]

    /* Move Signature */

    callback()
    setSelectedSignature({ id: id, pageNumber: nextPage })

    /* setSignatures((prevState: { [key: string]: { [key: string]: any } }) => {
      const newSignatures = { ...prevState }

      if (!newSignatures[`page_${nextPage}`]) {
        newSignatures[`page_${nextPage}`] = {}
      }

      newSignatures[`page_${nextPage}`][id] = {
        ...prevState[`page_${currentPage}`][id],
        top: newTop,
        pageNumber: nextPage,
      }

      delete newSignatures[`page_${currentPage}`][id]

      callback()
      return newSignatures
    }) */
  }

  /* ---------  Copy Signatrue Data ----------- */
  const copySignature = (id: string, pageNumber: number, signer_id: string) => {
    const signature = props.signatureDataRefs.current[`page_${pageNumber}`][id]
    const newSignature = {
      ...signature,
      id: getHTMLID(),
      pageNumber: pageNumber,
      top: signature.top + 10,
      left: signature.left + 10,
    }

    dispatch({ type: CERT_SIGNATURE_SET, payload: newSignature })

    signatureDataRefs.current = {
      ...signatureDataRefs.current,
      [`page_${pageNumber}`]: {
        ...signatureDataRefs.current[`page_${pageNumber}`],
        [newSignature.id]: newSignature,
      },
    }
  }

  console.log('LPK signatureDataRefs_by_page', signatureDataRefs)
  console.log('LPK signatures', signatures)

  return (
    <div style={style}>
      <Page
        inputRef={drop}
        className={isOver ? 'pdf-page centered isOver' : 'pdf-page centered'}
        loading={''}
        pageNumber={index + 1}
        width={pageWidth}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        height={pageHeight}
      >
        <Box id={`box_${index + 1}`} ref={containerRef} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 999 }}>
          {Object.keys(signatures_by_page).length > 0 &&
            Object.keys(signatures_by_page).map((key) => {
              const signature = signatureDataRefs_by_page[key]

              if (!signature) {
                console.log('SIGNAUTRE IS NULL')
                return null
              }

              const top = signatureDataRefs_by_page[key].top
              const left = signatureDataRefs_by_page[key].left
              const width = signatureDataRefs_by_page[key].width
              const height = signatureDataRefs_by_page[key].height

              const is_hidden = signatureDataRefs_by_page[key].is_hidden
              const can_move = signatureDataRefs_by_page[key].can_move
              const can_select = signatureDataRefs_by_page[key].can_select
              const can_delete = signatureDataRefs_by_page[key].can_delete
              const can_copy = signatureDataRefs_by_page[key].can_copy
              const is_signed = signatureDataRefs_by_page[key].is_signed === true

              const type = signatureDataRefs_by_page[key].type
              const user = signer2[signatures_by_page[key].user.id]
              const isSelected = selectedSignature.id === signature.id

              return (
                <DraggableItem
                  key={key}
                  id={signatureDataRefs_by_page[key].id}
                  isSelected={isSelected}
                  pageHeight={pageHeight}
                  pageWidth={pageWidth}
                  containerRef={containerRef}
                  pageNumber={index + 1}
                  signatureDataRefs={signatureDataRefs}
                  top={top}
                  left={left}
                  width={width}
                  height={height}
                  color={user.color}
                  signer={user}
                  type={type}
                  totalPage={props.totalPage}
                  moveToPage={moveItemToPage}
                  copySignature={copySignature}
                  setSelectedSignature={setSelectedSignature}
                  data={signatures_by_page[key].signature_data}
                  can_move={can_move}
                  is_hidden={is_hidden}
                  can_select={can_select}
                  can_delete={can_delete}
                  can_copy={can_copy}
                  is_signed={is_signed}
                />
              )
            })}
        </Box>
      </Page>
    </div>
  )
}
