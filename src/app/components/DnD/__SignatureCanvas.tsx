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
  signatureDataRef: MutableRefObject<{ type: string; data: any; callback?: any }>
  containerRef: any
  disableSaveSignature: boolean
  setDisableSaveSignature: (disable: boolean) => void
}

export const SignatureCanvas = (props: props) => {
  const { signatureDataRef, disableSaveSignature, setDisableSaveSignature } = props
  const dispatch = useDispatch()

  const [color, setColor] = useState('black')
  const [width, setWidth] = useState(0)
  const { setCanvasRef, onCanvasMouseDown, clearCanvas, canvasRef, pointsRef } = useOnDraw(onDraw, drawDot, setDisableSaveSignature)

  /* Effect to set signatureDataRef */
  useEffect(() => {
    if (signatureDataRef.current) {
      signatureDataRef.current = {
        type: 'canvas',
        data: {
          data: '',
        },
        callback: getDataUrl,
      }
    }
  }, [])

  /* Effect to get Canvas board width */
  useEffect(() => {
    if (props.containerRef.current) {
      setWidth(props.containerRef.current.offsetWidth)
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

  function getDataUrl() {
    return canvasRef.current?.toDataURL('image/png')
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

  console.log('width', width)

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
      {width > 0 && (
        <>
          <canvas
            width={width - 10}
            height={500}
            onMouseDown={(e) => onCanvasMouseDown(e, color, pointsRef)}
            style={{
              flex: 1,
              border: '1px solid var(--blue1)',
              backgroundColor: 'transparent',
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
