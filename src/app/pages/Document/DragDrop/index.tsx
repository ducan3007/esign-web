import { selectors } from '@esign-web/redux/document'
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Signers } from 'src/app/pages/Document/SigningPage/__Signer'
import { ResizableItem } from '../../../components/Resizable'
import { SignatureCheckboxType } from './__Checkbox'
import { DateTextAreaType } from './__DateField'
import { SignatureNoneType } from './__None'
import { SignatureImageType } from './__Signature'
import { SignatureTextAreaType } from './__Text'
import { BaseToolbar } from './__Toolbar'

interface props {
  id: string
  containerRef: any
  signatureDataRefs?: any
  totalPage: number
  pageNumber: number

  top?: number
  left?: number
  width?: number
  height?: number
  pageHeight?: number
  pageWidth?: number
  isSelected?: boolean

  color: string
  signer: Signers
  isMySignature: boolean
  type: string
  data: any

  can_move: boolean
  is_hidden: boolean
  can_select: boolean
  can_delete: boolean
  can_copy: boolean
  is_signed: boolean
  isDisableAddSigner: boolean

  moveToPage: (id: string, currentPage: number, nextPage: number, callback: Function) => void
  copySignature: (id: string, pageNumber: number, sigenr_id: string) => void
  setSelectedSignature: (signature: any) => void
}

export const TypeMapping = {
  signature: 'Signature',
  dateField: 'Date field',
  textField: 'Text field',
  checkbox: 'Checkbox',
}

export interface DragItem {
  type: string
  id: string
  top: number
  left: number
}

