import { DndContext } from '@dnd-kit/core'
import { actions, selectors } from '@esign-web/redux/document'
import { selectors as authSelectors } from '@esign-web/redux/auth'
import { Box, Divider, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { NotFoundPage } from '../../404NotFound'
import RenderPDF from './__RenderPDF'
import RenderPDFSkeleton from './__RenderPDFSkeleton'
import { RenderSignature } from './__RenderSignature'
import RenderSigners, { signersProps } from './__RenderSigner'
import './styles.scss'
import { useUnSavedChangesWarning } from 'src/app/components/hook/unSaveChangesWarning'

export const DocumentSignningPage = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()

  const documentId = searchParams.get('id')

  const documentFromStore = useSelector(selectors.getDoucmentFromStore(documentId))

  /*  For PDF Skeleton Loading */
  const [isPDFLoaded, setIsPDFLoaded] = useState(false)

  /* For selected Signer */
  const [selectedSignerId, setSelectedSignerId] = useState<any>('')

  /* Copy of previous signers before update  */
  // const [signerPrev, setSignerPrev] = useState<signersProps>({})

  if (!documentId) return <NotFoundPage />

  console.log('documentFromStore', documentFromStore)

  useEffect(() => {
    return () => {
      dispatch(actions.clearAllSigners({}))
    }
  }, [])

  /* TODO: check if there is any unsaved work */
  // useUnSavedChangesWarning({ condition: true })

  return (
    <DndContext>
      <Box id="signing-container" sx={{ flex: 1, width: '100%', overflow: 'hidden' }}>
        <Box></Box>
        <Box sx={{ display: 'flex' }}>
          <RenderLeftSide selectedSignerId={selectedSignerId} setSelectedSignerId={setSelectedSignerId} />

          <Box sx={{ flex: 1, position: 'relative' }}>
            <RenderPDF documentId={documentId} setIsPDFLoaded={setIsPDFLoaded} />
            {!isPDFLoaded && <RenderPDFSkeleton />}
          </Box>
        </Box>
      </Box>
    </DndContext>
  )
}

const RenderLeftSide = (props: any) => {
  const { selectedSignerId, setSelectedSignerId } = props
  const dispatch = useDispatch()
  const signers = useSelector(selectors.getSigners)
  const signer2 = useSelector(selectors.getSigners2)
  const authState = useSelector(authSelectors.getAuthState)

  /* Effect: Initiate values for state */
  useEffect(() => {
    const payload = {
      id: authState.data?.id,
      firstName: authState.data?.first_name,
      lastName: authState.data?.last_name,
      email: authState.data?.email,
      color: 'rgb(15,192,197)',
      fields: 0,
    }
    if (Object.keys(signers).length === 0) {
      dispatch(actions.setSigners(payload))
      dispatch(actions.setSigner2(payload))
      setSelectedSignerId(payload.id)
    }
    return () => {
      console.log('11 cleanup')
      dispatch(actions.updateAllSigners({}))
    }
  }, [])

  // useEffect(() => {
  //   dispatch(actions.updateAllSigners2(signers))
  // }, [signers])

  /* Effect: Update signerPrev when signers change */

  console.log('123 authState', authState)
  console.log('123 signers', signers)
  console.log('123 selectedSignerId', selectedSignerId)

  return (
    <Box sx={{ width: '350px', padding: '1rem 1rem 1rem 1rem' }}>
      <RenderSigners selectedSigner={signer2[selectedSignerId] || {}} setSelectedSignerId={setSelectedSignerId} />
      <Box>
        <Typography
          sx={{
            fontSize: '1.7rem',
            fontWeight: 'bold',
            color: 'var(--orange)',
          }}
        >
          Signatures
        </Typography>
      </Box>
      {/* <Divider sx={{ marginBottom: '20px', borderColor: 'var(--orange1)', borderWidth: '1px' }} /> */}
      <RenderSignature selectedSigner={signer2[selectedSignerId] || {}} />

      <Box>
        <Typography
          sx={{
            fontSize: '1.7rem',
            fontWeight: 'bold',
            color: 'var(--orange)',
          }}
        >
          Details
        </Typography>
      </Box>
      {/* <Divider sx={{ marginBottom: '20px', borderColor: 'var(--orange1)', borderWidth: '1px' }} /> */}
    </Box>
  )
}
