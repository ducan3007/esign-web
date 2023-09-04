import { Box, IconButton, Typography } from '@mui/material'
import { MutableRefObject, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useOnDraw } from '../Canvas/Hook'
import MButton from '../Button'
import './style.scss'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { MTooltip } from '../Tooltip'
import { AutoSave } from 'src/app/pages/Document/SigningPage/__RenderSignerAdd'

type props = {
  signatureDataRef: MutableRefObject<{ type: string; data: any; callback?: any; callback2?: any }>
  containerRef: any
  disableSaveSignature: boolean
  setDisableSaveSignature: (disable: boolean) => void
}

const CANVAS_SCALE = 0.7

export const SignatureCanvas = (props: props) => {
  const { signatureDataRef, disableSaveSignature, setDisableSaveSignature } = props
  const dispatch = useDispatch()

  const [color, setColor] = useState('black')
  const [widthCanvas, setWidth] = useState(0)
  const [heightCanvas, setheight] = useState(0)
  const { setCanvasRef, onCanvasMouseDown, clearCanvas, canvasRef, pointsRef, boundRectRefMin, boundRectRefMax } = useOnDraw(
    onDraw,
    drawDot,
    setDisableSaveSignature,
    widthCanvas,
    heightCanvas
  )

  /* Effect to set signatureDataRef */
  useEffect(() => {
    if (signatureDataRef.current) {
      signatureDataRef.current = {
        type: 'canvas',
        data: {
          data: '',
        },
        callback: getDataUrl,
        callback2: getActualSize,
      }
    }
  }, [])

  console.log('boundRectRefMin', boundRectRefMin.current)
  console.log('boundRectRefMax', boundRectRefMax.current)
  console.log('boundRect', {
    width: boundRectRefMax.current.left - boundRectRefMin.current.left,
    height: boundRectRefMax.current.top - boundRectRefMin.current.top,
  })

  /* Effect to get Canvas board width */
  useEffect(() => {
    if (props.containerRef.current) {
      setWidth(props.containerRef.current.offsetWidth - 10)
      setheight(props.containerRef.current.offsetHeight - 60)
    }
  }, [props.containerRef.current])

  function onDraw(ctx: any, point: number, prevPoint: number) {
    drawLine(prevPoint, point, ctx, color, 5)
    pointsRef.current.push([prevPoint, point])
  }

  function changeColor(newColor: string) {
    setColor(newColor)
    console.log('Canvas:pointsRef', pointsRef.current)
    clearCanvas()
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      pointsRef.current.forEach((point) => {
        if (point[3]) {
          drawDot(point[0], point[1], ctx, newColor, 5)
        } else {
          drawLine(point[0], point[1], ctx, newColor, 5)
        }
      })
    }
  }

  function drawDot(x, y, ctx, color, width) {
    pointsRef.current.push([{ x, y }, { x, y }, true])
    ctx.fillStyle = color ?? 'black'
    ctx.beginPath()
    ctx.arc(x, y, width ?? 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  function clear() {
    clearCanvas()
    pointsRef.current = []
  }

  /**
   * Get the data URL of the canvas
   * @returns
   */
  async function getDataUrl() {
    const scale = 1.0
    let ctx = canvasRef.current.getContext('2d')

    const minRect = boundRectRefMin.current
    const maxRect = boundRectRefMax.current

    const imageData = ctx.getImageData(minRect.left - 5 || 0, minRect.top - 5 || 0, maxRect.left - minRect.left + 10, maxRect.top - minRect.top + 10)

    let temp_canvas = document.createElement('canvas')
    temp_canvas.width = maxRect.left - minRect.left
    temp_canvas.height = maxRect.top - minRect.top

    let temp_ctx = temp_canvas.getContext('2d')

    if (temp_ctx) {
      temp_ctx.putImageData(imageData, 0, 0)
      // Return the base64 data URL from the temp canvas
      let scaledCanvas = await scaleCanvas(temp_canvas)
      if (scaledCanvas) {
        return scaledCanvas.toDataURL('image/png')
      }
    }

    // var image = new Image()
    // image.src = canvasRef.current.toDataURL('image/png')

    // Use the await keyword to wait for the image to load
    // await new Promise((resolve, reject) => {
    //   image.onload = resolve
    //   image.onerror = reject
    // })

    // let temp_canvas = document.createElement('canvas')
    // temp_canvas.width = image.width * scale
    // temp_canvas.height = image.height * scale

    // let temp_ctx = temp_canvas.getContext('2d')

    // if (temp_ctx) {
    //   temp_ctx.drawImage(image, 0, 0, image.width * scale, image.height * scale)
    //   // Return the base64 data URL from the temp canvas
    //   return temp_canvas.toDataURL('image/png')
    // }
    // return canvasRef.current.toDataURL('image/png')
  }

  /**
   * Scale up or down the canvas
   * @param canvas
   */
  async function scaleCanvas(canvas) {
    let image = new Image()
    image.src = canvas.toDataURL('image/png')

    await new Promise((resolve, reject) => {
      image.onload = resolve
      image.onerror = reject
    })

    let temp_canvas = document.createElement('canvas')
    temp_canvas.width = image.width * CANVAS_SCALE
    temp_canvas.height = image.height * CANVAS_SCALE

    let temp_ctx = temp_canvas.getContext('2d')

    if (temp_ctx) {
      temp_ctx.drawImage(image, 0, 0, image.width * CANVAS_SCALE, image.height * CANVAS_SCALE)
      return temp_canvas
    }
  }

  function getActualSize() {
    return {
      width: boundRectRefMax.current.left - boundRectRefMin.current.left,
      height: boundRectRefMax.current.top - boundRectRefMin.current.top,
    }
  }

  function drawLine(start: any, end: any, ctx: any, color: string, width: any) {
    start = start ?? end
    ctx.beginPath()
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  console.log('width', widthCanvas)

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/*  ------------------------------- Options CRUD ----------------------------  */}
      <Box
        sx={{
          height: '50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <button
            onClick={() => {
              clearCanvas(true)
              setDisableSaveSignature(true)
            }}
          >
            Clear Canvas
          </button>
          <button
            onClick={() => {
              const random = Math.floor(Math.random() * 16777215).toString(16)
              changeColor('#' + random)
            }}
          >
            Change Color
          </button>
          <button
            onClick={() => {
              let url = getDataUrl()
              console.log('Canvas:DataUrl', url)
            }}
          >
            Get DataUrl
          </button>
        </Box>
        <AutoSave />
      </Box>

      {/* ------------------- Canvas Board -------------------- */}
      {widthCanvas > 0 && (
        <>
          <canvas
            width={widthCanvas}
            height={heightCanvas}
            onMouseDown={(e) => onCanvasMouseDown(e, color, pointsRef)}
            style={{
              flex: 1,
              border: '1px solid var(--blue1)',
              backgroundColor: 'transparent',
              margin: '5px 5px 5px 5px',
            }}
            ref={setCanvasRef}
          />
          <div
            style={{
              width: '80%',
              height: '1px',
              border: '1px solid var(--gray4)',
              bottom: '30%',
              left: '50%',
              transform: 'translateX(-50%)',
              position: 'absolute',
              zIndex: 1,
            }}
          ></div>
        </>
      )}
    </Box>
  )
}