const DraggableItem = (props: props) => {
  const dispatch = useDispatch()
  const signer2 = useSelector(selectors.getSigners2)

  const pdfPage = document.querySelector(`.pdf-page[data-page-number="${props.pageNumber}"]`)
  const coord = document.getElementById(`${props.id}_coord`)
  const top = useRef(props.top || 0)
  const left = useRef(props.left || 0)

  const [isMouseDown, setIsMouseDown] = useState(false)

  const elmRef = useRef<any>(null)
  const diffY = useRef(0)
  const diffX = useRef(0)

  const containerRef = props.containerRef

  /* Effect:  */
  useLayoutEffect(() => {
    if (isMouseDown) {
      document.addEventListener('mouseup', mouseUp)
      document.addEventListener('mousemove', mouseMove)

      if (elmRef.current) {
        elmRef.current.style.cursor = 'move'
      }
    }

    if (elmRef.current) {
      elmRef.current.style.cursor = 'move'
    }

    return () => {
      document.removeEventListener('mouseup', mouseUp)
      document.removeEventListener('mousemove', mouseMove)
    }
  }, [isMouseDown])


  const mouseDown = (e: any) => {
    e.stopPropagation()
    if (props.can_move === false) {
      return
    }

    if (!props.isSelected) {
      props.setSelectedSignature({
        id: props.id,
        pageNumber: props.pageNumber,
      })
    }

    pdfPage?.classList.add('isOver')

    setIsMouseDown(true)

    const mouseY = e.clientY
    const mouseX = e.clientX

    if (!elmRef.current || !containerRef.current) {
      return
    }
    /* top and left positions */
    const elmY = elmRef.current.offsetTop
    const elmX = elmRef.current.offsetLeft

    /* diff from (0,0) to mousedown point */
    diffY.current = mouseY - elmY
    diffX.current = mouseX - elmX
  }

  const mouseMove = (e: any) => {
    e.preventDefault()

    if (props.can_move === false) return

    if (!isMouseDown) return

    let height = 0
    let width = 0

    if (elmRef.current) {
      height = elmRef.current.offsetHeight
      width = elmRef.current.offsetWidth
    }

    /* new mouse coordinates */
    const newMouseY = e.clientY
    const newMouseX = e.clientX

    /* calc new top, left pos of elm */
    let newTop = newMouseY - diffY.current,
      newLeft = newMouseX - diffX.current,
      newBottom = newTop + height,
      newElmRight = newLeft + width

    /* get container dimensions */
    if (!containerRef.current) {
      return
    }

    const containerWidth = containerRef.current.offsetWidth
    const containerHeight = containerRef.current.offsetHeight

    if (newTop < 0 || newLeft < 0 || newTop + height > containerHeight || newLeft + width > containerWidth) {
      if (props.pageNumber !== 1) {
        if (newTop < -80) {
          return props.moveToPage(props.id, props.pageNumber, props.pageNumber - 1, function () {
            pdfPage?.classList.remove('isOver')
          })
        }
      }

      // Top
      if (newTop < 0) {
        newTop = 0
      }

      // Left
      if (newLeft < 0) {
        newLeft = 0
      }

      // Bottom
      if (newBottom > containerHeight) {
        newTop = containerHeight - height
      }

      // Right
      if (newElmRight > containerWidth) {
        newLeft = containerWidth - width
      }

      if (props.pageNumber !== props.totalPage) {
        if (newBottom > containerHeight + 80) {
          return props.moveToPage(props.id, props.pageNumber, props.pageNumber + 1, function () {
            pdfPage?.classList.remove('isOver')
          })
        }
      }
    }

    move(newTop, newLeft)
  }

  const mouseUp = (e: any) => {
    e.preventDefault()
    pdfPage?.classList.remove('isOver')
    setIsMouseDown(false)
  }

  const move = (Y: number, X: number) => {
    top.current = Y
    left.current = X

    if (elmRef.current) {
      props.signatureDataRefs.current[`page_${props.pageNumber}`][props.id].top = Y
      props.signatureDataRefs.current[`page_${props.pageNumber}`][props.id].left = X

      elmRef.current.style.top = `${Y}px`
      elmRef.current.style.left = `${X}px`

      if (coord) {
        coord.innerHTML = `(${X}, ${Y})`
      }
    }
  }

  /* 
    Effect: Show or hide resize button when select Signature
  */
  useEffect(() => {
    if (!props.isSelected) {
      // if not selected, display none react-resizable-handle span
      const reactResizable = document.querySelector(`#${props.id} .react-resizable`)
      if (reactResizable) {
        const reactResizableHandle = reactResizable.querySelector('.react-resizable-handle') as HTMLElement
        if (reactResizableHandle) {
          reactResizableHandle.style.display = 'none'
        }
      }
    } else {
      // if selected, add react-resizable-handle span

      const reactResizable = document.querySelector(`#${props.id} .react-resizable`)
      if (reactResizable) {
        const reactResizableHandle = reactResizable.querySelector('.react-resizable-handle') as HTMLElement
        if (reactResizableHandle) {
          reactResizableHandle.style.display = 'block'
        }
      }
    }
  }, [props.isSelected, props.id])

  return (
    <div
      id={props.id}
      ref={elmRef}
      style={{
        position: 'absolute',
        top: top.current,
        left: left.current,
        border: props.isSelected ? `2px solid ${props.color}` : '2px solid transparent',
        userSelect: 'none',
        width: 'fit-content',
        height: 'fit-content',
      }}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        if (props.can_select === false) return
        props.setSelectedSignature({
          id: props.id,
          pageNumber: props.pageNumber,
        })
      }}
      onMouseDown={mouseDown}
    >
      {props.isSelected && (
        <BaseToolbar
          id={props.id}
          isDisableAddSigner={props.isDisableAddSigner}
          isMySignature={props.isMySignature}
          signatureDataRefs={props.signatureDataRefs}
          type={props.type}
          pageNumber={props.pageNumber}
          signer2={signer2}
          copySignature={props.copySignature}
          selectedSigner={props.signer}
          can_delete={props.can_delete}
          can_copy={props.can_copy}
        />
      )}
      <ResizableItem
        id={props.id}
        setSelectedSignature={props.setSelectedSignature}
        signatureDataRefs={props.signatureDataRefs}
        pageNumber={props.pageNumber}
        pageHeight={props.pageHeight || 0}
        pageWidth={props.pageWidth || 0}
        width={props.width || 100}
        height={props.height || 100}
        // minconstraints={[1, 1]}
        // maxconstraints={[500, 500]}
        // setWidth={setWidth}
        // setHeight={setHeight}
      >
        {props.type === 'textField' && (props.isMySignature || props.is_signed) && (
          <SignatureTextAreaType
            isSelected={props.isSelected}
            signatureDataRefs={props.signatureDataRefs}
            signature_id={props.id}
            pageNumber={props.pageNumber}
          />
        )}

        {props.type === 'signature' && (props.isMySignature || props.is_signed) && (
          <SignatureImageType data={props.data} signatureDataRefs={props.signatureDataRefs} signature_id={props.id} pageNumber={props.pageNumber} />
        )}

        {props.type === 'checkbox' && (props.isMySignature || props.is_signed) && (
          <SignatureCheckboxType signatureDataRefs={props.signatureDataRefs} signature_id={props.id} pageNumber={props.pageNumber} />
        )}

        {props.type === 'dateField' && (props.isMySignature || props.is_signed) && (
          <DateTextAreaType signatureDataRefs={props.signatureDataRefs} signature_id={props.id} pageNumber={props.pageNumber} />
        )}

        {!props.isMySignature && !props.is_signed && <SignatureNoneType id={props.id} type={props.type} signer={props.signer} />}
      </ResizableItem>
    </div>
  )
}

export default memo(DraggableItem, (prevProps, nextProps) => {
  if (prevProps.isSelected !== nextProps.isSelected) return false
  if (prevProps.top !== nextProps.top) return false
  if (prevProps.left !== nextProps.left) return false
  if (prevProps.width !== nextProps.width) return false
  if (prevProps.height !== nextProps.height) return false
  if (prevProps.pageHeight !== nextProps.pageHeight) return false
  if (prevProps.pageWidth !== nextProps.pageWidth) return false
  if (prevProps.pageNumber !== nextProps.pageNumber) return false
  if (prevProps.totalPage !== nextProps.totalPage) return false
  if (prevProps.isMySignature !== nextProps.isMySignature) return false
  if (prevProps.type !== nextProps.type) return false
  if (prevProps.id !== nextProps.id) return false
  if (prevProps.signer !== nextProps.signer) return false
  if (prevProps.color !== nextProps.color) return false
  if (prevProps.data !== nextProps.data) return false
  if (prevProps.isDisableAddSigner !== nextProps.isDisableAddSigner) return false
  // if (prevProps.can_move !== nextProps.can_move) return false
  // if (prevProps.is_hidden !== nextProps.is_hidden) return false
  // if (prevProps.can_select !== nextProps.can_select) return false
  // if (prevProps.can_delete !== nextProps.can_delete) return false
  // if (prevProps.is_signed !== nextProps.is_signed) return false
  return true
})

// export default DraggableItem
