import { CheckIcon } from 'src/app/components/Icon'

type CheckboxSignatureType = {
  signatureDataRefs: any
  signature_id: string
  pageNumber: number
}

export const SignatureCheckboxType = (props: CheckboxSignatureType) => {
  return (
    <div
      id={`${props.signature_id}_checkbox`}
      style={{
        width: '100%',
        height: '100%', 
      }}
    >
      <CheckIcon color="#494C4D" width="100%" height="100%" />
    </div>
  )
}
