import { Box, InputBase, Skeleton } from '@mui/material'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import SignatureEditModal from './_SignatureModal'
import { baseApi } from '@esign-web/libs/utils'
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import { useNavigate } from 'react-router-dom'

const SignaturePage = (props) => {
  const navigate = useNavigate()
  const [signatures, setSignatures] = useState<any>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const res = await baseApi.get('/signature/template')
      console.log('>>>>> res', res)
      setSignatures(res.data)
      setLoading(false)
    })()
  }, [])

  const Item = ({ item }) => {
    return (
      <Box
        sx={{
          width: '100%',
          height: '150px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          border: '2px solid var(--gray3)',
          borderRadius: '5px',
          cursor: 'pointer',
          padding: '5px',
          '&:hover': {
            border: '3px solid var(--orange2)',
          },
        }}
      >
        <img
          src={item.url}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
    )
  }

  const ItemSkeleton = () => {
    return <Skeleton sx={{ transform: 'scale(1.0)' }} animation="wave" width={'100%'} height={150} />
  }

  return (
    <Box
      sx={{
        width: '100%',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <SignatureEditModal />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px ', marginTop: '10px', marginLeft: '10px' }}>
        <Box sx={{ flex: '1', height: '47px' }}>
          <Box
            sx={{
              border: '1px solid var(--gray3)',
              borderRadius: '7px',
              height: '100%',
              width: '50%',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '8px',
              gap: '15px',
            }}
          >
            <SearchSharpIcon sx={{ fontSize: '34px', color: 'var(--dark3)' }} />
            <InputBase
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/document?q=${e.currentTarget.value}`)
                }
              }}
              sx={{
                width: '100%',
                height: '100%',
                fontSize: '1.85rem',
                paddingRight: '30px',
                color: 'var(--dark3)',
                '& .MuiInputBase-input': {
                  '&::placeholder': {
                    color: 'var(--dark3) !important',
                    fontSize: '1.85rem !important',
                    opacity: 0.9,
                  },
                },

                // border: '1px solid var(--gray3)',
              }}
              placeholder="Search signatures"
            ></InputBase>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: '85vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--gray4)',
            borderRadius: '50px',
            border: '1px solid var(--white)',
          },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gridGap: '1rem',
            padding: '1rem',
          }}
        >
          {signatures.map((item, index) => {
            return <Item key={index} item={item} />
          })}
          {signatures.length === 0 &&
            loading === true &&
            Array.from(Array(12).keys()).map((item, index) => {
              return <ItemSkeleton key={index} />
            })}
        </Box>
      </Box>
    </Box>
  )
}
export default SignaturePage
