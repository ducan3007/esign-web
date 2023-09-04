import { useEffect, useLayoutEffect, useState } from 'react'
import moment from 'moment'

type DateSignatureType = {
  signatureDataRefs: any
  signature_id: string
  pageNumber: number
}

export const DateTextAreaType = (props: DateSignatureType) => {
  const { signature_id, signatureDataRefs, pageNumber } = props

  const [value, setValue] = useState('Controlled')

  const formats = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY', 'DD.MM.YYYY', 'DD.MM.YY']

  useEffect(() => {
    setValue(moment().format('DD/MM/YYYY'))
  }, [])

  console.log('DateTextAreaType', signatureDataRefs.current[`page_${pageNumber}`][signature_id].signature_data.data)

  return (
    <textarea
      onChange={(e) => {
        setValue(e.target.value.trim().replace(/[^0-9.\/-]/g, ''))
        signatureDataRefs.current[`page_${pageNumber}`][signature_id].signature_data = {
          data: e.target.value,
        }
      }}
      onBlur={(e) => {
        console.log('valid', moment(e.target.value.trim(), 'DD/MM/YYYY', true).isValid())
        if (e.target.value === '') {
          setValue(moment().format('DD/MM/YYYY'))
        }
        if (!moment(e.target.value.trim(), 'DD/MM/YYYY',true).isValid()) {
          setValue(moment().format('DD/MM/YYYY'))
        }
      }}
      value={value}
      className="font_plus_jakarta_sans"
      spellCheck="false"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        color: 'var(--dark)',
        resize: 'none',
        outline: 'none',
        fontSize: '2.7rem',
      }}
      placeholder="Type something here..."
    ></textarea>
  )
}
