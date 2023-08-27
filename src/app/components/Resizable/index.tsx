import { useEffect, useState } from 'react'
import { Resizable } from 'react-resizable'

type props = {
  id: string
  signatureDataRefs: any
  pageNumber: number
  pageHeight: number
  pageWidth: number
  width: number
  height: number
  minconstraints?: any
  maxconstraints?: any
  disabled?: boolean
  setSelectedSignature: any
  children: any
}
export const ResizableItem = (props: props) => {
  const { pageNumber, id, pageHeight, pageWidth, signatureDataRefs, disabled } = props
  const [state, setState] = useState({
    width: props.width,
    height: props.height,
  })

  /* Todo: Check if item goes near corner, need to update min/max Constraints */

  // console.log('>>>>>>>>>>>> signatureDataRefs', signatureDataRefs)
  const onResize = (e: React.SyntheticEvent, { element, size }: any) => {
    e.stopPropagation()

    if (disabled) {
      return
    }

    let { width, height } = size

    let boxTop = signatureDataRefs.current[`page_${pageNumber}`][id].top
    let boxLeft = signatureDataRefs.current[`page_${pageNumber}`][id].left

    if (boxTop + height >= pageHeight || boxLeft + width >= pageWidth) {
      return
    }

    signatureDataRefs.current[`page_${pageNumber}`][id].height = height
    signatureDataRefs.current[`page_${pageNumber}`][id].width = width

    setState(size)
  }

  const onResizeStart = (e: React.SyntheticEvent, { element, size }: any) => {
    e.stopPropagation()
    e.preventDefault()
    console.log('onResizeStart', size)
  }

  const onResizeStop = (e: React.SyntheticEvent, { element, size }: any) => {
    e.stopPropagation()
    e.preventDefault()
    props.setSelectedSignature({ id: id, pageNumber: pageNumber })
    console.log('onResizeStop', size)
  }

  useEffect(() => {
    if (props.width !== state.width || props.height !== state.height) {
      setState({
        width: props.width,
        height: props.height,
      })
    }
  }, [props.width, props.height])

  return (
    <Resizable
      width={state.width}
      height={state.height}
      // minConstraints={props.minconstraints}
      // maxConstraints={props.maxconstraints}
      onResizeStart={onResizeStart}
      onResize={onResize}
      onResizeStop={onResizeStop}
      axis="both"
    >
      <div
        id={`${id}_rz`}
        style={{ width: state.width + 'px', height: state.height + 'px', border: '1px solid var(--gray3)', backgroundColor: 'transparent' }}
      >
        {props.children}
      </div>
    </Resizable>
  )
}
