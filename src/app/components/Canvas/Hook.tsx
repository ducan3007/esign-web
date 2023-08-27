import { useEffect, useRef } from 'react'

export function useOnDraw(onDraw: any, drawDot: any, setDisableSaveSignature: any) {
  const canvasRef = useRef<any>(null)
  const pointsRef = useRef<any>([])
  const isDrawingRef = useRef<any>(false)
  const prevPointRef = useRef<any>(null)

  const mouseMoveListenerRef = useRef<any>(null)
  const mouseUpListenerRef = useRef<any>(null)

  function setCanvasRef(ref) {
    canvasRef.current = ref
  }

  function onCanvasMouseDown(e, color, pointsRef) {
    isDrawingRef.current = true
    // draw a dot on mouse down
    const ctx = canvasRef.current.getContext('2d')
    const rect = ctx.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    drawDot(x, y, ctx, color, 2)
  }

  function clearCanvas(isClearAll = false) {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      if (isClearAll) {
        pointsRef.current = []
      }
    }
  }

  useEffect(() => {
    function computePointInCanvas(clientX, clientY) {
      if (canvasRef.current) {
        const boundingRect = canvasRef.current.getBoundingClientRect()
        return {
          x: clientX - boundingRect.left,
          y: clientY - boundingRect.top,
        }
      } else {
        return null
      }
    }
    function initMouseMoveListener() {
      const mouseMoveListener = (e) => {
        if (isDrawingRef.current && canvasRef.current) {
          const point = computePointInCanvas(e.clientX, e.clientY)
          const ctx = canvasRef.current.getContext('2d')
          if (onDraw) onDraw(ctx, point, prevPointRef.current)
          prevPointRef.current = point
        }
      }
      mouseMoveListenerRef.current = mouseMoveListener
      if(canvasRef.current) {
        canvasRef.current.addEventListener('mousemove', mouseMoveListener)
      }

      // window.addEventListener('mousemove', mouseMoveListener)
    }

    function initMouseUpListener() {
      const listener = () => {
        console.log('Mouse is up')
        if (pointsRef.current.length > 0) {
          setDisableSaveSignature(false)
        }
        isDrawingRef.current = false
        prevPointRef.current = null
      }
      mouseUpListenerRef.current = listener

      if(canvasRef.current) {
        canvasRef.current.addEventListener('mouseup', listener)
      }
      // window.addEventListener('mouseup', listener)
    }

    function cleanup() {
      if (mouseMoveListenerRef.current) {
        if(canvasRef.current) {
          canvasRef.current.removeEventListener('mousemove', mouseMoveListenerRef.current)
        }
        // window.removeEventListener('mousemove', mouseMoveListenerRef.current)
      }
      if (mouseUpListenerRef.current) {
        if(canvasRef.current) {
          canvasRef.current.removeEventListener('mouseup', mouseUpListenerRef.current)
        }
        // window.removeEventListener('mouseup', mouseUpListenerRef.current)
      }
    }

    initMouseMoveListener()
    initMouseUpListener()
    return () => cleanup()
  }, [onDraw, canvasRef.current])

  return {
    setCanvasRef,
    onCanvasMouseDown,
    drawDot,
    clearCanvas,
    canvasRef,
    pointsRef,
  }
}
