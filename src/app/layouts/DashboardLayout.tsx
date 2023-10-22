import { selectors } from '@esign-web/redux/auth'
import { Backdrop, Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { Loading } from '../components/Loading'
import { UploadStatusDialog } from '../components/UploadDialogStatus'
import { DashboardHeader } from './Header'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: any
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isBackdropOpen = useSelector(selectors.getBackgroundState)
  const authState = useSelector(selectors.getAuthState)
  const isUnregistered = authState.data?.is_registered === false

  return (
    <Box id="dashboard-layout" sx={{ position: 'relative', display: 'flex', flexDirenction: 'row', width: '100vw', height: '100vh' }}>
      <Box id="sidebar" sx={{ maxWidth: '23.25rem' }}>
        {!isUnregistered && <Sidebar />}
      </Box>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DashboardHeader />
        {children}
      </Box>
      <UploadStatusDialog />
      <Backdrop
        sx={{
          color: '#d0d8e2',
          zIndex: 9999999,
          backgroundColor: 'rgba(0, 0, 0, 0.07)',
        }}
        open={isBackdropOpen}
      >
        <Loading />
      </Backdrop>
    </Box>
  )
}

export default DashboardLayout
