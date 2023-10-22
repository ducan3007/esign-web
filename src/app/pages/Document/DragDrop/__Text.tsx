import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

type TextareaSignatureType = {
  signatureDataRefs: any
  signature_id: string
  pageNumber: number
  isSelected?: boolean
}
const canvas = document.createElement('canvas')

export const SignatureTextAreaType = (props: TextareaSignatureType) => {
  const { signature_id, signatureDataRefs, pageNumber } = props
  const [value, setValue] = useState('')
  const element = document.getElementById(`${signature_id}_text`)

  const width = signatureDataRefs.current[`page_${pageNumber}`][signature_id].width
  const height = signatureDataRefs.current[`page_${pageNumber}`][signature_id].height
  const fontFamily = signatureDataRefs.current[`page_${pageNumber}`][signature_id].signature_data.fontFamily
  const fontSize = signatureDataRefs.current[`page_${pageNumber}`][signature_id].signature_data.fontSize
  const textRef = useRef<any>(null)

  const textareaRef = useRef<any>()

  useEffect(() => {
    if(signatureDataRefs.current[`page_${pageNumber}`][signature_id].signature_data.data !== ''){
      setValue(signatureDataRefs.current[`page_${pageNumber}`][signature_id].signature_data.data)
    }
  }, [])


  return (
    <>
      <textarea
        ref={textareaRef}
        id={`${signature_id}_text`}
        onChange={(e) => {
          if (textareaRef.current) {
            if (textareaRef.current.style.overflow === 'hidden') {
              textareaRef.current.style.overflow = 'auto'
            }
          }
          setValue(e.target.value)
          signatureDataRefs.current[`page_${pageNumber}`][signature_id].signature_data.data = e.target.value
        }}
        value={value}
        onFocus={(e) => {
          if (textareaRef.current) {
            textareaRef.current.style.overflow = 'auto'
          }
        }}
        onClick={(e) => {
          if (textareaRef.current) {
            textareaRef.current.style.overflow = 'auto'
          }
        }}
        onBlur={(e) => {
          if (textareaRef.current) {
            console.log('set Selection Range', textareaRef.current)
            // textareaRef.current.focus()
            //textareaRef.current.setSelectionRange(0, 0)
            // scroll to top
            textareaRef.current.style.overflow = 'auto'
            textareaRef.current.scrollTop = 0
            textareaRef.current.scrollLeft = 0
            textareaRef.current.style.overflow = 'hidden'
          }
        }}
        className={fontFamily.value}
        spellCheck="false"
        wrap="off"
        tabIndex={-1}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          color: 'var(--dark)',
          resize: 'none',
          outline: 'none',
          fontSize: fontSize.pixel,
          lineHeight: fontSize.lineHeight,
          padding: '0px',
          margin: '0px',
          whiteSpace: 'nowrap',
          letterSpacing: '0px',
          scrollbarWidth: 'none',
          overflow: props.isSelected ? 'auto' : 'hidden',
          // fontFamily: fontFamily.fontFamily
        }}
        placeholder="Type something here..."
      ></textarea>
    </>
  )
}
