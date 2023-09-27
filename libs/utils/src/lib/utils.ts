import { PDF_SCALING_RATIO } from './@Types'
import html2canvas from 'html2canvas'

export const FILE_SERVICE = process.env.NX_FILE_SERVER_URL

export function roundToHalf(num: number) {
  if (num % 1 >= 0.5) return Math.ceil(num)
  return Math.floor(num)
}

export function getRandomColor() {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)
  return `rgb(${r},${g},${b})`
}

export const rgba = (color: string, alpha: number) => {
  const p = color
    .replace(' ', '')
    .substring(color.indexOf('(') + 1, color.length - 1)
    .split(', ')
  return `rgba(${p[0]}, ${alpha})`
}

export const getHTMLID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}

export const getFontSizeWithScale = (px: string) => {
  const pixel = px.split('px')[0]
  return Math.round(parseFloat(pixel) / PDF_SCALING_RATIO.value)
}

export const getFontSize = (px: string) => {
  return px.split('px')[0]
}

export const getFontSizePx = (px: string): string => {
  const pixel = px.split('px')[0]
  return `${Math.round(parseFloat(pixel) / PDF_SCALING_RATIO.value)}px`
}

export const getFormatFromBase64 = (base64: string) => {
  const format = base64.split(';')[0].split('/')[1]
  return format
}

export const html2Canvas = async (id: string, options: any) => {
  try {
    let element = document.getElementById(id)
    if (!element) return

    element.setAttribute('width', `${options.width}px`)
    element.setAttribute('height', `${options.height}px`)

    let svgString = new XMLSerializer().serializeToString(element)

    let canvas = await html2canvas(element, {
      allowTaint: true,
      backgroundColor: 'transparent',
    })

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.log(error)
  }
}
