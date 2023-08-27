import TextFieldIcon from 'src/assets/textfield.svg'
import Signature from 'src/assets/signature.svg'
import DateField from 'src/assets/date.svg'
import CheckBox from 'src/assets/checkbox.svg'

type Props = {
  color: string
  width: string
  height?: string
}

export const CheckBoxIcon = ({ color, width, height }: Props) => {
  return (
    <svg width={width || '50px'} height={height || '50px'} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 12L11 15L16 9M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V16.8036C20 17.9215 20 18.4805 19.7822 18.9079C19.5905 19.2842 19.2837 19.5905 18.9074 19.7822C18.48 20 17.921 20 16.8031 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z"
        stroke={color || '#494C4D'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
    </svg>
  )
}

type props = {
  type: string
  width?: string
  height?: string
}
const IconSVG = (props: props) => {
  const { type, width, height } = props
  switch (type) {
    case 'signature':
      return <img src={Signature} alt="Singature" width={width || '31px'} />
    case 'date':
      return <img src={DateField} alt="date" width={width || '31px'} />
    case 'checkbox':
      return <CheckBoxIcon color="#494C4D" width='34px'  />
    case 'textField':
      return <img src={TextFieldIcon} alt="textField" width={width || '31px'} />
    default:
      return <></>
  }
}

export default IconSVG
