import { Box } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { DocumentTable } from '../__Table'
import { useEffect } from 'react'
import { actions } from '@esign-web/redux/document'
import { useDispatch } from 'react-redux'
import MButton from 'src/app/components/Button'
import { baseApi } from '@esign-web/libs/utils'
import { DOCUMENT_SET_DETAIL } from 'libs/redux/document/src/lib/constants'

export const DocumentDetail = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const documentId = searchParams.get('id')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await baseApi.get(`/document/info/${documentId}`)
        dispatch({
          type: DOCUMENT_SET_DETAIL,
          payload: res.data,
        })
      } catch (error) {}
    })()

    return () => {
      dispatch({
        type: DOCUMENT_SET_DETAIL,
        payload: null,
      })
    }
  }, [])

  return (
    <Box sx={{ overflowY: 'auto', flex: 1, width: '100%' }}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
            minHeight: '500px',
            width: '100%',
            padding: '1rem',
            backgroundColor: 'var(--gray3)',
          }}
        ></Box>
      </Box>
      <MButton
        onClick={() => {
          navigate(`/document/sign?id=${documentId}`)
        }}
        disableRipple
        sx={{
          backgroundColor: 'var(--orange1)',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '9px',
          justifyContent: 'center',
          gap: '0.6rem',
          width: 'fit-content',
          padding: '10px 30px',
        }}
      >
        <span style={{ color: 'var(--white)', fontSize: '1.67rem', fontWeight: 'bold', letterSpacing: '1px' }}>Sign now</span>
      </MButton>
      {/* <DocumentTable /> */}
    </Box>
  )
}
