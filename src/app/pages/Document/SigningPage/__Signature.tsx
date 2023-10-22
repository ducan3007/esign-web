import { UserType } from '@esign-web/libs/utils'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { Box } from '@mui/material'
import { useEffect, useState, type CSSProperties, type FC, type ReactNode } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import IconSVG from 'src/app/components/Icon'
import './styles.scss'

export interface BoxProps {
  id: any
  children?: ReactNode
  user: any
  color: any
  isZeroSigner: boolean
}

export const ItemTypes = {
  BOX: 'box',
}

export interface DragItem {
  type: string
  id: string
  top: number
  left: number
  user: UserType
}

export interface ContainerProps {
  hideSourceOnDrag: boolean
}

export interface ContainerState {
  boxes: { [key: string]: { top: number; left: number; title: string } }
}

type props = {
  selectedSigner: {
    id: string
    firstName: string
    lastName: string
    email: string
    color: string
  }
}

export const RenderSignature = (props: props) => {
  const { selectedSigner } = props

  const isZeroSigner = !selectedSigner.id

  console.log('RenderSignature:props', props)
  const [sourceBoxes, setSourceBoxes] = useState<{ [key: string]: {} }>({
    signature: {
      user: {},
      color: 'gray',
      children: <div>signature</div>,
    },
    textField: {
      user: {},
      color: 'gray',
      children: 'Text Field',
    },
    dateField: {
      user: {},
      color: 'gray',
      children: 'Date Field',
    },
    checkbox: {
      user: {},
      color: 'gray',
      children: 'Checkbox',
    },
  })

  useEffect(() => {
    setSourceBoxes({
      signature: {
        user: selectedSigner,
        color: selectedSigner.color || 'gray',
        children: (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '4px' }}>
            <IconSVG type="signature" width="35px" />
            <span style={{ fontSize: '1.6rem', color: 'var(--dark)' }}>Signature</span>
          </Box>
        ),
      },
      textField: {
        user: selectedSigner,
        color: selectedSigner.color || 'gray',
        children: (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1.6rem', marginLeft: '4px' }}>
            <IconSVG type="textField" width="31px" />
            <span style={{ fontSize: '1.6rem', color: 'var(--dark)' }}>Text Field</span>
          </Box>
        ),
      },
      dateField: {
        user: selectedSigner,
        color: selectedSigner.color || 'gray',
        children: (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1.7rem', marginLeft: '6px' }}>
            <IconSVG type="date" width="29px" />
            <span style={{ fontSize: '1.6rem', color: 'var(--dark)' }}>Date Field</span>
          </Box>
        ),
      },
      checkbox: {
        user: selectedSigner,
        color: selectedSigner.color || 'gray',
        children: (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginLeft: '4px' }}>
            <IconSVG type="checkbox" width="36px" />
            <span style={{ fontSize: '1.6rem', color: 'var(--dark)' }}>Checkbox</span>
          </Box>
        ),
      },
    })
  }, [selectedSigner])

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item: DragItem, monitor) {
        return undefined
      },
    }),
    []
  )

  return (
    <Box id="signature_container" sx={{ width: '100%', marginBottom: '1.7rem', marginTop: '1.7rem' }}>
      <div ref={drop} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', transform: 'translate3d(0)' }}>
        {Object.keys(sourceBoxes).map((key) => {
          const { user, color, children } = sourceBoxes[key] as any
          return (
            <BoxItem key={key} id={key} isZeroSigner={isZeroSigner} user={user} color={color}>
              {children}
            </BoxItem>
          )
        })}
        {/* <ResizableBox
          style={{
            border: '1px solid var(--gray3)'
          }}
          width={200}
          height={200}
          minConstraints={[100, 100]}
          maxConstraints={[300, 300]}
        >
          <span>Contents</span>
        </ResizableBox> */}
      </div>
    </Box>
  )
}

export const BoxItem: FC<BoxProps> = ({ id, children, user, color, isZeroSigner }) => {
  const [{ isDragging }, drag, connectDragPreview] = useDrag(
    () => ({
      type: 'box',
      item: { id, user, color },
      canDrag: !isZeroSigner,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),

    [id, user, color, isZeroSigner]
  )

  return (
    <>
      <div
        id={id}
        style={{
          border: `2px solid ${color}`,
          borderLeft: `4px solid ${color}`,
          borderRadius: '4px',
          borderTopLeftRadius: '2px',
          borderBottomLeftRadius: '2px',
          cursor: isZeroSigner ? 'not-allowed' : 'move',
          opacity: isZeroSigner ? 0.5 : 1,
          width: '100%',
          height: '50px',
          position: 'relative',
          display: 'flex',
        }}
        ref={drag}
      >
        <DragIndicatorIcon style={{ fontSize: '2.5rem', color: 'var(--dark2)', transform: 'translateY(50%)' }} />
        {children}
      </div>
    </>
  )
}
