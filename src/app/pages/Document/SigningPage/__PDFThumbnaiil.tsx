import { Typography } from '@mui/material'
import { memo } from 'react'
import { Thumbnail } from 'react-pdf'

type PDFThumbnailProps = {
  index: number
  indexToScroll: number
  setIndexToScroll: (index: number) => void
}
const PDFThumbnail = (props: PDFThumbnailProps) => {
  const { index, indexToScroll, setIndexToScroll } = props
  return (
    <>
      <Thumbnail
        pageNumber={index + 1}
        className={indexToScroll === index ? 'pdf-thumbnail selected' : 'pdf-thumbnail'}
        loading={''}
        scale={1}
        width={150}
        height={183}
        onItemClick={(e) => {
          setIndexToScroll(e.pageIndex)
        }}
      />
      <Typography sx={{ color: 'var(--dark)', fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center', padding: '1rem' }}>{index + 1}</Typography>
    </>
  )
}

export default PDFThumbnail
