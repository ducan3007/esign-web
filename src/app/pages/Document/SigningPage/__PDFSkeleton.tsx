import { Box, Skeleton } from '@mui/material'
import { memo } from 'react'

const RenderPDFSkeleton = () => {
  return (
    <Box
      sx={{
        flex: 1,
        padding: '10px',
        border: '1px solid var(--gray3)',
        display: 'flex',
        height: window.innerHeight - 8 * 10,
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: 1000,
        backgroundColor: 'var(--light-gray)',
      }}
    >
      <Box sx={{ flex: 1, padding: '10px', marginLeft: '7rem', marginRight: '6rem', backgroundColor: 'white' }}>
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '70px', borderRadius: '30px' }} animation="wave" width={'54%'} height={30} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '120px', borderRadius: '30px' }} animation="wave" width={'45%'} height={30} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '70px', borderRadius: '30px' }} animation="wave" width={'80%'} height={30} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '60px', borderRadius: '30px' }} animation="wave" width={'75%'} height={30} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '60px', borderRadius: '30px' }} animation="wave" width={'80%'} height={30} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '60px', borderRadius: '30px' }} animation="wave" width={'90%'} height={30} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '70px', borderRadius: '30px' }} animation="wave" width={'78%'} height={30} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '70px', borderRadius: '30px' }} animation="wave" width={'90%'} height={30} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '50px', borderRadius: '30px' }} animation="wave" width={'90%'} height={30} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '30px', borderRadius: '30px' }} animation="wave" width={'95%'} height={30} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '70px', borderRadius: '30px' }} animation="wave" width={'95%'} height={30} />
      </Box>
      <Box sx={{ width: '220px', padding: '10px 25px 25px 25px', borderLeft: '1px solid var(--gray3)', backgroundColor: 'white' }}>
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '50px' }} animation="wave" width={'100%'} height={200} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '50px' }} animation="wave" width={'100%'} height={200} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '50px' }} animation="wave" width={'100%'} height={200} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '50px' }} animation="wave" width={'100%'} height={200} />
        <Skeleton sx={{ transform: 'scale(1.0)', marginBottom: '50px' }} animation="wave" width={'100%'} height={200} />
      </Box>
    </Box>
  )
}

export default memo(RenderPDFSkeleton)
