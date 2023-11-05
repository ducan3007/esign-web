import { Box, Typography } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { DocumentTable } from '../__Table'
import { useEffect } from 'react'
import { actions, selectors } from '@esign-web/redux/document'
import { useDispatch, useSelector } from 'react-redux'
import MButton from 'src/app/components/Button'
import { baseApi } from '@esign-web/libs/utils'
import { DOCUMENT_SET_DETAIL } from 'libs/redux/document/src/lib/constants'
import moment from 'moment'

export const DocumentDetail = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const documentDetail = useSelector(selectors.getDocumentDetail)
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
  console.log(documentDetail)
  return (
    <Box sx={{ overflowY: 'auto', flex: 1, width: '100%' }}>
      <Box sx={{ width: '100%', display: 'flex' }}>
        <Box sx={{ flex: 0.7, height: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <img
            style={{
              borderRadius: '12px',
              backgroundColor: 'var(--ac)',
              objectFit: 'contain',
              padding: '20px',
              maxWidth: '100%',
              maxHeight: '700px',
              // width: '700px',
            }}
            src={documentDetail?.thumbnail}
          />
        </Box>
        <Box sx={{ flex: 1, marginTop: '20px', height: '90vh', overflowY: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ marginTop: '22px' }}>
              <Typography sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--dark2)' }}> {documentDetail?.name}</Typography>
              <Typography sx={{ fontSize: '1.6rem', fontWeight: '300', color: 'var(--dark2)' }}>
                {moment(documentDetail?.updatedAt).format('L')} - {moment(documentDetail?.updatedAt).format('hh:mm A')}
              </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blue3)', marginTop: '20px' }}>Author</Typography>
              <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>
                Full name: {documentDetail?.user?.first_name} {documentDetail?.user?.last_name}
              </Typography>
              <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>Email: {documentDetail?.user?.email}</Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blue3)', marginTop: '20px' }}>Metadata</Typography>
              <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>
                Sequence: {documentDetail?.sequence} / {documentDetail?.number_of_clone}
              </Typography>
              <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>Scan status: {documentDetail?.scan_status || 'N/A'}</Typography>
              <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>Sign status: {documentDetail?.status || 'N/A'}</Typography>
              <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>Hash: {documentDetail?.hash256}</Typography>
              <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>Original hash: {documentDetail?.orginial_hash_256}</Typography>
              <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>Final hash: {documentDetail?.final_hash256 || 'N/A'}</Typography>
              <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>Transaction: {documentDetail?.transaction_hash || 'N/A'}</Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blue3)', marginTop: '20px' }}>Signers</Typography>
              {documentDetail?.document_signer?.map((signer, index) => {
                let status = signer?.is_signed ? 'Signed' : 'Not signed'
                return (
                  <Box
                    key={index}
                    sx={{
                      marginTop: '20px',
                      width: '940px',
                      padding: '20px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--lightaa)',
                    }}
                  >
                    <Typography sx={{ fontSize: '2rem' }}>Email: {signer?.user_email}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Status: {status}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>
                      Sign at: {signer?.signedAt ? new Date(signer?.signedAt).toLocaleString() : 'N/A'}
                    </Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Tx Hash: {signer?.tx_hash || 'N/A'}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>
                      Tx Timestamp: {signer?.tx_timestamp ? new Date(signer?.tx_timestamp).toLocaleString() : 'N/A' || 'N/A'}
                    </Typography>
                    <Typography sx={{ fontSize: '2rem' }}>Address: {signer?.sign_address || 'N/A'}</Typography>
                  </Box>
                )
              })}
              {documentDetail?.document_signer?.length === 0 && (
                <Typography sx={{ fontSize: '1.8rem', color: 'var(--dark2)' }}>No signer</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
