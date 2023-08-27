// import { useRef, useState } from 'react'
// import { useOnDraw } from './Hook'

// const Canvas = ({ width, height }) => {
//   const [color, setColor] = useState('black')
//   const { setCanvasRef, onCanvasMouseDown, clearCanvas, canvasRef, pointsRef } = useOnDraw(onDraw)

//   function onDraw(ctx, point, prevPoint) {
//     drawLine(prevPoint, point, ctx, color, 5)
//     pointsRef.current.push({
//       start: prevPoint,
//       end: point,
//     })
//   }

//   function changeColor(newColor: string) {
//     setColor(newColor)
//     console.log('Canvas:pointsRef', pointsRef.current)
//     clearCanvas()
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d')
//       pointsRef.current.forEach((point) => {
//         drawLine(point.start, point.end, ctx, newColor, 5)
//       })
//     }
//   }

//   function drawLine(start, end, ctx, color, width) {
//     start = start ?? end
//     ctx.beginPath()
//     ctx.lineWidth = width
//     ctx.strokeStyle = color
//     ctx.moveTo(start.x, start.y)
//     ctx.lineTo(end.x, end.y)
//     ctx.stroke()

//     ctx.fillStyle = color
//     ctx.beginPath()
//     ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI)
//     ctx.fill()
//   }

//   return (
//     <>
//       <canvas width={width} height={height} onMouseDown={onCanvasMouseDown} style={canvasStyle} ref={setCanvasRef} />
//       <button
//         onClick={() => {
//           clearCanvas(true)
//         }}
//       >
//         Clear Canvas
//       </button>
//       <button
//         onClick={() => {
//           changeColor('red')
//         }}
//       >
//         Change Color
//       </button>
//     </>
//   )
// }

// export default Canvas

// const canvasStyle = {
//   border: '1px solid black',
// }
