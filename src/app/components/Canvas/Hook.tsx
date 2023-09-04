import { useEffect, useRef } from 'react'

export function useOnDraw(onDraw: any, drawDot: any, setDisableSaveSignature: any, width: number, height: number) {
  const canvasRef = useRef<any>(null)
  const pointsRef = useRef<any>([])
  const isDrawingRef = useRef<any>(false)
  const prevPointRef = useRef<any>(null) /* Previous point of mouse, is used to change Color */
  const boundRectMinRef = useRef<any>({ top: 9999, left: 9999 }) /* Rect of actual canvas Min XY */
  const boundRectMaxRef = useRef<any>({ top: -9999, left: -9999 }) /* Rect of actual canvas Max XY */

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
    calculateBoundRect(x, y)
  }

  function calculateBoundRect(left: number, top: number) {
    if (left < boundRectMinRef.current.left) {
      boundRectMinRef.current.left = left
    }
    if (top < boundRectMinRef.current.top) {
      boundRectMinRef.current.top = top
    }
    if (left > boundRectMaxRef.current.left) {
      boundRectMaxRef.current.left = left
    }
    if (top > boundRectMaxRef.current.top) {
      boundRectMaxRef.current.top = top
    }
  }

  function clearCanvas(isClearAll = false) {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      if (isClearAll) {
        pointsRef.current = []
        boundRectMinRef.current = { top: 9999, left: 9999 }
        boundRectMaxRef.current = { top: -9999, left: -9999 }
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
          const point = computePointInCanvas(e.clientX, e.clientY) as any
          const ctx = canvasRef.current.getContext('2d')

          if (onDraw) {
            if (point.x < 5 || point.y < 5 || point.x > width - 5 || point.y > height - 5) {
              // console.log('Mouse is uppppppppppppp')
              // isDrawingRef.current = false
              // prevPointRef.current = null
            } else {
              onDraw(ctx, point, prevPointRef.current)
              prevPointRef.current = point
            }
          }
          // if (point) {
          // console.log(point)
          calculateBoundRect(point.x, point.y)
          // }
        }
      }
      mouseMoveListenerRef.current = mouseMoveListener
      if (canvasRef.current) {
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

      if (canvasRef.current) {
        canvasRef.current.addEventListener('mouseup', listener)
      }
      // window.addEventListener('mouseup', listener)
    }

    function cleanup() {
      if (mouseMoveListenerRef.current) {
        if (canvasRef.current) {
          canvasRef.current.removeEventListener('mousemove', mouseMoveListenerRef.current)
        }
        // window.removeEventListener('mousemove', mouseMoveListenerRef.current)
      }
      if (mouseUpListenerRef.current) {
        if (canvasRef.current) {
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
    boundRectRefMin: boundRectMinRef,
    boundRectRefMax: boundRectMaxRef,
  }
}
